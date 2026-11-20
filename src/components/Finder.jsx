import { useDirectory } from "../contexts/DirectoryContext";
import { convertSize } from "../js/convertSize";
import "./Finder.css";
import "lucide-react";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import FinderSkeleton from "./FinderSkeleton";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  House,
  RotateCw,
} from "lucide-react";
import { useFinder } from "../contexts/FinderContext";

function Finder() {
  const {
    closeFinder,
    minimizeFinder,
    isFinderMinimized,
    isSelectionMode,
    onSelect,
  } = useFinder();
  const nodeRef = useRef();

  const {
    directory,
    sortedItems,
    refreshDirectory,
    loading,
    error,
    navigationHistory,
    historyIndex,
    navigateTo,
    goBack,
    goForward,
  } = useDirectory();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const selectedItem = sortedItems.find((item) => item.path === selectedFile);

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

  const handleSelectItem = (item) => {
    setSelectedFile(item.path);
    setSelectedName(item.name);
  };

  const handleOpenItem = (item) => {
    // Folder tetap bisa dibuka dengan double-click
    if (item.type === "dir") {
      navigateTo(item.path);
      setSelectedFile(null);
      setSelectedName("");
      return;
    }

    // Dalam mode select, file tidak di-download
    if (isSelectionMode) {
      handleSelectItem(item);
      return;
    }

    // Download file dalam mode normal
    const encodedPath = item.path
      .split("/")
      .filter(Boolean)
      .map(encodeURIComponent)
      .join("/");

    const downloadUrl = `http://laptop07.local/api/browse/${encodedPath}`;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = item.name;

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div
      className={`finder-container

        `}
    >
      <Draggable nodeRef={nodeRef} handle=".finder-header">
        <div
          ref={nodeRef}
          onDragStart={(e) => e.preventDefault()}
          className={`finder-window
            ${isFinderMinimized ? "minimized" : ""}  
            ${isFullScreen ? "fullscreen" : ""}`}
          style={{
            left: pos.x,
            top: pos.y,
          }}
        >
          <div
            className="finder-header"
            onDoubleClick={() => setIsFullScreen((prev) => !prev)}
          >
            <div className="finder-navigation">
              <button
                onClick={goBack}
                disabled={historyIndex <= 0}
                title="Back"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={goForward}
                disabled={historyIndex >= navigationHistory.length - 1}
                title="Forward"
              >
                <ChevronRight size={14} />
              </button>
              <button onClick={refreshDirectory} title="Refresh">
                <RotateCw size={14} />
              </button>
            </div>
            <div className="window-controls">
              <button
                className="window-button close-button"
                onClick={closeFinder}
              >
                ×
              </button>

              <button
                className="window-button minimize-button"
                onClick={minimizeFinder}
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

            <span className="finder-title">
              {isSelectionMode ? "Pilih File atau Folder" : "File Manager"}
            </span>
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
              <div className="finder-path">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                  {/* Root directory */}
                  <div className="breadcrumb-item">
                    <button
                      onClick={() => navigateTo("/")}
                      className={
                        directory.current_dir === "/" ? "breadcrumb-active" : ""
                      }
                      title="Home"
                    >
                      <House size={15} />
                    </button>
                  </div>

                  {directory.current_dir
                    .split("/")
                    .filter(Boolean)
                    .reduce((acc, name, index, paths) => {
                      const path = "/" + paths.slice(0, index + 1).join("/");

                      acc.push({
                        name,
                        path,
                      });

                      return acc;
                    }, [])
                    .map((location, index, paths) => (
                      <div className="breadcrumb-item" key={location.path}>
                        <span> / </span>

                        <button
                          onClick={() => navigateTo(location.path)}
                          className={
                            index === paths.length - 1
                              ? "breadcrumb-active"
                              : ""
                          }
                        >
                          {location.name}
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="file-list">
                {error && <div className="finder-error">{error}</div>}

                <table className="file-table">
                  <thead
                    style={{
                      position: "sticky",
                      top: -1,
                      zIndex: 10,
                    }}
                  >
                    <tr>
                      <th>Name</th>
                      <th>Date Modified</th>
                      <th>Size</th>
                      <th>Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <FinderSkeleton rows={8} />
                    ) : (
                      <>
                        {sortedItems.map((file) => {
                          const size = convertSize(file.size_bytes);

                          return (
                            <tr
                              key={file.path}
                              onClick={() => {
                                setSelectedFile(file.path);
                                setSelectedName(file.name);
                              }}
                              onDoubleClick={() => handleOpenItem(file)}
                              className={
                                selectedFile === file.path ? "selected" : ""
                              }
                            >
                              <td>
                                {file.type === "dir" ? "📁" : "📄"} {file.name}
                              </td>

                              <td>{file.modified_at}</td>

                              <td>
                                {file.type === "dir"
                                  ? "-"
                                  : convertSize(file.size_bytes)}
                              </td>

                              <td>
                                {file.type === "dir" ? "Directory" : "File"}
                              </td>
                            </tr>
                          );
                        })}

                        {sortedItems.length === 0 && (
                          <tr>
                            <td colSpan="4">This folder is empty</td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {isSelectionMode && (
                <div className="finder-selection-footer">
                  <div className="selection-input-group">
                    <label htmlFor="selected-item-name">File name:</label>

                    <input
                      id="selected-item-name"
                      type="text"
                      value={selectedName}
                      placeholder="Select a file or folder"
                      onChange={(e) => setSelectedName(e.target.value)}
                    />
                  </div>

                  <div className="selection-actions">
                    <button
                      className="selection-cancel-button"
                      onClick={closeFinder}
                    >
                      Cancel
                    </button>
                    <button
                      className="selection-upload-button"
                      disabled={!selectedItem || !selectedName.trim()}
                      onClick={() => {
                        if (!selectedItem || !selectedName.trim()) return;

                        onSelect?.({
                          ...selectedItem,
                          name: selectedName.trim(),
                        });
                      }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Draggable>
    </div>
  );
}

export default Finder;
