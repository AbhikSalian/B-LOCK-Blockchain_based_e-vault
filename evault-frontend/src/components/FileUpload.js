import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [uploadMessage, setUploadMessage] = useState('');

  const handleUpload = (e) => {
    // Logic for file upload
    setUploadMessage('File uploaded successfully!');
    console.log("File selected:", e.target.files[0]);
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
