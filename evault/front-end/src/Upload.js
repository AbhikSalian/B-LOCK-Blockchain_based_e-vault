// Upload.js

import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { FaDownload, FaSort, FaEye } from "react-icons/fa";
import "./Upload.css"; // If you have specific styles for the Upload component
import Retrieve from "./Retrieve";
function Upload({ evault, account, storage, db, user}) {
  const [fileHash, setFileHash] = useState("");
  const [fileName, setFileName] = useState("");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  const uploadFile = async (file) => {
    const hash = CryptoJS.SHA256(file.name + new Date().toISOString()).toString();
    setFileHash(hash);
    setFileName(file.name);

    const storageRef = ref(storage, `uploads/${user.uid}/${hash}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setMessage(`Upload is ${progress.toFixed(2)}% done`);
      },
      (error) => {
        console.error("Upload error:", error);
        setMessage("Error uploading file");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          // Store file hash on blockchain
          await evault.methods.storeFile(fileName, fileHash).send({ from: account });
          try {
            await addDoc(collection(db, "files"), {
              name: file.name,
              owner: user.uid,
              downloadURL,
              timestamp: new Date(),
            });

            setMessage("File uploaded successfully");
            // Retrieve.fetchFiles();
          } catch (error) {
            console.error("Firestore error:", error);
            setMessage("Error saving file data");
          }
        } catch (e) {
          console.error("Blockchain error: ", e);
          setMessage(
            "Error uploading file. Check if your Metamask is connected and Ganache is running"
          );
        }
      }
    );
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(Array.from(selectedFiles));
  };

  const handleUpload = async () => {
    if (!user) {
      setMessage("Please sign in to upload files");
      return;
    }
    if (!evault) {
      setMessage("Blockchain not loaded");
      return;
    }
    if (files.length === 0) {
      setMessage("No file selected");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadFile(file);
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload Files</h2>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Upload;
