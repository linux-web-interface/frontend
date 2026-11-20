import { useCallback, useEffect, useState } from "react";
import "./DesktopIcons.css";
import Finder from "./Finder";
import { useFinder } from "../contexts/FinderContext";
import api from "../js/api";
import { useDirectory } from "../contexts/DirectoryContext";

function DesktopIcons() {
  const { navigateTo } = useDirectory();
  const { openFinder, closeFinder } = useFinder();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [contextMenu, setContextMenu] = useState(null);

  // ==============================
  // GET DESKTOP ITEMS
  // ==============================

  const fetchDesktop = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/desktop");

      setItems(response.data.items || []);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Gagal memuat desktop",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesktop();
  }, [fetchDesktop]);

  // ==============================
  // FIND AVAILABLE POSITION
  // ==============================

  const handleOpenDesktopItem = async (item) => {
    try {
      // Buka Finder
      openFinder();

      // Navigasi ke lokasi item
      if (item.type === "dir") {
        await navigateTo(item.path);
      } else {
        // Jika file, buka direktori induknya
        const parentPath =
          item.path.substring(0, item.path.lastIndexOf("/")) || "/";

        await navigateTo(parentPath);
      }
    } catch (err) {
      console.error("Gagal membuka item:", err);
    }
  };

  const getNextPosition = () => {
    const usedPositions = new Set(
      items.map((item) => `${item.pos.x}-${item.pos.y}`),
    );

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
  // ADD DESKTOP SHORTCUT
  // ==============================

  const handleSelectShortcut = async (selectedItem) => {
    const payload = {
      id: crypto.randomUUID(),
      name: selectedItem.name,
      type: selectedItem.type,
      path: selectedItem.path,
      pos: getNextPosition(),
    };

    try {
      const response = await api.post("/desktop", payload);

      setItems((previous) => [...previous, response.data.item]);

      closeFinder();
    } catch (err) {
      window.alert(
        err.response?.data?.error ||
          err.message ||
          "Gagal menambahkan shortcut",
      );
    }
  };

  // ==============================
  // DELETE DESKTOP ITEM
  // ==============================

  const deleteDesktopItem = async (item) => {
    closeContextMenu();

    try {
      await api.delete(`/desktop/${encodeURIComponent(item.id)}`);

      setItems((previous) =>
        previous.filter((current) => current.id !== item.id),
      );
    } catch (err) {
      window.alert(
        err.response?.data?.error || err.message || "Gagal menghapus shortcut",
      );
    }
  };

  // ==============================
  // OPEN FINDER SELECTION MODE
  // ==============================

  const handleAddShortcut = () => {
    closeContextMenu();

    openFinder({
      selectionMode: true,
      onSelect: handleSelectShortcut,
    });
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
              onClick={() => handleOpenDesktopItem(item)}
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

              <button onClick={handleAddShortcut}>📎 Tambahkan shortcut</button>

              <div className="context-menu-divider" />

              <button
                onClick={() => {
                  closeContextMenu();
                  fetchDesktop();
                }}
              >
                🔄 Refresh
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DesktopIcons;
