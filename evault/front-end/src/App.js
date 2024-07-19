import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CryptoJS from "crypto-js";
import EVault from "./contracts/EVault.json";
import './App.css';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Retrieve from './Retrieve';

function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [file, setFile] = useState(null);
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

      // Store file hash on blockchain
      await evault.methods.storeFile(fileName, fileHash).send({ from: account });

      setMessage("File stored successfully!");
    } catch (error) {
      console.error("Error uploading file", error);
      setMessage("Error uploading file. Check the console for more details.");
    }
  };

  return (
    <div className="App">
      <h1 className="h1">B-lock</h1>
      <div className="container">
        <div className="upload-box">
          <h2>Upload a file</h2>
          <form onSubmit={storeFile}>
            <div>
              <input type="file" onChange={handleFileChange} required />
            </div>
            <button type="submit">Upload to Blockchain</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
        <div className="stored-files">
          <Retrieve account={account} evault={evault} />
        </div>
      </div>
    </div>
  );
}

export default App;
