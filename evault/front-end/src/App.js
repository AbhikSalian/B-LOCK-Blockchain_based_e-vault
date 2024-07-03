import React, { useState, useEffect } from "react";
import Web3 from "web3";
import EVault from "./contracts/EVault.json";

function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [files, setFiles] = useState([]);

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

    const userFiles = await instance.methods.retrieveFiles().call({ from: accounts[0] });
    setFiles(userFiles);
  };

  const storeFile = async (e) => {
    e.preventDefault();
    await evault.methods.storeFile(fileName, fileHash).send({ from: account, gas: 8000000 });
    const userFiles = await evault.methods.retrieveFiles().call({ from: account });
    setFiles(userFiles);
  };  

  return (
    <div>
      <h1>Blockchain e-Vault</h1>
      <form onSubmit={storeFile}>
        <div>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="File Name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={fileHash}
            onChange={(e) => setFileHash(e.target.value)}
            placeholder="File Hash"
            required
          />
        </div>
        <button type="submit">Store File</button>
      </form>
      <h2>Stored Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.fileName} - {file.fileHash}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
