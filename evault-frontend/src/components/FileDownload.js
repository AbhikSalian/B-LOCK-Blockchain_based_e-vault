import React from 'react';

function FileDownload() {
  const handleDownload = () => {
    // Replace the URL with the actual file URL you want to download
    const fileUrl = '/path/to/your/file.ext';
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'filename.ext'); // Replace with desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload}>
      Download
    </button>
  );
}

export default FileDownload;
