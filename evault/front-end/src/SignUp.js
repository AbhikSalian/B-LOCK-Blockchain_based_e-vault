<<<<<<< HEAD
// SignUp.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, sendVerificationEmail } from './firebase';
import './Auth.css';
const SignUp = ({ onSignUp, switchToSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if the user is created successfully
      console.log('User created:', user.email);

      await sendVerificationEmail(user);  // Ensure the email is sent
      onSignUp(email, password);
      setError(''); // Clear any previous errors
      alert('A verification email has been sent to your email address. Please check your inbox, spam, or junk folder.');
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err.message);
=======
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UserRegistry from "./contracts/UserRegistry.json";


function SignUp() {
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [message, setMessage] = useState("");
  const [userRegistry, setUserRegistry] = useState(null);
  const [account, setAccount] = useState("");

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
          setAccount(accounts[0]);
        } else {
          setMessage("Smart contract not deployed to detected network.");
        }
      } catch (error) {
        console.error("Error loading blockchain data", error);
        setMessage("Error loading blockchain data. Check the console for more details.");
      }
    };

    loadBlockchainData();
  }, []);

  const registerUser = async (e) => {
    e.preventDefault();
    if (!userRegistry) {
      setMessage("Smart contract is not loaded.");
      return;
    }

    try {
      await userRegistry.methods.registerUser(email, passwordHash).send({ from: account });
      setMessage("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Error registering user. Check the console for more details.");
>>>>>>> 31e7d488fffc28bf812c930ffbdbbd644c1aa30f
    }
  };

  return (
<<<<<<< HEAD
    <div className="auth-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Already have an account? <button onClick={switchToSignIn}>Sign In</button></p>
    </div>
  );
};

export default SignUp;
=======
    <div className="form-wrapper sign-up">
      <h2>Sign Up</h2>
      <form onSubmit={registerUser}>
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
        <button type="submit">Sign Up</button>
      </form>
      {message && <p className="message">{message}</p>}

    </div>
  );
}

export default SignUp;
>>>>>>> 31e7d488fffc28bf812c930ffbdbbd644c1aa30f
