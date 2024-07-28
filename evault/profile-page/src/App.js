import React, { useState } from 'react';
import './App.css';
import ProfileIcon from './ProfileIcon';
import ProfileContainer from './ProfileContainer';
import Login from './Login';

function App() {
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState(null);

  const handleIconClick = () => {
    setShowProfile(!showProfile);
  };

  const handleLogin = (username) => {
    console.log('Logged in as:', username); // Debug log
    setUsername(username);
  };

  const handleLogout = () => {
    console.log('Logged out'); // Debug log
    setUsername(null);
    setShowProfile(false);
  };

  return (
    <div className="App">
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <ProfileIcon onClick={handleIconClick} />
          {showProfile && <ProfileContainer username={username} onLogout={handleLogout} />}
        </>
      )}
    </div>
  );
}

export default App;
