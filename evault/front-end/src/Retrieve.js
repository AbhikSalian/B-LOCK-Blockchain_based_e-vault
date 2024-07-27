import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUXMhYFwg4RxCcY_Yk-cUqQf4_X_j-Q1I",
  authDomain: "b-lock-a-blockchain-e-vault.firebaseapp.com",
  projectId: "b-lock-a-blockchain-e-vault",
  storageBucket: "b-lock-a-blockchain-e-vault.appspot.com",
  messagingSenderId: "451994949044",
  appId: "1:451994949044:web:2de1df44332663ff708ee1",
  measurementId: "G-EV28R21MF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function Retrieve({ account }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Query to get files owned by the current account
        const q = query(collection(db, "uploadedFiles"), where("owner", "==", account));
        const querySnapshot = await getDocs(q);

        const filePromises = querySnapshot.docs.map(async (doc) => {
          const fileData = doc.data();
          const downloadURL = await getDownloadURL(ref(storage, 'uploads/' + fileData.fileName));
          return {
            ...fileData,
            downloadURL
          };
        });

        const filesData = await Promise.all(filePromises);
        setFiles(filesData);
      } catch (error) {
        console.error("Error retrieving files", error);
        setMessage("Error retrieving files. Check the console for more details.");
      }
    };

    if (account) {
      fetchFiles();
    }
  }, [account]);

  return (
    <div className="retrieve-box">
      <h2>Retrieve Your Files</h2>
      {message && <p className="message">{message}</p>}
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">
                {file.fileName}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Retrieve;
