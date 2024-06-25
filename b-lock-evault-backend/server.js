// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const Web3 = require('web3');
const { create } = require('ipfs-http-client');
const ipfs = create('https://ipfs.infura.io:5001/api/v0');

// Initialize Express app
const app = express();

// Use CORS middleware
app.use(cors());

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Database setup with Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Import and define User model
const User = require('./models/user')(sequelize, DataTypes);
// Import and define File model
const File = require('./models/file')(sequelize, DataTypes);

// Ensure database sync
sequelize.sync();

// Blockchain setup
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

// ABI and contract address
const BlockVaultABI = require('./build/contracts/BLockVault.json').abi; // ABI from Truffle
const BlockVaultAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

const blockVault = new web3.eth.Contract(BlockVaultABI, BlockVaultAddress);

// Routes

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to B-LOCK e-vault!');
});

// API to upload file metadata
app.post('/upload', async (req, res) => {
  try {
    const { address, fileName, fileContent } = req.body;

    // Add file to IPFS
    const file = await ipfs.add(fileContent);
    const fileHash = file.path;

    // Store metadata on blockchain
    const receipt = await blockVault.methods.uploadFile(fileName, fileHash).send({ from: address });

    // Save metadata in database
    let user = await User.findByPk(address);
    if (!user) {
      user = await User.create({ address });
    }
    await File.create({ fileName, fileHash, UserId: user.id });

    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API to get user's files
app.get('/files/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const user = await User.findByPk(address, { include: [File] });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.Files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
