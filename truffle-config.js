const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", 
    },
    rinkeby: {
      provider: () => new HDWalletProvider({
        privateKeys: [process.env.PRIVATE_KEY],
        providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
        pollingInterval: 15000  // Increase polling interval
      }),
      network_id: 4,
      gas: 5500000,
      gasPrice: 20000000000, // 20 Gwei
      confirmations: 2,
      timeoutBlocks: 200,   // Increase the number of blocks to wait
      networkCheckTimeout: 1000000, // Increase network check timeout
      skipDryRun: true
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.21",
    }
  }
};
