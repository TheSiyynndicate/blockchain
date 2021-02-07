const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(892348,'A90SDNF09A0N','OIANS909A0S9NF');

bitcoin.createNewTransaction(100,'ALEX89ANSD759DFTG','JENNUUN0A5648GF');

bitcoin.createNewBlock(123123,'6758NF09A0N','687O909A0S9NF');

bitcoin.createNewTransaction(50,'ALEX89ANSD759DFTG','JENNUUN0A5648GF');
bitcoin.createNewTransaction(300,'ALEX89ANSD759DFTG','JENNUUN0A5648GF');
bitcoin.createNewTransaction(2000,'ALEX89ANSD759DFTG','JENNUUN0A5648GF');

bitcoin.createNewBlock(123123,'AI6734R67GDE','Y655IVE5GS2');

console.log(bitcoin.chain[2]); 
