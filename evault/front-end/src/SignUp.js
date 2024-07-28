import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, sendVerificationEmail } from './firebase';

const SignUp = ({ onSignUp, switchToSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendVerificationEmail(userCredential.user);
      onSignUp(email, password);
      setError(''); // Clear any previous errors
      alert('A verification email has been sent to your email address.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
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
