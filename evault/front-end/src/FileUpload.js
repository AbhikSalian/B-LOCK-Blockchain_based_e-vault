import React, { useState } from 'react';
import CryptoJS from "crypto-js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const FileUpload = ({ evault, account, setMessage }) => {
  const [fileName, setFileName] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [file, setFile] = useState(null);
  const storage = getStorage();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFileName(selectedFile.name);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const hash = CryptoJS.SHA256(binaryStr).toString();
      setFileHash(hash);
    };
    reader.readAsBinaryString(selectedFile);
  };

  const storeFile = async (e) => {
    e.preventDefault();
    if (!evault) {
      setMessage("Smart contract is not loaded.");
      return;
    }

    if (!file) {
      setMessage("No file selected.");
      return;
    }

    try {
      const storageRef = ref(storage, 'uploads/' + file.name);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Store file metadata in Firestore
      await addDoc(collection(db, "files"), {
        name: fileName,
        hash: fileHash,
        downloadURL,
        owner: account,
        timestamp: new Date()
      });

      // Estimate gas and store file hash on blockchain
      const gasEstimate = await evault.methods.storeFile(fileName, fileHash).estimateGas({ from: account });
      await evault.methods.storeFile(fileName, fileHash).send({ from: account, gas: gasEstimate });

      setMessage("File stored successfully!");
    } catch (error) {
      console.error("Error storing file:", error);
      setMessage("Error storing file. Check the console for more details.");
    }
  };

  return (
    <div>
      <h2>Upload a file</h2>
      <form onSubmit={storeFile}>
        <div>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload to Blockchain</button>
      </form>
    </div>
  );
};

export default FileUpload;
