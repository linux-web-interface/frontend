import { useDirectory } from "../contexts/DirectoryContext";
import { convertSize } from "../js/convertSize";
import "./Finder.css";
import { useState } from "react";

function Finder({ onClose, onMinimize, isMinimized }) {
  const { sortedItems } = useDirectory();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [size, setSize] = useState({
    h: 400,
    w: 650,
  });
  const [pos, setPos] = useState({
    x: window.innerWidth / 2 - size.w / 2,
    y: window.innerHeight / 2 - size.h / 2,
  });

  // const currentLocation = navigationHistory[historyIndex];
  // const currentFiles = currentLocation.files;
  // const currentFolder = currentLocation.name;

  return (
    <div
      className={`finder-container
        ${isMinimized ? "minimized" : ""} 
        `}
    >
      <div
        className={`finder-window 
        ${isFullScreen ? "fullscreen" : ""}`}
        style={{
          transform: `translate(
            ${pos.x}px, ${pos.y}px
          )`,
        }}
        
      >
        <div className="finder-header">
          <div className="window-controls">
            <button className="window-button close-button" onClick={onClose}>
              ×
            </button>

            <button
              className="window-button minimize-button"
              onClick={onMinimize}
            >
              −
            </button>

            <button
              className="window-button fullscreen-button"
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? "−" : "+"}
            </button>
          </div>

          <span className="finder-title">File Manager</span>
        </div>

        <div className="finder-body">
          <div className="finder-content">
            {isCreatingFolder && (
              <div className="create-folder-box">
                <h3>New Folder</h3>

                <input
                  type="text"
                  placeholder="Enter folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />

                <div className="create-folder-actions">
                  <button
                    onClick={() => {
                      setIsCreatingFolder(false);
                      setNewFolderName("");
                    }}
                  >
                    Cancel
                  </button>

                  <button onClick={() => {}}>Create</button>
                </div>
              </div>
            )}
            <div className="finder-navigation">
              {/* Tombol Back */}
              <button
                onClick={() => {}}
                // disabled={historyIndex === 0}
                title="Back"
              >
                ‹
              </button>

              {/* Tombol Forward */}
              <button
                onClick={() => {}}
                // disabled={historyIndex === navigationHistory.length - 1}
                title="Forward"
              >
                ›
              </button>

              {/* Breadcrumb */}
              <div className="breadcrumb">
                {/* {currentLocation.path.map((location, index) => (
                <div className="breadcrumb-item" key={index}>
                  <button
                    onClick={() => {}}
                    className={
                      index === currentLocation.path.length - 1
                        ? "breadcrumb-active"
                        : ""
                    }
                  >
                    {index === 0 ? "Home" : location.name}
                  </button>

                  {index !== currentLocation.path.length - 1 && (
                    <span> / </span>
                  )}
                </div>
              ))} */}
              </div>
              <div className="finder-actions">
                <button
                  className="new-button"
                  onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                >
                  + New
                </button>
                {isNewMenuOpen && (
                  <div className="new-dropdown">
                    <button
                      onClick={() => {
                        setIsNewMenuOpen(false);
                        setIsCreatingFolder(true);
                      }}
                    >
                      📁 New Folder
                    </button>

                    <button onClick={() => setIsNewMenuOpen(false)}>
                      📄 New File
                    </button>
                  </div>
                )}
              </div>
            </div>
            <table className="file-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date Modified</th>
                  <th>Size</th>
                  <th>Type</th>
                </tr>
              </thead>
            </table>
            <div className="file-list">
              <table className="file-table">
                <tbody>
                  {sortedItems.length > 0 &&
                    sortedItems.map((file, index) => {
                      const size = convertSize(file.size_bytes);

                      return (
                        <tr
                          key={index}
                          onClick={() => setSelectedFile(file.name)}
                          // onDoubleClick={() => {}}
                          className={
                            selectedFile === file.name ? "selected" : ""
                          }
                        >
                          <td>
                            {file.type === "dir" ? "📁" : "📄"} {file.name}
                          </td>
                          <td>{file.modified_at}</td>
                          <td>{file.type == "dir" ? "-" : size}</td>
                          <td>{file.type == "dir" ? "Directory" : "File"}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finder;
