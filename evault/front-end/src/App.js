import React, { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import './style.css'; // Ensure CSS is imported

const App = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className={`wrapper ${isSignUp ? 'active' : ''}`}>
      {isSignUp ? <SignUp toggleForm={toggleForm} /> : <SignIn toggleForm={toggleForm} />}
    </div>
  );
};

export default App;
