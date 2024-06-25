import React, { useState } from 'react';
import './FileRetrieval.css';

const FileRetrieval = ({ onFileRetrieve }) => {
  const [ipfsHash, setIpfsHash] = useState('');
  const [retrievalMessage, setRetrievalMessage] = useState('');

  const handleRetrieve = async () => {
    if (ipfsHash) {
      try {
        setRetrievalMessage('File retrieved successfully!');
        onFileRetrieve(ipfsHash);
      } catch (error) {
        console.error('Error retrieving file from IPFS', error);
        setRetrievalMessage('Error retrieving file.');
      }
    }
  };

  return (
    <div className="file-retrieval">
      <h3>Retrieve a file</h3>
      <input
        type="text"
        placeholder="Enter IPFS hash"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
      />
      <button onClick={handleRetrieve}>Retrieve from IPFS</button>
      {retrievalMessage && <p className="retrieval-message">{retrievalMessage}</p>}
    </div>
  );
};

export default FileRetrieval;
