import React from 'react';
import './Navigation.css';
//import logo from './logo.png'; // Make sure this path is correct

function Navigation({ onUploadClick, onStorageClick, onSignOut }) {
  return (
    <nav className="navbar">
      <div className="logo">
     
        <h1>B-lock</h1>
      </div>
      <ul className="nav-links">
        <li><a href="#upload" onClick={onUploadClick}>Upload</a></li>
        <li><a href="#files" onClick={onStorageClick}>Stored Files</a></li>
      </ul>
      <button className="sign-out-button" onClick={onSignOut}>Sign Out</button>
    </nav>
  );
}

export default Navigation;
