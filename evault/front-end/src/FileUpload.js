import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import CryptoJS from 'crypto-js'; // Import CryptoJS
import Web3 from "web3";
import EVault from "./contracts/EVault.json"; // Adjust the path if needed

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

function FileUpload({ evault, account, setMessage, message}) {
  const [files, setFiles] = useState([]);

  const handleFileChangeLocal = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!files.length) {
      setMessage("No files selected.");
      return;
    }

    try {
      for (const file of files) {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, 'uploads/' + file.name);
        const snapshot = await uploadBytes(storageRef, file);
        const firebaseURL = await getDownloadURL(snapshot.ref);
        console.log('Uploaded to Firebase Storage:', firebaseURL);

        // Store Firebase download URL in Firestore
        await addDoc(collection(db, "uploadedFiles"), {
          fileName: file.name,
          downloadURL: firebaseURL,
          timestamp: new Date()
        });

        // Calculate file hash
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const binaryStr = fileReader.result;
          const fileHash = CryptoJS.SHA256(binaryStr).toString();

          // Estimate gas and store file hash on blockchain
          const gasEstimate = await evault.methods.storeFile(file.name, fileHash).estimateGas({ from: account });
          await evault.methods.storeFile(file.name, fileHash).send({ from: account, gas: gasEstimate });

          setMessage("File uploaded and stored successfully!");
        };
        fileReader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error("Error uploading file", error);
      setMessage("Error uploading file. Check the console for more details.");
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload a file</h2>
      <form onSubmit={handleUpload}>
        <div className="file-input-container">
          <input type="file" onChange={handleFileChangeLocal} multiple required />
          <button type="submit">Upload to Firebase and Blockchain</button>
        </div>
      </form>
      {/* Display message from state */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default FileUpload;
