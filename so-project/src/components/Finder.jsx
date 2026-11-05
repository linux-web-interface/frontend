import './Finder.css';
import { useState } from 'react';


function Finder({ onClose, onMinimize, isMinimized }) {
  const files = [
  {
    name: 'Documents',
    date: '03/11/2026',
    size: '-',
    type: 'Folder',
    children: [
      {
        name: 'tugas-kuliah.pdf',
        date: '03/11/2026',
        size: '2 MB',
        type: 'PDF File'
      },
      {
        name: 'catatan.txt',
        date: '02/11/2026',
        size: '2 KB',
        type: 'Text File'
      }
    ]
  },
  {
    name: 'Downloads',
    date: '02/11/2026',
    size: '-',
    type: 'Folder',
    children: [
      {
        name: 'foto.jpg',
        date: '03/11/2026',
        size: '500 KB',
        type: 'JPG Image'
      }
    ]
  },
  {
    name: 'catatan.txt',
    date: '03/11/2026',
    size: '2 KB',
    type: 'Text File'
  },
  {
    name: 'tugas.pdf',
    date: '01/11/2026',
    size: '1.5 MB',
    type: 'PDF File'
  },
  {
    name: 'gambar.jpg',
    date: '10/11/2026',
    size: '3 MB',
    type: 'JPG File'
  },
];

  const [navigationHistory, setNavigationHistory] = useState([
    {
      name: 'My Files',
      files: files,
      path: [
        {
          name: 'My Files',
          files: files
        }
      ]
    }
  ]);

  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const currentLocation = navigationHistory[historyIndex];
  const currentFiles = currentLocation.files;
  const currentFolder = currentLocation.name;

  function handleOpenFolder(file) {
    if (file.type === 'Folder') {
      const newLocation = {
        name: file.name,
        files: file.children || [],
        path: [
          ...currentLocation.path,
          {
            name: file.name,
            files: file.children || []
          }
        ]
      };

      const updatedHistory = navigationHistory.slice(
        0,
        historyIndex + 1
      );

      updatedHistory.push(newLocation);

      setNavigationHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
      setSelectedFile(null);
    }
  }

  function handleGoBack() {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedFile(null);
    }
  }

  function handleCreateFolder() {
    const folderName = newFolderName.trim();

    if (!folderName) {
      return;
    }

    const newFolder = {
      name: folderName,
      date: new Date().toLocaleDateString('en-GB'),
      size: '-',
      type: 'Folder',
      children: []
    };

    const updatedHistory = [...navigationHistory];

    updatedHistory[historyIndex] = {
        ...currentLocation,
        files: [...currentFiles, newFolder]
    };

    setNavigationHistory(updatedHistory);
    setNewFolderName('');
    setIsCreatingFolder(false);
    setIsNewMenuOpen(false);
  }

  function handleGoForward() {
    if (historyIndex < navigationHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedFile(null);
    }
  }

  function handleNavigateTo(index) {
  const targetLocation = currentLocation.path[index];

  const newLocation = {
    ...targetLocation,
    path: currentLocation.path.slice(0, index + 1)
  };

  const updatedHistory = navigationHistory.slice(
      0,
      historyIndex + 1
    );

    updatedHistory.push(newLocation);

    setNavigationHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setSelectedFile(null);
  }

  return (
    <div
      className={`finder-window 
        ${isMinimized ? 'minimized' : ''} 
        ${isFullScreen ? 'fullscreen' : ''}`}
    >
      <div className="finder-header">
        <div className="window-controls">
          <button className="window-button close-button" onClick={onClose}>
            ×
          </button>

          <button className="window-button minimize-button" onClick={onMinimize}>
            −
          </button>

          <button className="window-button fullscreen-button" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? '−' : '+'}
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
                    setNewFolderName('');
                  }}
                >
                  Cancel
                </button>

                <button onClick={handleCreateFolder}>
                  Create
                </button>
              </div>
            </div>
          )}
          <div className="finder-navigation">

          {/* Tombol Back */}
            <button
              onClick={handleGoBack}
              disabled={historyIndex === 0}
              title="Back"
            >
              ‹
            </button>

            

            {/* Tombol Forward */}
            <button
              onClick={handleGoForward}
              disabled={historyIndex === navigationHistory.length - 1}
              title="Forward"
            >
              ›
            </button>

          {/* Breadcrumb */}
          <div className="breadcrumb">

            {currentLocation.path.map((location, index) => (
              <div className="breadcrumb-item" key={index}>

                <button
                  onClick={() => handleNavigateTo(index)}
                  className={
                    index === currentLocation.path.length - 1
                      ? 'breadcrumb-active'
                      : ''
                  }
                >
                  {index === 0 ? 'Home' : location.name}
                </button>

                {index !== currentLocation.path.length - 1 && (
                  <span> / </span>
                )}

              </div>
            ))}

          </div>
          <div className="finder-actions">
            <button className="new-button" onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}>
              + New
            </button>
            {isNewMenuOpen && (
              <div className="new-dropdown">
                <button onClick={() => {setIsNewMenuOpen(false); setIsCreatingFolder(true);}}>
                  📁 New Folder
                </button>

                <button onClick={() => setIsNewMenuOpen(false)}>
                  📄 New File
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="file-list">
          <table className="file-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date Modified</th>
                <th>Size</th>
                <th>Type</th>
              </tr>
            </thead>

            <tbody>
              {currentFiles.map((file, index) => (
                <tr 
                  key={index}
                  onClick={() => setSelectedFile(file.name)}
                  onDoubleClick={() => handleOpenFolder(file)}
                  className={selectedFile === file.name ? 'selected' : ''}
                  >
                  <td>
                    {file.type === 'Folder' ? '📁' : '📄'} {file.name}
                  </td>
                  <td>{file.date}</td>
                  <td>{file.size}</td>
                  <td>{file.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        </div>
      </div>
    </div>
  );
}

export default Finder;