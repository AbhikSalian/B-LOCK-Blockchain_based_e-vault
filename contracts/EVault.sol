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
}
