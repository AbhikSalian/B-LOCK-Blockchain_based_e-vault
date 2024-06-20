const express = require('express');
const multer = require('multer');
const Web3 = require('web3');
const DocumentManagerABI = require('./build/contracts/DocumentManager.json').abi;

const app = express();
const port = 3000;

// Connect to local Ethereum blockchain
const web3 = new Web3('http://localhost:8545');
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
const DocumentManager = new web3.eth.Contract(DocumentManagerABI, contractAddress);

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Document API
app.post('/uploadDocument', upload.single('file'), async (req, res) => {
    try {
        const { originalname, buffer } = req.file;
        const fileHash = web3.utils.sha3(buffer); // Simplified hash for demonstration
        const accounts = await web3.eth.getAccounts();
        await DocumentManager.methods.addDocument(fileHash).send({ from: accounts[0] });
        res.send({ message: 'Document uploaded', fileHash });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Retrieve Document API
app.get('/getDocument/:documentId', async (req, res) => {
    try {
        const { documentId } = req.params;
        const document = await DocumentManager.methods.getDocument(documentId).call();
        res.send(document);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
