import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import FileRetrieve from './components/FileRetrieve';
import FileDropdown from './components/FileDropdown';
import FileDownload from './components/FileDownload';
import logo from './logo.jpg'; // Adjust path

function App() {
  return (
    <div className="App">
      <div className="container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>eVault</h1>
        <p>Store and retrieve your files securely with blockchain technology.</p>
        <FileUpload />
        <FileRetrieve />
        <FileDropdown />
        <FileDownload /> {/* Added Download Button */}
      </div>
    </div>
  );
}

export default App;
