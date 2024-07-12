import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = () => {
  const [uploadMessage, setUploadMessage] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8800/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadMessage('File uploaded successfully!');
      console.log('File uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Error uploading file. Please try again.');
    }
  };

  return (
    <div className="file-upload">
      <label className="custom-file-upload">
        <input type="file" onChange={handleUpload} />
        Upload File
      </label>
      {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default FileUpload;
