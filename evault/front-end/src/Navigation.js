import React from "react";
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navbar">
      <div className="logo">B-lock</div>
      <ul className="nav-links">
        <li><a href="#upload">Upload</a></li>
        <li><a href="#files">Stored Files</a></li>
      </ul>
    </nav>
  );
}

export default Navigation;
