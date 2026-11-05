import './MenuBar.css';

function MenuBar() {
  return (
    <div className="menu-bar">

      <div className="menu-left">
        <span className="linux-logo">◉</span>
        <span className="app-name">Desktop</span>

        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Window</span>
      </div>

      <div className="menu-right">
        <span>03 Nov 2026</span>
        <span>20:30</span>
      </div>

    </div>
  );
}

export default MenuBar;