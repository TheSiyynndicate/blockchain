const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");

//UUID
const { v1: uuidv1 } = require("uuid");
const { request } = require("express");
const uuid = uuidv1();

const port = process.argv[2];
const rp = require("request-promise");

const nodeAddress = uuidv1().split("-").join("");

const coin = new Blockchain();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/blockchain", function (req, res) {
  res.send(coin);
});

app.post("/transaction", function (req, res) {
  const newTransaction = req.body;
  const blockIndex = coin.addTransactionToPendingTransactions(newTransaction);

  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.post("/transaction/broadcast", function (req, res) {
  const newTransaction = coin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  coin.addTransactionToPendingTransactions(newTransaction);

  const requestPromises = [];

  coin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/transaction",
      method: "POST",
      body: newTransaction,
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then((data) => {
    res.json({ note: "Transaction created and broadcasted successfully." });
  });
});

app.get("/mine", function (req, res) {
  const lastBlock = coin.getLastBlock();
  const previousBlockHash = lastBlock["hash"];

  const currentBlockData = {
    transactions: coin.pendingTransactions,
    index: lastBlock["index"] + 1,
  };

  const nonce = coin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = coin.hashBlock(previousBlockHash, currentBlockData, nonce);

  const newBlock = coin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];

  coin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/receive-new-block",
      method: "POST",
      body: { newBlock: newBlock },
      json: true,
    };

    requestPromises.push(rp(requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      const requestOptions = {
        uri: coin.currentNodeUrl + "/transaction/broadcast",
        method: "POST",
        body: {
          amount: 12.5,
          sender: "00",
          recipient: nodeAddress,
        },
        json: true,
      };
      return rp(requestOptions);
    })
    .then((data) => {
      res.json({
        note: "New block mined & broadcasted successfully",
        block: newBlock,
      });
    });
});

app.post("/receive-new-block", function (req, res) {
  const newBlock = req.body.newBlock;

  const lastBlock = coin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;

  const correctIndex = lastBlock["index"] + 1 === newBlock["index"];

  if (correctHash && correctIndex) {
    coin.chain.push(newBlock);
    coin.pendingTransactions = [];
    res.json({
      note: "New block received and accepted.",
      newBlock: newBlock,
    });
  } else {
    res.json({
      note: "New block rejected.",
      newBlock: newBlock,
    });
  }
});

//register a node and broadcast it to the network
app.post("/register-and-broadcast-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;

  const notCurrentNode = coin.currentNodeUrl !== newNodeUrl;
  if (coin.networkNodes.indexOf(newNodeUrl) == -1 && notCurrentNode)
    coin.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];
  coin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/register-node",
      method: "POST",
      body: { newNodeUrl: newNodeUrl },
      json: true,
    };
    regNodesPromises.push(rp(requestOptions));
  });
  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisteroptions = {
        uri: newNodeUrl + "/register-nodes-bulk",
        method: "POST",
        body: {
          allNetworkNodes: [...coin.networkNodes, coin.currentNodeUrl],
        },
        json: true,
      };
      return rp(bulkRegisteroptions);
    })
    .then((data) => {
      res.json({ note: "New node registered with network succcessfully" });
    });
});

//register a node with the network
app.post("/register-node", function (req, res) {
  const newNodeUrl = req.body.newNodeUrl;

  const nodeNotAlreadyPresent = coin.networkNodes.indexOf(newNodeUrl == -1);
  const notCurrentNode = coin.currentNodeUrl !== newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode)
    coin.networkNodes.push(newNodeUrl);

  res.json({ note: "New node registered successfully." });
});

//register multiple nodes at once
app.post("/register-nodes-bulk", function (req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;

  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      coin.networkNodes.indexOf(networkNodeUrl) == -1;

    const notCurrentNode = coin.currentNodeUrl !== networkNodeUrl;

    //TODO:
    if (nodeNotAlreadyPresent && notCurrentNode)
      coin.networkNodes.push(networkNodeUrl);
  });
  res.json({ note: "Bulk registeration successful." });
});

app.get("/consensus", function (req, res) {
  const requestPromises = [];

  coin.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true,
    };
    requestPromises.push(rp(requestOptions));
  });
  Promise.all(requestPromises).then((blockchains) => {
    const currentChainLength = coin.chain.length;

    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;

    blockchains.forEach((blockchain) => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length;
        newLongestChain = blockchain.chain;
        newPendingTransactions = blockchain.pendingTransactions;
      }
    });
    if (
      !newLongestChain ||
      (newLongestChain && !coin.chainIsValid(newLongestChain))
    ) {
      res.json({
        note: "Current chain has not been replaced",
        chain: coin.chain,
      });
    } else {
      coin.chain = newLongestChain;
      coin.pendingTransactions = newPendingTransactions;
      res.json({
        note: "This chain has been replaced.",
        chain: coin.chain,
      });
    }
  });
});

app.get("/block/:blockHash", function (req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = coin.getBlock(blockHash);

  res.json({
    block: correctBlock,
  });
});

app.get("/transaction/:transactionId", function (req, res) {
  const transactionId = req.params.transactionId;
  const transactionData = coin.getTransaction(transactionId);

  res.json({
    transaction: transactionData.transaction,
    block: transactionData.block,
  });
});

app.get("/address/:address", function (req, res) {
  const address = req.params.address;
  const addressData = coin.getAddressData(address);

  res.json({
    addressData: addressData,
  });
});


app.get('/block-explorer',function(req,res){
  res.sendFile('./block-explorer/index.html',{root: __dirname});
});

app.listen(port, function (req, res) {
  console.log(`Listening on port ${port}...`);
});
