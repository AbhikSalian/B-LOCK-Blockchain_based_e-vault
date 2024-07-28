// src/components/Navigation.js

import React from 'react';
import './Navigation.css';

const Navigation = ({ user, onSignOut }) => {
  return (
    <nav className="navigation">
      <h1>EVault</h1>
      {user && (
        <button onClick={onSignOut} className="sign-out-button">
          Sign Out
        </button>
      )}
    </nav>
  );
};

export default Navigation;
