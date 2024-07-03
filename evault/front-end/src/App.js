import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CryptoJS from "crypto-js";
import EVault from "./contracts/EVault.json";
import './App.css';

function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = EVault.networks[networkId];
    const instance = new web3.eth.Contract(
      EVault.abi,
      deployedNetwork && deployedNetwork.address
    );
    setEVault(instance);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const hash = CryptoJS.SHA256(binaryStr).toString();
      setFileHash(hash);
    };
    reader.readAsBinaryString(file);
  };

  const storeFile = async (e) => {
    e.preventDefault();
    try {
      await evault.methods.storeFile(fileName, fileHash).send({ from: account, gas: 8000000 });
      setMessage("File stored successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Error uploading file. Check the console for more details.");
    }
  };

  const retrieveFiles = async () => {
    const userFiles = await evault.methods.retrieveFiles().call({ from: account });
    setFiles(userFiles);
    setShowFiles(true);
  };

  return (
    <div className="App">
      <h1>Welcome to <br />B-LOCK</h1>
      <h2>a blockchain based e-vault</h2>
      <div className="container">
        <div className="upload-box">
          <h2>Upload a file</h2>
          <form onSubmit={storeFile}>
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit">Upload to Blockchain</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
        <div className="retrieve-box">
          <h2>Retrieve files</h2>
          <button onClick={retrieveFiles}>Retrieve from Blockchain</button>
        </div>
      </div>
      {showFiles && (
        <div className="stored-files">
          <h2>Uploaded Files</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                <span className="tooltip">
                  {file.fileName}
                  <span className="tooltiptext">
                    <strong>Hash:</strong> {file.fileHash}<br />
                    <strong>Update Time:</strong> {new Date(file.updateTime * 1000).toLocaleString()}<br />
                    <strong>Size:</strong> {file.size} bytes
                  </span>
                </span>
                <a href={`https://your-file-server.com/files/${file.fileHash}`} download={file.fileName}>Download</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
