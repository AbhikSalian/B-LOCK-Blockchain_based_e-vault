
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import EVault from "./contracts/EVault.json";
import UserRegistry from "./contracts/UserRegistry.json";
import './App.css';
import { db, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


import Retrieve from './Retrieve';
import Upload from './Upload';

const App = () => {
  const [isSignUp, setIsSignUp] = useState(true);

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

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(binaryStr)).toString();
      setFileHash(hash);
    };
    reader.readAsArrayBuffer(selectedFile);
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
      <h1 className="h1">B-lock</h1>
      <div className="container">
        {!isAuthenticated ? (
          <div className="auth-box">
            <SignUp userRegistry={userRegistry} account={account} setMessage={setMessage} />
            <SignIn userRegistry={userRegistry} account={account} setIsAuthenticated={setIsAuthenticated} setMessage={setMessage} />
            {message && <p className="message">{message}</p>}
          </div>
        ) : (
          <div className="user-box">
            <FileUpload evault={evault} account={account} setMessage={setMessage} />
            <Retrieve account={account} />
          </div>
        )}
      </div>
      <Navigation />
      <header>
        <h1>B-lock</h1>
      </header>
      <main className="container">
        <div className="upload-box">
          <h2>Upload a file</h2>
          <br></br>
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
};

export default App;