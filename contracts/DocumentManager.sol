// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentManager {
    struct Document {
        address owner;
        string fileHash;
    }

    mapping(uint256 => Document) public documents;
    uint256 public documentCount;

    event DocumentAdded(uint256 documentId, address owner, string fileHash);

    function addDocument(string memory fileHash) public {
        documentCount++;
        documents[documentCount] = Document(msg.sender, fileHash);

        emit DocumentAdded(documentCount, msg.sender, fileHash);
    }

    function getDocument(uint256 documentId) public view returns (address, string memory) {
        Document memory doc = documents[documentId];
        return (doc.owner, doc.fileHash);
    }
}
