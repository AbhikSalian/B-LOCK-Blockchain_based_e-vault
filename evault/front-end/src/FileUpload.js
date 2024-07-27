import React from 'react';

function FileUpload({ evault, account, setMessage, handleFileChange, storeFile, message }) {
  return (
    <div className="upload-box">
      <h2>Upload a file</h2>
      <form onSubmit={storeFile}>
        <div className="file-input-container">
          <input type="file" onChange={handleFileChange} multiple required />
          <button type="submit">Upload to Blockchain</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default FileUpload;
