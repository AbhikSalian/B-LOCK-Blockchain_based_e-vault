import React, { useState } from 'react';
import axios from 'axios';
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

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      const fileData = reader.result;
      const transaction = {
        user: "user1",
        v_file: file.name,
        file_data: fileData,
        file_size: file.size
      };

      try {
        await axios.post('http://localhost:8800/new_transaction', transaction);
        await axios.get('http://localhost:8800/mine');
        setUploadMessage('File uploaded successfully!');
        onFileUpload(transaction);
      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadMessage('Error uploading file. Check the console for more details.');
      }
    };
  };

  return (
    <div className="file-uploader">
      <h3>Upload a file</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to Blockchain</button>
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default FileUploader;