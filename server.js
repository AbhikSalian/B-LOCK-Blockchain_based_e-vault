const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, B-LOCK e-vault!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID'));
