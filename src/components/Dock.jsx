import './Dock.css';

function Dock({onOpenFinder}) {
  return (
    <div className="dock-container">
      <div className="dock">

        <div 
          className="dock-item" 
          title="Finder"
          onClick={onOpenFinder}
        >
          📁
        </div>

        <div className="dock-item" title="Terminal">
          💻
        </div>

        <div className="dock-item" title="Settings">
          ⚙️
        </div>

      </div>
    </div>
  );
}

export default Dock;