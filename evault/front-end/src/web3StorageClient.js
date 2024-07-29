import { Web3Storage } from 'web3.storage';

// Get your Web3.Storage API token from the dashboard
const token = 'YOUR_WEB3_STORAGE_API_TOKEN';

function makeStorageClient() {
  return new Web3Storage({ token });
}

export default makeStorageClient;
