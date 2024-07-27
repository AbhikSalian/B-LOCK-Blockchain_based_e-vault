import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Web3 from "web3";
import EVault from "./contracts/EVault.json";
import UserRegistry from "./contracts/UserRegistry.json";
import './App.css';
import SignUp from './SignUp';
import SignIn from './SignIn';
import FileUpload from './FileUpload';
import { db, storage, auth } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Retrieve from './Retrieve';
import Footer from './Footer';
import CryptoJS from 'crypto-js';
function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [files, setFiles] = useState([]);
  const [userRegistry, setUserRegistry] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const evaultDeployedNetwork = EVault.networks[networkId];
      const userRegistryDeployedNetwork = UserRegistry.networks[networkId];

      if (evaultDeployedNetwork && userRegistryDeployedNetwork) {
        const evaultInstance = new web3.eth.Contract(EVault.abi, evaultDeployedNetwork.address);
        const userRegistryInstance = new web3.eth.Contract(UserRegistry.abi, userRegistryDeployedNetwork.address);
        setEVault(evaultInstance);
        setUserRegistry(userRegistryInstance);
      } else {
        setMessage("Smart contract not deployed to detected network.");
      }
    } catch (error) {
      console.error("Error loading blockchain data", error);
      setMessage("Error loading blockchain data. Check the console for more details.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (!selectedFiles.length) {
      return;
    }

    setFiles(selectedFiles);

    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const hash = CryptoJS.SHA256(binaryStr).toString();
        setFileHash(hash);
      };
      reader.readAsBinaryString(file);
    });
  };

  const storeFile = async (e) => {
    e.preventDefault();
    if (!evault) {
      setMessage("Smart contract is not loaded.");
      return;
    }

    if (!files.length) {
      setMessage("No file selected.");
      return;
    }

    try {
      files.forEach(async (file) => {
        const storageRef = ref(storage, 'uploads/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
          // Optional: Handle upload progress
        }, (error) => {
          console.error("Error uploading file:", error);
          setMessage("Error uploading file. Check the console for more details.");
        }, async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Store file metadata in Firestore
          await addDoc(collection(db, "files"), {
            name: file.name,
            hash: fileHash,
            downloadURL,
            owner: account,
            timestamp: new Date()
          });

          // Estimate gas and store file hash on blockchain
          const gasEstimate = await evault.methods.storeFile(file.name, fileHash).estimateGas({ from: account });
          await evault.methods.storeFile(file.name, fileHash).send({ from: account, gas: gasEstimate });

          setMessage("File stored successfully!");
        });
      });
    } catch (error) {
      console.error("Error storing file:", error);
      setMessage("Error storing file. Check the console for more details.");
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>B-lock</h1>
        </header>
        <main className="container">
          <Routes>
            <Route path="/signup" element={<SignUp userRegistry={userRegistry} account={account} setMessage={setMessage} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signin" element={<SignIn userRegistry={userRegistry} setIsAuthenticated={setIsAuthenticated} setMessage={setMessage} />} />
            <Route path="/upload" element={
              isAuthenticated ? (
                <FileUpload
                  evault={evault}
                  account={account}
                  setMessage={setMessage}
                  handleFileChange={handleFileChange}
                  storeFile={storeFile}
                  message={message}
                />
              ) : (
                <p>Please sign in to upload files.</p>
              )
            } />
            <Route path="/retrieve" element={<Retrieve account={account} />} />
            <Route path="/" element={<p>Welcome to B-lock. <Link to="/signup">Sign Up</Link> or <Link to="/signin">Sign In</Link></p>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;