pragma solidity ^0.8.0;

contract BLockVault {
    struct File {
        string fileName;
        string fileHash;
    }

    mapping(address => File[]) private userFiles;

    function uploadFile(string memory _fileName, string memory _fileHash) public {
        userFiles[msg.sender].push(File(_fileName, _fileHash));
    }

    function getFile(uint _index) public view returns (string memory, string memory) {
        File storage file = userFiles[msg.sender][_index];
        return (file.fileName, file.fileHash);
    }

    function getFilesCount() public view returns (uint) {
        return userFiles[msg.sender].length;
    }
}
