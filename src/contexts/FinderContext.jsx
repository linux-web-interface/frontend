
import { createContext, useContext, useState } from "react";

const FinderContext = createContext(null);

export function FinderProvider({ children }) {
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isFinderMinimized, setIsFinderMinimized] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [onSelect, setOnSelect] = useState(null);

  // Membuka Finder
  const openFinder = ({ selectionMode = false, onSelect: callback = null } = {}) => {
    setIsSelectionMode(selectionMode);
    setOnSelect(() => callback);
    setIsFinderMinimized(false);
    setIsFinderOpen(true);
  };

  // Menutup Finder
  const closeFinder = () => {
    setIsFinderOpen(false);
    setIsFinderMinimized(false);
    setIsSelectionMode(false);
    setOnSelect(null);
  };

  // Minimize Finder
  const minimizeFinder = () => {
    setIsFinderMinimized(true);
  };

  // Restore Finder
  const restoreFinder = () => {
    setIsFinderMinimized(false);
  };

  const value = {
    isFinderOpen,
    setIsFinderOpen,
    isFinderMinimized,
    setIsFinderMinimized,
    isSelectionMode,
    setIsSelectionMode,
    onSelect,

    openFinder,
    closeFinder,
    minimizeFinder,
    restoreFinder,
  };

  return (
    <FinderContext.Provider value={value}>
      {children}
    </FinderContext.Provider>
  );
}

export function useFinder() {
  const context = useContext(FinderContext);

  if (!context) {
    throw new Error("useFinder must be used inside FinderProvider");
  }

  return context;
}
