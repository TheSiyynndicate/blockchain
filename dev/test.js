const Blockchain = require("./blockchain");

const coin = new Blockchain();

const bc1 = {
    "chain": [
    {
    "index": 1,
    "timestamp": 1613828228570,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1613828268894,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestamp": 1613828334058,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "ba6dd3a0738011eb973c4d44342af43e",
    "transactionId": "d27c6d30738011eb973c4d44342af43e"
    },
    {
    "amount": 10,
    "sender": "VY26DFNO7NJ2R3CY7F",
    "recipient": "T2D6DFNO7NJ5R3CE3A",
    "transactionId": "ed445a60738011eb973c4d44342af43e"
    },
    {
    "amount": 20,
    "sender": "VY26DFNO7NJ2R3CY7F",
    "recipient": "T2D6DFNO7NJ5R3CE3A",
    "transactionId": "f05061e0738011eb973c4d44342af43e"
    },
    {
    "amount": 30,
    "sender": "VY26DFNO7NJ2R3CY7F",
    "recipient": "T2D6DFNO7NJ5R3CE3A",
    "transactionId": "f2d3b160738011eb973c4d44342af43e"
    }
    ],
    "nonce": 34929,
    "hash": "0000bb657354243c5ec3228c9c4db6f9107ad3d7465a45be2ffae6c4a537f325",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestamp": 1613828416051,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "ba6dd3a0738011eb973c4d44342af43e",
    "transactionId": "f94e79d0738011eb973c4d44342af43e"
    },
    {
    "amount": 40,
    "sender": "VY26DFNO7NJ2R3CY7F",
    "recipient": "T2D6DFNO7NJ5R3CE3A",
    "transactionId": "20e7a700738111eb973c4d44342af43e"
    },
    {
    "amount": 50,
    "sender": "VY26DFNO7NJ2R3CY7F",
    "recipient": "T2D6DFNO7NJ5R3CE3A",
    "transactionId": "22a842c0738111eb973c4d44342af43e"
    },
    {
    "amount": 60,
    "sender": "VY26DFNO7NJ2R3CY7F",
    "recipient": "T2D6DFNO7NJ5R3CE3A",
    "transactionId": "247820c0738111eb973c4d44342af43e"
    },
    {
    "amount": 70,
    "sender": "VY26DFNO7NJ2R3CY7F",
    "recipient": "T2D6DFNO7NJ5R3CE3A",
    "transactionId": "2685f220738111eb973c4d44342af43e"
    }
    ],
    "nonce": 11521,
    "hash": "0000eeaeaf87cdde77bf7bf4ce75a22c33db33e69273d0868c6a00b762cd9ef5",
    "previousBlockHash": "0000bb657354243c5ec3228c9c4db6f9107ad3d7465a45be2ffae6c4a537f325"
    },
    {
    "index": 5,
    "timestamp": 1613828431476,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "ba6dd3a0738011eb973c4d44342af43e",
    "transactionId": "2a2d9d60738111eb973c4d44342af43e"
    }
    ],
    "nonce": 8047,
    "hash": "0000ee669397668214d61df7add5e4e15677190a954ab8e2b0861c9034f9be5d",
    "previousBlockHash": "0000eeaeaf87cdde77bf7bf4ce75a22c33db33e69273d0868c6a00b762cd9ef5"
    },
    {
    "index": 6,
    "timestamp": 1613828434503,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "ba6dd3a0738011eb973c4d44342af43e",
    "transactionId": "335f6f80738111eb973c4d44342af43e"
    }
    ],
    "nonce": 171524,
    "hash": "0000399b3c70e1377ad8ae2b97af64f35a8f3db5c225ce9b4d1d85fa2882aa42",
    "previousBlockHash": "0000ee669397668214d61df7add5e4e15677190a954ab8e2b0861c9034f9be5d"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "ba6dd3a0738011eb973c4d44342af43e",
    "transactionId": "352d0390738111eb973c4d44342af43e"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    };


    console.log('VALID: ',coin.chainIsValid(bc1.chain));
