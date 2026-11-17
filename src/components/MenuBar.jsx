import "./MenuBar.css";

function MenuBar() {
  const now = new Date();

  const date = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const time = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).replace(".", ":");

  return (
    <div className="menu-bar">
      <div className="menu-left">
        <span className="linux-logo">◉</span>
        <span className="app-name">Desktop</span>

        {/* <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Window</span> */}
      </div>

      <div className="menu-right">
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

export default MenuBar;
