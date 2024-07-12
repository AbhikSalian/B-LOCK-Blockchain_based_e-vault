import React, { useState } from 'react';
import axios from 'axios';
import './FileRetrieve.css';

const FileRetrieve = () => {
  const [fileList, setFileList] = useState([]);
  const [retrieveMessage, setRetrieveMessage] = useState('');

  const handleRetrieve = async () => {
    try {
      const response = await axios.get('http://localhost:8800/chain');
      const chain = response.data.chain;
      const files = chain.flatMap(block => block.transactions);
      setFileList(files);
      setRetrieveMessage('Files retrieved successfully!');
    } catch (error) {
      console.error('Error retrieving files:', error);
      setRetrieveMessage('Error retrieving files. Please try again.');
    }
  };

  return (
    <div className="file-retrieve">
      <button onClick={handleRetrieve}>
        Retrieve Files
      </button>
      {retrieveMessage && <p className="retrieve-message">{retrieveMessage}</p>}
      <ul>
        {fileList.map((file, index) => (
          <li key={index}>{file.v_file} ({file.file_size} bytes)</li>
        ))}
      </ul>
    </div>
  );
};

export default FileRetrieve;
