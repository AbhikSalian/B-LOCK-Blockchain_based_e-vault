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
        providerOrUrl: process.env.INFURA_PROJECT_ID,
        pollingInterval: 15000
      }),
      network_id: 4,
      gas: 5500000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200,
      networkCheckTimeout: 1000000,
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
