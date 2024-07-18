import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FileDownload() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of files from the backend
    axios.get('http://localhost:8800/files')
      .then(response => {
        setFiles(response.data);
      })
      .catch(error => {
        console.error('Error fetching files:', error);
      });
  }, []);

  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h3>Available Files</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.name}
            <button onClick={() => handleDownload(`http://localhost:8800${file.url}`, file.name)}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileDownload;
