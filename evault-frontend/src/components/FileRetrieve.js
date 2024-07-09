import React, { useState } from 'react';
import './FileRetrieve.css';

const FileRetrieve = () => {
  const [retrieveMessage, setRetrieveMessage] = useState('');

  const handleRetrieve = () => {
    // Logic for file retrieval
    setRetrieveMessage('Files retrieved successfully!');
    console.log("Retrieve button clicked");
  };

  return (
    <div className="file-retrieve">
      <button onClick={handleRetrieve}>
        Retrieve Files
      </button>
      {retrieveMessage && <p className="retrieve-message">{retrieveMessage}</p>}
    </div>
  );
};

export default FileRetrieve;
