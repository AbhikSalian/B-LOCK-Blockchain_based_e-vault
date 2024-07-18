import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './App.css';

const Retrieve = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const querySnapshot = await getDocs(collection(db, "files"));
    const filesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setFiles(filesData);
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteDoc(doc(db, "files", fileId));
      setMessage("File deleted successfully!");
      fetchFiles(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting file", error);
      setMessage("Error deleting file. Check the console for more details.");
    }
  };

  return (
    <div>
      <h2>Stored Files</h2>
      {files.length > 0 ? (
        <ul>
          {files.map(file => (
            <li key={file.id}>
              <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
              <button onClick={() => handleDelete(file.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Retrieve;
