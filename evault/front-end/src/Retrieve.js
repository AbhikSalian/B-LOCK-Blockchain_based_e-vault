import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Retrieve = ({ account }) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      // Query to get files where the owner matches the current account
      const q = query(collection(db, 'files'), where('owner', '==', account));
      const querySnapshot = await getDocs(q);
      const filesList = querySnapshot.docs.map(doc => doc.data());
      setFiles(filesList);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchFiles();
    }
  }, [account]);

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
