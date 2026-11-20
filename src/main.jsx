import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DirectoryProvider } from "./contexts/DirectoryContext.jsx";
import { FinderProvider } from "./contexts/FinderContext.jsx";

createRoot(document.getElementById("root")).render(
  <FinderProvider>
    <DirectoryProvider>
      <App />
    </DirectoryProvider>
  </FinderProvider>,
);
