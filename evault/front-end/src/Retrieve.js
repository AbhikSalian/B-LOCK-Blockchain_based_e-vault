import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './Retrieve.css';

const Retrieve = ({ account }) => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5);
  const [sortOption, setSortOption] = useState("timestamp");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFiles();
  }, [sortOption]);

  const fetchFiles = async () => {
    try {
      const q = query(collection(db, "files"), orderBy(sortOption, "asc"));
      const querySnapshot = await getDocs(q);
      const filesData = querySnapshot.docs
      .map(doc => ({ ...doc.data(), id: doc.id }))
      .filter(file => file.owner === account); // Filter by account
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files", error);
      setMessage("Error fetching files. Check the console for more details.");
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Pagination logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file", error);
      setMessage("Error downloading file. Check the console for more details.");
    }
  };

  return (
    <div>
      <h2>Stored Files</h2>
      <div className="sort-container">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="timestamp">Upload Date</option>
          <option value="name">Name</option>
        </select>
      </div>
      {files.length > 0 ? (
        <>
          <ul>
            {currentFiles.map(file => (
              <li key={file.id}>
                <span>{file.name}</span>
                <button onClick={() => handleDownload(file.downloadURL, file.name)}>Download</button>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from({ length: Math.ceil(files.length / filesPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>No files found.</p>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Retrieve;
