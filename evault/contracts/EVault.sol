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
