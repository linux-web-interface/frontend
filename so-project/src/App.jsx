import './App.css';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import DesktopIcons from './components/DesktopIcons';
import { useState } from 'react';
import Finder from './components/Finder';

function App() {
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isFinderMinimized, setIsFinderMinimized] = useState(false);

  return (
    <div className="desktop">

      <MenuBar />

      <div className='desktop-content'>
        <h1>GUI Linux Web Desktop</h1>
        <p>Selamat datang di ujung dunia!</p>
      </div>

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
          setIsFinderMinimized(false);
        }}
      />
    </div>
  );
}

export default App;