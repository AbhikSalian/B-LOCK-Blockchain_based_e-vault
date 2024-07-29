import React, { useState, useRef } from "react";
import CryptoJS from "crypto-js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import "./Upload.css";

function Upload({ evault, account, storage, db, user }) {
  const [files, setFiles] = useState([]); // Track selected files
  const [messages, setMessages] = useState([]); // Track messages for each file
  const [dragging, setDragging] = useState(false); // Track dragging state

  // Reference to the file input for triggering it programmatically
  const fileInputRef = useRef(null);

  // Function to handle the upload process for each file
  const uploadFile = async (file, index) => {
    // Generate a unique hash for the file
    const fileHash = CryptoJS.SHA256(file.name + new Date().toISOString()).toString();

    // Set up Firebase storage reference for the file
    const storageRef = ref(storage, `uploads/${user.uid}/${fileHash}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor the upload progress and update the message
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = `Uploading ${file.name}: ${progress.toFixed(2)}% done`;
          return newMessages;
        });
      },
      (error) => {
        console.error("Upload error:", error);
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[index] = `Error uploading ${file.name}`;
          return newMessages;
        });
      },
      async () => {
        // On successful upload, get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        try {
          // Store file metadata in the blockchain
          await evault.methods.storeFile(file.name, fileHash).send({ from: account });

          try {
            // Save file details to Firestore
            await addDoc(collection(db, "files"), {
              name: file.name,
              owner: user.uid,
              downloadURL,
              timestamp: new Date(),
            });

            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];
              newMessages[index] = `File ${file.name} uploaded successfully`;
              return newMessages;
            });
          } catch (error) {
            console.error("Firestore error:", error);
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];
              newMessages[index] = `Error saving data for ${file.name}`;
              return newMessages;
            });
          }
        } catch (error) {
          console.error("Blockchain error: ", error);
          // Display failure message if transaction is rejected
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[index] = `Failed to upload ${file.name}. Transaction rejected.`;
            return newMessages;
          });
        }
      }
    );
  };

  // Handle changes when files are selected
  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      setMessages(new Array(fileArray.length).fill("")); // Reset messages for each file
    }
  };

  // Handle the file upload button click
  const handleUpload = async () => {
    if (!user) {
      setMessages(["Please sign in to upload files"]);
      return;
    }
    if (!evault) {
      setMessages(["Blockchain not loaded"]);
      return;
    }
    if (files.length === 0) {
      setMessages(["No files selected"]);
      return;
    }

    // Upload each selected file
    files.forEach((file, index) => {
      uploadFile(file, index);
    });
  };

  // Handle the drag-over event
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  // Handle the drag-leave event
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  // Handle the drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const fileArray = Array.from(droppedFiles);
      setFiles(fileArray);
      setMessages(new Array(fileArray.length).fill("")); // Reset messages for each file
    }
  };

  // Programmatically open the file input dialog
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-container">
      <h2>Upload Files</h2>
      <div
        className={`upload-area ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleChooseFile} // Click on the area to trigger file input
      >
        <div className="upload-icon">📁</div>
        <p>Drag and drop your files here or click here to upload</p>
        
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="file-input"
          ref={fileInputRef} // Use the ref for input
          style={{ display: "none" }}
        />
      </div>

      {/* Display the selected file names */}
      {files.length > 0 && (
        <div className="selected-files">
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>

      {/* Display messages for each file upload */}
      {messages.length > 0 && (
        <div className="upload-messages">
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Upload;
