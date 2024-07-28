import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CryptoJS from "crypto-js";
import EVault from "./contracts/EVault.json";
import './App.css';
import { db, storage, auth } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaDownload, FaSort, FaEye } from 'react-icons/fa';
import Navigation from './Navigation';
import Footer from './Footer';
import SignUp from './SignUp';
import SignIn from './SignIn';

function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [files, setFiles] = useState([]);
  const [storedFiles, setStoredFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5);
  const [modalFile, setModalFile] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('signIn');
  const [activeContainer, setActiveContainer] = useState('upload');

  useEffect(() => {
    loadBlockchainData();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchFiles();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [sortConfig, user]);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = EVault.networks[networkId];
        if (networkData) {
          const evault = new web3.eth.Contract(EVault.abi, networkData.address);
          setEVault(evault);
        } else {
          setMessage("Smart contract not deployed to detected network.");
        }
      } catch (error) {
        console.error("Error connecting to blockchain:", error);
        setMessage("Error connecting to blockchain. Please check your MetaMask connection.");
      }
    } else {
      setMessage("Please install MetaMask!");
    }
  };

  const uploadFile = async (file) => {
    const hash = CryptoJS.SHA256(file.name + new Date().toISOString()).toString();

    const storageRef = ref(storage, `uploads/${user.uid}/${hash}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setMessage(`Upload is ${progress.toFixed(2)}% done`);
      },
      (error) => {
        console.error("Upload error:", error);
        setMessage("Error uploading file");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'files'), {
            name: file.name,
            owner: user.uid,
            downloadURL,
            timestamp: new Date()
          });
          setMessage("File uploaded successfully");
          fetchFiles();
        } catch (error) {
          console.error("Firestore error:", error);
          setMessage("Error saving file data");
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

    for (const file of files) {
      await uploadFile(file);
    }
  };

  const fetchFiles = async () => {
    if (!user) return;

    try {
      const filesQuery = query(collection(db, 'files'), where('owner', '==', user.uid), orderBy(sortConfig.key, sortConfig.direction));
      const querySnapshot = await getDocs(filesQuery);

      const filesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStoredFiles(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
      setMessage("Error fetching files. Please try again.");
    }
  };

  const handleDownload = async (downloadURL, fileName) => {
    try {
      const response = await fetch(downloadURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      setMessage("Error downloading file. Please try again.");
    }
  };

  const handlePreview = (file) => {
    setModalFile({
      ...file,
      previewURL: file.downloadURL,
    });
  };

  const closeModal = () => {
    setModalFile(null);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = storedFiles.slice(indexOfFirstFile, indexOfLastFile);

  const onSignUp = (email, password) => {
    setAuthMode('signIn');
  };

  const onSignIn = (email, password) => {
    setUser(auth.currentUser);
  };

  const switchAuthMode = () => {
    setAuthMode(prevMode => prevMode === 'signUp' ? 'signIn' : 'signUp');
  };

  return (
    <div className="App">
      {!user ? (
        authMode === 'signUp' ? (
          <SignUp onSignUp={onSignUp} switchAuthMode={switchAuthMode} />
        ) : (
          <SignIn onSignIn={onSignIn} switchAuthMode={switchAuthMode} />
        )
      ) : (
        <>
          <Navigation 
            onUploadClick={() => setActiveContainer('upload')}
            onStorageClick={() => setActiveContainer('storage')}
          />
          <main>
            <div className={`upload-box ${activeContainer === 'upload' ? 'active' : ''}`}>
              <h2>Upload Files</h2>
              <input type="file" multiple onChange={handleFileChange} />
              <button onClick={handleUpload}>Upload</button>
              {message && <p>{message}</p>}
            </div>
  
            <div className={`stored-files ${activeContainer === 'storage' ? 'active' : ''}`}>
              <h2>Stored Files</h2>
              {storedFiles.length > 0 ? (
                <>
                  <div className="sort-container">
                    <button onClick={() => handleSort('name')}>
                      Sort by Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <FaSort /> : <FaSort style={{ transform: 'rotate(180deg)' }} />)}
                    </button>
                    <button onClick={() => handleSort('timestamp')}>
                      Sort by Date {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? <FaSort /> : <FaSort style={{ transform: 'rotate(180deg)' }} />)}
                    </button>
                  </div>
                  <ul className="file-list">
                    {currentFiles.map((file) => (
                      <li key={file.id}>
                        <span>{file.name}</span>
                        <span>{new Date(file.timestamp.seconds * 1000).toLocaleString()}</span>
                        <div className="actions">
                          <button onClick={() => handleDownload(file.downloadURL, file.name)}>
                            <FaDownload /> Download
                          </button>
                          <button onClick={() => handlePreview(file)}>
                            <FaEye /> Preview
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="pagination">
                    {Array.from({ length: Math.ceil(storedFiles.length / filesPerPage) }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p>No files stored yet.</p>
              )}
            </div>
          </main>
          <Footer />
        </>
      )}
      {modalFile && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Preview of {modalFile.name}</h2>
            <iframe src={modalFile.previewURL} title="File Preview" width="100%" height="400"></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;