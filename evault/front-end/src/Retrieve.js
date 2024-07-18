import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

function Retrieve() {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;
  const storage = getStorage();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = useCallback(async () => {
    try {
      const filesCollection = collection(db, 'files');
      const querySnapshot = await getDocs(filesCollection);

      const filesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFiles(filesData);
    } catch (error) {
      console.error('Error retrieving files from Firestore:', error);
    }
  }, []);

  const deleteFile = async (fileId, fileName) => {
    try {
      // Delete file from Firestore
      await deleteDoc(doc(db, 'files', fileId));
      
      // Delete file from Storage
      const storageRef = ref(storage, 'uploads/' + fileName);
      await deleteObject(storageRef);
      
      // Update local state
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const renderFiles = currentFiles.map((file, index) => (
    <li key={index}>
      <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">
        {file.name}
      </a>
      <span> - Uploaded on: {new Date(file.timestamp.seconds * 1000).toLocaleString()}</span>
      <button onClick={() => deleteFile(file.id, file.name)}>Delete</button>
    </li>
  ));

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(files.length / filesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h2>Stored Files</h2>
      <ul>
        {renderFiles}
      </ul>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Retrieve;
