import React, { useState, useEffect } from "react";
import Web3 from "web3";
import EVault from "./contracts/EVault.json";
import "./App.css";
import { db, storage, auth } from "./firebase";
import Navigation from "./Navigation";
import Footer from "./Footer";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Upload from "./Upload";
import Retrieve from "./Retrieve";

function App() {
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "timestamp",
    direction: "asc",
  });
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("signIn");
  const [activeContainer, setActiveContainer] = useState("upload");

  useEffect(() => {
    loadBlockchainData();
  }, []);

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
          window.alert("Smart contract not deployed to detected network.");
        }
      } catch (error) {
        console.error("Error connecting to blockchain:", error);
      }
    } else {
      window.alert("Please install MetaMask!");
    }
  };

  const onSignUp = (email, password) => {
    setAuthMode("signIn");
  };

  const onSignIn = (email, password) => {
    setUser(auth.currentUser);
  };

  const switchToSignIn = () => {
    setAuthMode("signIn");
  };

  const switchToSignUp = () => {
    setAuthMode("signUp");
  };

  const onSignOut = () => {
    auth.signOut();
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        authMode === "signUp" ? (
          <SignUp onSignUp={onSignUp} switchToSignIn={switchToSignIn} />
        ) : (
          <SignIn onSignIn={onSignIn} switchToSignUp={switchToSignUp} />
        )
      ) : (
        <>
          <Navigation
            onUploadClick={(e) => {
              e.preventDefault();
              setActiveContainer("upload");
            }}
            onStorageClick={(e) => {
              e.preventDefault();
              setActiveContainer("storage");
            }}
            onSignOut={onSignOut}
          />
          <main className="container">
            <div className={`upload-box ${activeContainer === "upload" ? 'show' : 'hide'}`}>
              <Upload
                evault={evault}
                account={account}
                storage={storage}
                db={db}
                user={user}
              />
            </div>
            <div className={`stored-files ${activeContainer === "storage" ? 'show' : 'hide'}`}>
              <Retrieve
                db={db}
                user={user}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />
            </div>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
