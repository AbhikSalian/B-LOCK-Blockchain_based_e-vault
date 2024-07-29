// Retrieve.js

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { FaDownload, FaSort, FaEye } from "react-icons/fa";
import "./Retrieve.css"; // If you have specific styles for the Retrieve component

function Retrieve({ db, user, sortConfig, setSortConfig }) {
  const [storedFiles, setStoredFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5);
  const [modalFile, setModalFile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [sortConfig, user]);

  const fetchFiles = async () => {
    if (!user) return;

    try {
      const filesQuery = query(
        collection(db, "files"),
        where("owner", "==", user.uid),
        orderBy(sortConfig.key, sortConfig.direction)
      );
      const querySnapshot = await getDocs(filesQuery);

      const filesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStoredFiles(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleDownload = async (downloadURL, fileName) => {
    try {
      const response = await fetch(downloadURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handlePreview = (file) => {
    setModalFile({
      ...file,
      previewURL: file.downloadURL,
    });
  };

  const closeModal = () => {
    setModalFile(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = storedFiles.slice(indexOfFirstFile, indexOfLastFile);

  return (
    <div className="stored-files">
      <h2>Stored Files</h2>
      {storedFiles.length > 0 ? (
        <>
          <div className="sort-container">
            <button onClick={() => handleSort("name")}>
              Sort by Name{" "}
              {sortConfig.key === "name" &&
                (sortConfig.direction === "asc" ? (
                  <FaSort />
                ) : (
                  <FaSort style={{ transform: "rotate(180deg)" }} />
                ))}
            </button>
            <button onClick={() => handleSort("timestamp")}>
              Sort by Date{" "}
              {sortConfig.key === "timestamp" &&
                (sortConfig.direction === "asc" ? (
                  <FaSort />
                ) : (
                  <FaSort style={{ transform: "rotate(180deg)" }} />
                ))}
            </button>
          </div>
          <ul className="file-list">
            {currentFiles.map((file) => (
              <li key={file.id}>
                <span>{file.name}</span>
                <span>
                  {new Date(file.timestamp.seconds * 1000).toLocaleString()}
                </span>
                <div className="actions">
                  <button
                    onClick={() => handleDownload(file.downloadURL, file.name)}
                  >
                    <FaDownload /> Download
                  </button>
                  <button onClick={() => handlePreview(file)}>
                    <FaEye /> Preview
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(storedFiles.length / filesPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      ) : (
        <p>No files stored yet.</p>
      )}

      {modalFile && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Preview of {modalFile.name}</h2>
            <iframe
              src={modalFile.previewURL}
              title="File Preview"
              width="100%"
              height="400"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Retrieve;
