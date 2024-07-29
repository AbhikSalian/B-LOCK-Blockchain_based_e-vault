import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaSort, FaEye } from "react-icons/fa";
import "./Retrieve.css";

function Retrieve({ db, user, sortConfig, setSortConfig }) {
  const [storedFiles, setStoredFiles] = useState([]);
  const [allStoredFiles, setAllStoredFiles] = useState([]); // Track all files
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5);
  const [modalFile, setModalFile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    if (!user) return;

    try {
      const filesQuery = query(
        collection(db, "files"),
        where("owner", "==", user.uid),
      );
      const querySnapshot = await getDocs(filesQuery);

      const filesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllStoredFiles(filesData); // Set all files
      setStoredFiles(filesData); // Set files to be displayed
    } catch (error) {
      console.error("Error fetching files:", error);
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

    const sortedFiles = [...allStoredFiles].sort((a, b) => {
      if (key === "timestamp") {
        return direction === "asc"
          ? a.timestamp.seconds - b.timestamp.seconds
          : b.timestamp.seconds - a.timestamp.seconds;
      } else if (key === "name") {
        return direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    setStoredFiles(sortedFiles); // Update displayed files after sorting
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = storedFiles.slice(indexOfFirstFile, indexOfLastFile);

  const handleFileClick = (url) => {
    window.open(url, '_blank');
  };

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
                <span onClick={() => handleFileClick(file.downloadURL)} style={{cursor: "pointer", color: "#ffffff"}}>{file.name}</span>
                <span>{new Date(file.timestamp.seconds * 1000).toLocaleString()}</span>
                <div className="actions">
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
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
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
        </div>
      )}
    </div>
  );
}

export default Retrieve;
