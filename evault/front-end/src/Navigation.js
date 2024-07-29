import React from "react";
import './Navigation.css';

function Navigation({ onUploadClick, onStorageClick }) {
  return (
    <nav className="navbar">
      <div className="logo">B-lock</div>
      <ul className="nav-links">
        <li><a href="#upload" onClick={onUploadClick}>Upload</a></li>
        <li><a href="#files" onClick={onStorageClick}>Stored Files</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;