import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UserRegistry from "./contracts/UserRegistry.json";

function SignIn() {
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

  const signInUser = async (e) => {
    e.preventDefault();
    if (!userRegistry) {
      setMessage("Smart contract is not loaded.");
      return;
    }

    try {
      // Check if email is registered
      const isRegistered = await userRegistry.methods.isEmailRegistered(email).call();
      if (!isRegistered) {
        setMessage("Email not registered.");
        return;
      }

      // Retrieve user data
      const user = await userRegistry.methods.getUser(account).call();
      if (user.email === email && user.passwordHash === passwordHash) {
        setMessage("Sign-in successful!");
        // Redirect or update UI to show user-specific data
      } else {
        setMessage("Invalid credentials.");
      }
    } catch (error) {
      console.error("Error signing in user:", error);
      setMessage("Error signing in user. Check the console for more details.");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={signInUser}>
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
          value={passwordHash}
          onChange={(e) => setPasswordHash(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default SignIn;
