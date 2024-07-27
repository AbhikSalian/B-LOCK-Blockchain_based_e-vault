import React from "react";
import './Navigation.css';

function Navigation({ uploadNavRef, storageNavRef }) {
  return (
    <nav className="navbar">
      <div className="logo">B-lock</div>
      <ul className="nav-links">
        <li><a href="#upload" ref={uploadNavRef}>Upload</a></li>
        <li><a href="#files" ref={storageNavRef}>Stored Files</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;