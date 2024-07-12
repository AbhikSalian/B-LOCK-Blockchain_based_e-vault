const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Web3 = require('web3');

const app = express();
const port = 8800;

// Replace 'YOUR_INFURA_PROJECT_ID' with your actual Infura project ID
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID'));

app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); // Serve files from the uploads directory

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// In-memory storage for blockchain data
const blockchain = {
  chain: [
    {
      transactions: [
        { user: 'user1', v_file: 'file1.txt', file_data: 'Hello World', file_size: 11 },
        { user: 'user2', v_file: 'file2.txt', file_data: 'Hello Again', file_size: 11 },
      ],
    },
    // Add more blocks as needed
  ],
};

// Endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const transaction = {
    user: "user1", // This should be dynamically set based on the user
    v_file: req.file.filename,
    file_data: req.file.path,
    file_size: req.file.size
  };

  blockchain.chain[0].transactions.push(transaction); // Add to the first block for simplicity

  res.json({ message: 'File uploaded successfully!', transaction });
});

// Endpoint to retrieve blockchain data
app.get('/chain', (req, res) => {
  res.json(blockchain);
});

// Endpoint to download a file
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file.');
      }
    });
  } else {
    res.status(404).send('File not found.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
