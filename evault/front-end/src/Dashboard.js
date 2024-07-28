import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import Retrieve from './Retrieve';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

function Dashboard({ evault, account, setMessage, handleFileChange, storeFile, message, isAuthenticated, setIsAuthenticated }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage('Error signing out. Check the console for more details.');
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>B-lock Dashboard</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </header>
      <div className="dashboard-content">
        <FileUpload
          evault={evault}
          account={account}
          setMessage={setMessage}
          handleFileChange={handleFileChange}
          storeFile={storeFile}
          message={message}
        />
        <Retrieve account={account} />
      </div>
    </div>
  );
}

export default Dashboard;
