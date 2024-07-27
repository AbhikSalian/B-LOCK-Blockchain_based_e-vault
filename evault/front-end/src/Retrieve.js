import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const Retrieve = ({ account, evault }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'files'));
      const filesList = querySnapshot.docs.map(doc => doc.data());
      setFiles(filesList);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="retrieve-box">
      <h2>Stored Files</h2>
      {files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">{file.name}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files found.</p>
      )}
    </div>
  );
};

export default Retrieve;
