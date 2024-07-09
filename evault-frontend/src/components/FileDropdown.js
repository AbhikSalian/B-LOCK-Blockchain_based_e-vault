import React, { useState } from 'react';
import './FileDropdown.css';

const FileDropdown = () => {
  const [files, setFiles] = useState([
    'file1.txt',
    'file2.pdf',
    'file3.jpg',
    // Example files, replace with dynamic fetch from backend
  ]);

  const handleDownload = (file) => {
    // Logic for downloading a file
    console.log("Download file:", file);
  };

  return (
    <div className="file-dropdown">
      <select onChange={(e) => handleDownload(e.target.value)} defaultValue="">
        <option value="" disabled>Select a file</option>
        {files.map((file, index) => (
          <option key={index} value={file}>
            {file}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FileDropdown;
