import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CryptoJS from "crypto-js";
import EVault from "./contracts/EVault.json";
import './App.css';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Retrieve from './Retrieve';
import Navigation from './Navigation';
import Footer from './Footer';

function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const storage = getStorage();

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EVault.networks[networkId];
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(EVault.abi, deployedNetwork.address);
        setEVault(instance);
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
    <div className="App">
      <Navigation />
      <header>
        <h1>B-lock</h1>
      </header>
      <main className="container">
        <div className="upload-box">
          <h2>Upload a file</h2>
          <form onSubmit={storeFile}>
            <div className="file-input-container">
              <input type="file" onChange={handleFileChange} multiple required />
              <button type="submit">Upload to Blockchain</button>
            </div>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
        <div className="stored-files">
          <Retrieve account={account} evault={evault} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
