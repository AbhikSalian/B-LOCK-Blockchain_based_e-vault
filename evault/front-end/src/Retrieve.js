import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FaDownload, FaSort, FaEye } from 'react-icons/fa';
import './Retrieve.css';

const Retrieve = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'asc' });
  const [message, setMessage] = useState('');
  const [modalFile, setModalFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [sortConfig]);

  const fetchFiles = async () => {
    try {
      const q = query(collection(db, 'files'), orderBy(sortConfig.key, sortConfig.direction));
      const querySnapshot = await getDocs(q);
      const filesData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFiles(filesData);
    } catch (error) {
      console.error('Error fetching files', error);
      setMessage('Error fetching files. Check the console for more details.');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, fileUrl);
      const url = await getDownloadURL(fileRef);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file', error);
      setMessage('Error downloading file. Check the console for more details.');
    }
  };

  const handlePreview = async (file) => {
    try {
      const storage = getStorage();
      const fileRef = ref(storage, file.downloadURL);
      const url = await getDownloadURL(fileRef);
      setModalFile({ ...file, previewURL: url });
    } catch (error) {
      console.error('Error fetching file preview', error);
      setMessage('Error fetching file preview. Check the console for more details.');
    }
  };

  const closeModal = () => {
    setModalFile(null);
  };

  return (
    <div>
      <h2>Stored Files</h2>
      {files.length > 0 ? (
        <>
          <div className="file-header">
            <span onClick={() => handleSort('name')}>Name <FaSort /></span>
            <span onClick={() => handleSort('timestamp')}>Upload Date <FaSort /></span>
            <span>Actions</span>
          </div>
          <ul>
            {currentFiles.map((file) => (
              <li key={file.id} className="file-item">
                <span>{file.name}</span>
                <span>{new Date(file.timestamp.seconds * 1000).toLocaleString()}</span>
                <div className="file-actions">
                  <button onClick={() => handlePreview(file)}><FaEye /></button>
                  <button onClick={() => handleDownload(file.downloadURL, file.name)}><FaDownload /></button>
                </div>
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
      {modalFile && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{modalFile.name}</h2>
            <iframe src={modalFile.previewURL} frameBorder="0" title="file preview"></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retrieve;
