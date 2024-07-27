import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UserRegistry from "./contracts/UserRegistry.json";

function SignIn({ setIsAuthenticated, setMessage, setAccount }) {
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [message, setMessageLocal] = useState(""); // Rename local state to avoid conflict
  const [userRegistry, setUserRegistry] = useState(null);
  const [account, setAccountLocal] = useState(""); // Rename local state to avoid conflict
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = UserRegistry.networks[networkId];
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(UserRegistry.abi, deployedNetwork.address);
          setUserRegistry(instance);
          setAccountLocal(accounts[0]); // Update local state
        } else {
          setMessageLocal("Smart contract not deployed to detected network.");
        }
      } catch (error) {
        console.error("Error loading blockchain data", error);
        setMessageLocal("Error loading blockchain data. Check the console for more details.");
      }
    };

    loadBlockchainData();
  }, []);

  const signInUser = async (e) => {
    e.preventDefault();
    if (!userRegistry) {
      setMessageLocal("Smart contract is not loaded.");
      return;
    }

    try {
      // Check if email is registered
      const isRegistered = await userRegistry.methods.isEmailRegistered(email).call();
      if (!isRegistered) {
        setMessageLocal("Email not registered.");
        return;
      }

      // Retrieve user data
      const user = await userRegistry.methods.getUser(account).call();
      if (user.email === email && user.passwordHash === passwordHash) {
        setMessageLocal("Sign-in successful!");
        setIsAuthenticated(true); // Set the authentication status
        setAccount(account); // Update parent component state
        navigate('/dashboard'); // Redirect to file upload page
      } else {
        setMessageLocal("Invalid credentials.");
      }
    } catch (error) {
      console.error("Error signing in user:", error);
      setMessageLocal("Error signing in user. Check the console for more details.");
    }
  };

  return (
    <div className="form-wrapper sign-in">
      <h2>Sign In</h2>
      <form onSubmit={signInUser}>
        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            required
            value={passwordHash}
            onChange={(e) => setPasswordHash(e.target.value)}
          />
          <label>Password</label>
        </div>
        <button type="submit">Sign In</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default SignIn;
