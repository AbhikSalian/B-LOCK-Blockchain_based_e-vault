
# B-LOCK: Blockchain-based e-vault Application

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Configure Firebase](#configure-firebase)
  - [Deploy Smart Contract](#deploy-smart-contract)
  - [Run the Application](#run-the-application)
- [Directory Structure](#directory-structure)
- [Key Components](#key-components)
  - [Smart Contract: EVault.sol](#smart-contract-evaultsol)
  - [File Upload Component: Upload.js](#file-upload-component-uploadjs)
  - [File Retrieve Component: Retrieve.js](#file-retrieve-component-retrievejs)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Introduction

B-LOCK is a blockchain-based e-vault application designed to securely store and manage files. Utilizing the Ethereum blockchain, B-LOCK ensures file integrity, security, and transparency. The application allows users to upload, store, and retrieve files with confidence, leveraging decentralized technology.

## Features

- **User Registration and Login**: Secure user authentication and verification.
- **File Upload**: Upload files to the e-vault with progress feedback.
- **File Management Dashboard**: View, download, and delete uploaded files.
- **Blockchain Verification**: Ensure file integrity using Ethereum blockchain.
- **Secure Storage**: Decentralized storage for enhanced security and transparency.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Firebase for authentication and storage
- **Blockchain**: Ethereum, Solidity smart contracts
- **Web3 Integration**: Web3.js
- **Development Tools**: Truffle, Ganache

## Prerequisites

- Node.js
- Truffle
- Ganache
- MetaMask
- Firebase Account

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/evault.git
cd evault
```

### Install Dependencies

```bash
npm install
```

### Configure Firebase

1. Create a Firebase project.
2. Enable Firebase Authentication and Firestore.
3. Update the Firebase configuration in the `src/firebaseConfig.js` file.

### Deploy Smart Contract

1. Start Ganache:

```bash
ganache-cli
```

2. Compile and migrate the smart contract:

```bash
truffle compile
truffle migrate
```

3. Update the smart contract address and ABI in the application.

### Run the Application

```bash
npm start
```

## Directory Structure

```plaintext
evault/
│
├── build/
├── contracts/
│   └── EVault.sol
├── migrations/
├── public/
├── src/
│   ├── components/
│   │   ├── Upload.js
│   │   ├── Retrieve.js
│   │   └── ...
│   ├── firebaseConfig.js
│   ├── App.js
│   ├── index.js
│   └── ...
├── test/
├── package.json
├── truffle-config.js
└── README.md
```

## Key Components

### Smart Contract: EVault.sol

This Solidity smart contract handles file storage and retrieval on the Ethereum blockchain. It maps user addresses to their respective files, ensuring decentralized and secure file management.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EVault {
    struct File {
        string fileName;
        string fileHash;
    }

    mapping(address => File[]) private userFiles;

    function storeFile(string memory _fileName, string memory _fileHash) public {
        userFiles[msg.sender].push(File(_fileName, _fileHash));
    }

    function retrieveFiles() public view returns (File[] memory) {
        return userFiles[msg.sender];
    }

    function getFilenames() public view returns (string[] memory) {
        File[] memory files = userFiles[msg.sender];
        string[] memory fileNames = new string[](files.length);

        for (uint i = 0; i < files.length; i++) {
            fileNames[i] = files[i].fileName;
        }

        return fileNames;
    }
}
```

### File Upload Component: Upload.js

This component handles file selection, upload, and progress feedback. It interacts with Firebase for storage and the Ethereum blockchain for verification.

### File Retrieve Component: Retrieve.js

This component fetches and displays the user's files stored on the blockchain, allowing for secure file management and verification.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Ethereum and Solidity documentation
- Firebase documentation
- React.js documentation
