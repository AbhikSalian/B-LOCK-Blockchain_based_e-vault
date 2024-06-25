import React, { useState } from 'react';
import axios from 'axios';
import './FileRetrieval.css';

const FileRetrieval = ({ onFileRetrieve }) => {
  const [fileList, setFileList] = useState([]);
  const [retrieveMessage, setRetrieveMessage] = useState('');

  const handleRetrieve = async () => {
    try {
      const response = await axios.get('http://localhost:8800/chain');
      const chain = response.data.chain;
      const files = chain.flatMap(block => block.transactions);
      setFileList(files);
      onFileRetrieve(files);
      setRetrieveMessage('Files retrieved successfully!');
    } catch (error) {
      console.error('Error retrieving files:', error);
      setRetrieveMessage('Error retrieving files. Check the console for more details.');
    }
  };

  return (
    <div className="file-retrieval">
      <h3>Retrieve files</h3>
      <button onClick={handleRetrieve}>Retrieve from Blockchain</button>
      {retrieveMessage && <p className="retrieve-message">{retrieveMessage}</p>}
      <ul>
        {fileList.map((file, index) => (
          <li key={index}>{file.v_file} ({file.file_size} bytes)</li>
        ))}
      </ul>
    </div>
  );
};

export default FileRetrieval;
