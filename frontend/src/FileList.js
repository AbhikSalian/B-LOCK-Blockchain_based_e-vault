import React from 'react';
import './FileList.css';

const FileList = ({ files }) => {
  return (
    <div className="file-list">
      <h3>Uploaded Files</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <a href={`https://ipfs.io/ipfs/${file}`} target="_blank" rel="noopener noreferrer">
              {file}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
