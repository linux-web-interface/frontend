import "./App.css";
import MenuBar from "./components/MenuBar";
import Dock from "./components/Dock";
import DesktopIcons from "./components/DesktopIcons";
import { useEffect, useState } from "react";
import Finder from "./components/Finder";
import { useDirectory } from "./contexts/DirectoryContext";
import api from "./js/api";
import { useFinder } from "./contexts/FinderContext";

function App() {
  const { directory, setDirectory } = useDirectory();
  const {
    isFinderOpen,
    setIsFinderOpen,
    isFinderMinimized,
    setIsFinderMinimized,
  } = useFinder();

  return (
    <div className="desktop">
      <MenuBar />

      <DesktopIcons />

      {isFinderOpen && (
        <Finder
          onClose={() => {
            setIsFinderOpen(false);
            setIsFinderMinimized(false);
          }}
          onMinimize={() => setIsFinderMinimized(true)}
          isMinimized={isFinderMinimized}
        />
      )}

      <Dock
        onOpenFinder={() => {
          setIsFinderOpen(true);
          if (isFinderOpen) {
            setIsFinderMinimized((prev) => !prev);
          } else {
            setIsFinderMinimized(false);
          }
        }}
      />
    </div>
  );
}

export default App;
