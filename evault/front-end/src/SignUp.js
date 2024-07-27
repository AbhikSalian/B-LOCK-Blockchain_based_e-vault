import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UserRegistry from "./contracts/UserRegistry.json";

function SignUp({ toggleForm }) {
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
      toggleForm(); // Toggle to Sign In form
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Error registering user. Check the console for more details.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={registerUser}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Email</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={passwordHash}
            onChange={(e) => setPasswordHash(e.target.value)}
            required
          />
          <label>Password</label>
        </div>
        <div className="remember">
          <label>
            <input type="checkbox" required />
            I agree to the terms & conditions
          </label>
        </div>
        <button type="submit">Sign Up</button>
        <div className="signup-link">
          <p>
            Already have an account?
            <a href="#" onClick={toggleForm}>
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
