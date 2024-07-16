import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Ensure this imports your Firebase configuration
import Web3 from 'web3';
import EVault from './contracts/EVault.json'; // Ensure this path is correct
import { collection, query, where, getDocs } from 'firebase/firestore';

function Retrieve() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState("");
  const [evault, setEVault] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10; // Adjust this as needed

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EVault.networks[networkId];
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(EVault.abi, deployedNetwork.address);
        setEVault(instance);
      } else {
        setMessage("Smart contract not deployed to detected network.");
      }
    } catch (error) {
      console.error("Error loading blockchain data", error);
      setMessage("Error loading blockchain data. Check the console for more details.");
    }
  };

  const fetchFiles = async () => {
    if (!evault) {
      setMessage("Smart contract is not loaded.");
      return;
    }

    try {
      const userFiles = await evault.methods.retrieveFiles().call({ from: account });
      console.log("Retrieved files from blockchain: ", userFiles);

      const filesData = await Promise.all(userFiles.map(async (file) => {
        const q = query(collection(db, 'files'), where('hash', '==', file.fileHash));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fileData = querySnapshot.docs[0].data();
          return {
            fileName: fileData.name,
            fileHash: file.fileHash,
            url: fileData.downloadURL,
            uploadTime: new Date(fileData.timestamp.seconds * 1000),
          };
        }
        return null;
      }));

      setFiles(filesData.filter(file => file !== null));
    } catch (error) {
      console.error("Error retrieving files", error);
      setMessage("Error retrieving files. Check the console for more details.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [evault]);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Uploaded Files</h2>
      {message && <p>{message}</p>}
      <ul>
        {currentFiles.map((file, index) => (
          <li key={index}>
            <span className="tooltip">
              {file.fileName}
              <span className="tooltiptext">
                <strong>Hash:</strong> {file.fileHash}<br />
                <strong>Upload Time:</strong> {file.uploadTime.toLocaleString()}<br />
              </span>
            </span>
            <a href={file.url} download={file.fileName}>Download</a>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {[...Array(Math.ceil(files.length / filesPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)}>
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Retrieve;
