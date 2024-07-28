// Retrieve.js
import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Retrieve.css';

function Retrieve({ user, sortConfig, setSortConfig }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5);

  const modalRef = useRef(null); // Create a ref to track the modal

  useEffect(() => {
    const fetchFiles = async () => {
      const filesCollection = collection(db, 'files');
      const filesSnapshot = await getDocs(filesCollection);
      const filesList = filesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFiles(filesList);
    };

    fetchFiles();
  }, []);

  const handleDownload = (file) => {
    // Implement your download logic here
    console.log('Downloading file:', file);
  };

  const handleView = (file) => {
    setSelectedFile(file);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenInNewTab = (url) => {
    window.open(url, '_blank');
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [selectedFile]);

  const sortedFiles = React.useMemo(() => {
    const sorted = [...files];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [files, sortConfig]);

  // Pagination logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = sortedFiles.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const closeModal = () => {
    setSelectedFile(null);
  };

  return (
    <div className="stored-files">
      <h2>Retrieve Files</h2>

      <div className="sort-container">
        <button onClick={() => handleSort('name')}>Sort by Name</button>
        <button onClick={() => handleSort('date')}>Sort by Date</button>
      </div>

      <ul className="file-list">
        {currentFiles.map((file) => (
          <li key={file.id}>
            <span>{file.name}</span>
            <div className="actions">
              <button onClick={() => handleView(file)}>View</button>
              <button onClick={() => handleDownload(file)}>Download</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        {[...Array(Math.ceil(files.length / filesPerPage))].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {selectedFile && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h3>File Details</h3>
            <p className="modal-text"><strong>Name:</strong> {selectedFile.name}</p>
            <p className="modal-text"><strong>Date:</strong> {selectedFile.date}</p>
            <p className="modal-text"><strong>Description:</strong> {selectedFile.description}</p>
            <div className="image-container">
              <img src={selectedFile.url} alt={selectedFile.name} />
            </div>
            <div className="modal-actions">
              <button onClick={() => handleDownload(selectedFile)}>Download</button>
              <button onClick={() => handleOpenInNewTab(selectedFile.url)}>Open in New Tab</button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Retrieve;
