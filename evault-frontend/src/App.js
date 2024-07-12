import React, { useEffect, useState } from 'react';
import EVault from "./contracts/EVault.json"; // Adjust path if necessary
import Web3 from "web3";
import CryptoJS from "crypto-js";
import './App.css';
import FileUpload from './components/FileUpload';
import FileRetrieve from './components/FileRetrieve';
import FileDropdown from './components/FileDropdown';
import FileDownload from './components/FileDownload';
import logo from './logo.jpg'; // Adjust path

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [eVaultContract, setEVaultContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = EVault.networks[networkId];
          const instance = new web3Instance.eth.Contract(
            EVault.abi,
            deployedNetwork && deployedNetwork.address,
          );
          setEVaultContract(instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
        } catch (error) {
          console.error(error);
        }
      }
    };

    initWeb3();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>eVault</h1>
        <p>Store and retrieve your files securely with blockchain technology.</p>
        <FileUpload web3={web3} accounts={accounts} eVaultContract={eVaultContract} />
        <FileRetrieve web3={web3} accounts={accounts} eVaultContract={eVaultContract} />
        <FileDropdown web3={web3} accounts={accounts} eVaultContract={eVaultContract} />
        <FileDownload web3={web3} accounts={accounts} eVaultContract={eVaultContract} /> {/* Added Download Button */}
      </div>
    </div>
  );
}

export default App;
