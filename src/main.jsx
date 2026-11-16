import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DirectoryProvider } from "./contexts/DirectoryContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DirectoryProvider>
      <App />
    </DirectoryProvider>
  </StrictMode>,
);
