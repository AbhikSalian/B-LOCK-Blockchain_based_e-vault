import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase'; // Assuming you have initialized Firebase Firestore correctly
import Web3 from 'web3';
import EVault from './contracts/EVault.json';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Retrieve() {
  const [files, setFiles] = useState([]);
  const [account, setAccount] = useState('');
  const [evault, setEVault] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EVault.networks[networkId];
      if (deployedNetwork) {
        const instance = new web3.eth.Contract(EVault.abi, deployedNetwork.address);
        setEVault(instance);
      } else {
        console.error('Smart contract not deployed to detected network.');
      }
    } catch (error) {
      console.error('Error loading blockchain data', error);
    }
  };

  const fetchFiles = useCallback(async () => {
    if (!evault) {
      console.error('Smart contract is not loaded.');
      return;
    }

    try {
      const userFiles = await evault.methods.retrieveFiles().call({ from: account });
      console.log('Retrieved files from blockchain: ', userFiles);

      const filesData = await Promise.all(
        userFiles.map(async (file) => {
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
        })
      );

      console.log('Files fetched from Firestore: ', filesData);
      setFiles(filesData.filter(file => file !== null));
    } catch (error) {
      console.error('Error retrieving files', error);
    }
  }, [evault, account]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const renderFiles = currentFiles.map((file, index) => (
    <li key={index}>
      <a href={file.url} target="_blank" rel="noopener noreferrer">
        {file.fileName}
      </a>
      <span> - Uploaded on: {file.uploadTime.toLocaleString()}</span>
    </li>
  ));

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(files.length / filesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h2>Stored Files</h2>
      <ul>
        {renderFiles}
      </ul>
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Retrieve;
