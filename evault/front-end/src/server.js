const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors());

// Proxy endpoint to forward requests to Pinata
app.post('/api/upload-to-ipfs', async (req, res) => {
  try {
    const { file } = req.body; // Assuming you send the file as a JSON body parameter

    // Forward the request to Pinata
    const response = await axios.post('https://gateway.pinata.cloud/api/v0/add', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Add any necessary authentication headers if required by Pinata
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
