const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Proxy endpoint to forward requests to Pinata
app.post('/api/upload-to-ipfs', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    // Forward the request to Pinata
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.PINATA_JWT}`, // Replace with your Pinata JWT token
      },
    });

    // Forward Pinata's response back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request to Pinata:', error.message);
    res.status(500).json({ error: 'Failed to proxy request to Pinata' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
