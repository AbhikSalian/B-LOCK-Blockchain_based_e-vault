import React, { useState, useEffect } from "react";
import Web3 from "web3";
import EVault from "./contracts/EVault.json";
import UserRegistry from "./contracts/UserRegistry.json";
import './App.css';
import SignUp from './SignUp';
import SignIn from './SignIn';
import FileUpload from './FileUpload';
import Retrieve from './Retrieve';

function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
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
    </div>
  );
}

export default App;
