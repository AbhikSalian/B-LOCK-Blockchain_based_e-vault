import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, 'uploads/' + file.name);
      const snapshot = await uploadBytes(storageRef, file);
      const firebaseURL = await getDownloadURL(snapshot.ref);
      console.log('Uploaded to Firebase Storage:', firebaseURL);

      // Store Firebase download URL in Firestore
      const docRef = await addDoc(collection(db, "uploadedFiles"), {
        fileName: file.name,
        downloadURL: firebaseURL,
        timestamp: new Date()
      });
      console.log("Document written with ID: ", docRef.id);

      setMessage("File uploaded successfully!");

    } catch (error) {
      console.error("Error uploading file", error);
      setMessage("Error uploading file. Check the console for more details.");
    }
  };

  return (
    <div className="container">
      <h2>Upload a file to Firebase Storage</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} required />
        <button type="submit">Upload to Firebase</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Upload;