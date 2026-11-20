import { useCallback, useEffect, useState } from "react";
import "./DesktopIcons.css";
import Finder from "./Finder";
import { useFinder } from "../contexts/FinderContext";

const API_URL = import.meta.env.VITE_API_URL || "";

function DesktopIcons() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    isFinderOpen,
    setIsFinderOpen,
    isFinderMinimized,
    setIsFinderMinimized,
    openFinder,
  } = useFinder();
  const [error, setError] = useState("");

  const [contextMenu, setContextMenu] = useState(null);

  const handleSelectShortcut = async (selectedItem) => {
    const payload = {
      id: crypto.randomUUID(),
      name: selectedItem.name,
      type: selectedItem.type,
      path: selectedItem.path,
      pos: getNextPosition(),
    };

    try {
      const result = await apiRequest("/desktop", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setItems((previous) => [...previous, result.item]);

      setIsFinderOpen(false);
    } catch (err) {
      window.alert(err.message);
    }
  };

  // ==============================
  // API HELPER
  // ==============================

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Terjadi kesalahan pada API");
    }

    return data;
  };

  // ==============================
  // GET DESKTOP ITEMS
  // ==============================

  const fetchDesktop = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/desktop");

      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesktop();
  }, [fetchDesktop]);

  // ==============================
  // CONTEXT MENU
  // ==============================

  const openContextMenu = (event, item = null) => {
    event.preventDefault();

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      item,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClick = () => closeContextMenu();

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ==============================
  // FIND AVAILABLE POSITION
  // ==============================

  const getNextPosition = () => {
    const usedPositions = new Set(
      items.map((item) => `${item.pos.x}-${item.pos.y}`),
    );

    // Maksimal 8 kolom sebelum berpindah ke row berikutnya
    const maxColumns = 8;

    for (let row = 0; ; row++) {
      for (let column = 0; column < maxColumns; column++) {
        const position = `${row}-${column}`;

        if (!usedPositions.has(position)) {
          return {
            x: row,
            y: column,
          };
        }
      }
    }
  };

  // ==============================
  // ADD DESKTOP ITEM
  // ==============================

  const addDesktopItem = async (type) => {
    closeContextMenu();

    const name = window.prompt(
      `Masukkan nama ${type === "dir" ? "folder" : "file"}:`,
    );

    if (!name || !name.trim()) return;

    const path = window.prompt(
      "Masukkan absolute Linux path:",
      `/home/${name.trim()}`,
    );

    if (!path || !path.startsWith("/")) {
      window.alert("Path harus berupa absolute Linux path.");
      return;
    }

    const payload = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      path,
      pos: getNextPosition(),
    };

    try {
      const result = await apiRequest("/desktop", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setItems((previous) => [...previous, result.item]);
    } catch (err) {
      window.alert(err.message);
    }
  };

  // ==============================
  // DELETE DESKTOP ITEM
  // ==============================

  const deleteDesktopItem = async (item) => {
    closeContextMenu();

    const confirmed = window.confirm(
      `Hapus shortcut "${item.name}" dari desktop?`,
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/desktop/${encodeURIComponent(item.id)}`, {
        method: "DELETE",
      });

      setItems((previous) =>
        previous.filter((current) => current.id !== item.id),
      );
    } catch (err) {
      window.alert(err.message);
    }
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <div
      className="container"
      onContextMenu={(event) => openContextMenu(event)}
    >
      <div className="desktop-icons">
        {loading && <div className="desktop-message">Memuat desktop...</div>}

        {error && (
          <div className="desktop-message error">
            {error}
            <button onClick={fetchDesktop}>Coba lagi</button>
          </div>
        )}

        {!loading &&
          !error &&
          items.map((item) => (
            <div
              className="desktop-icon"
              key={item.id}
              style={{
                gridRow: item.pos.x + 1,
                gridColumn: item.pos.y + 1,
              }}
              onContextMenu={(event) => {
                event.stopPropagation();
                openContextMenu(event, item);
              }}
              title={item.path}
            >
              <span className="icon-image">
                {item.type === "dir" ? "📁" : "📄"}
              </span>

              <span className="icon-name">{item.name}</span>
            </div>
          ))}
      </div>

      {/* ==============================
                FLOATING CONTEXT MENU
            ============================== */}

      {contextMenu && (
        <div
          className="desktop-context-menu"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          {contextMenu.item ? (
            <>
              <div className="context-menu-title">{contextMenu.item.name}</div>

              <button onClick={() => deleteDesktopItem(contextMenu.item)}>
                🗑️ Hapus dari desktop
              </button>
            </>
          ) : (
            <>
              <div className="context-menu-title">Desktop</div>

              <button
                onClick={() =>
                  openFinder({
                    selectionMode: true,
                    onSelect: handleSelectShortcut,
                  })
                }
              >
                📎 Tambahkan shortcut
              </button>

              <div className="context-menu-divider" />

              <button onClick={fetchDesktop}>🔄 Refresh</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DesktopIcons;
