import React, { useState } from 'react';
import { create } from 'ipfs-http-client';
import './FileUploader.css';

const FileUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file first.');
      return;
    }

    const client = create('https://ipfs.infura.io:5001/api/v0');
    try {
      const added = await client.add(file);
      const ipfsHash = added.path;
      setUploadMessage('File uploaded successfully!');
      onFileUpload(ipfsHash);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      setUploadMessage('Error uploading file.');
    }
  };

  return (
    <div className="file-uploader">
      <h3>Upload a file</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to IPFS</button>
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default FileUploader;
