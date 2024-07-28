import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Login successful!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Sign In</h2>
        <div className="input-group">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Email</label>
        </div>
        <div className="input-group">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>Password</label>
        </div>
        <button type="submit">Sign In</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Login;
