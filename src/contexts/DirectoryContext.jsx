
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../js/api";

const DirectoryContext = createContext(null);

const buildBrowseUrl = (path) => {
  const encodedPath = path
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");

  return `/browse/${encodedPath}`;
};

export const DirectoryProvider = ({ children }) => {
  const [directory, setDirectory] = useState({
    current_dir: "/",
    parent_dir: null,
    total_items: 0,
    items: [],
  });

  // Cache direktori berdasarkan path
  const [directoryCache, setDirectoryCache] = useState({});

  const [navigationHistory, setNavigationHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mengambil direktori dari cache atau API
  const fetchDirectory = async (path, force = false) => {
    setError(null);

    // Gunakan cache jika tersedia
    if (!force && directoryCache[path]) {
      const cachedData = directoryCache[path];

      setDirectory(cachedData);
      return cachedData;
    }

    setLoading(true);

    try {
      const response = await api.get(buildBrowseUrl(path));
      const data = response.data;

      if (!data || !Array.isArray(data.items)) {
        throw new Error("Respons direktori tidak valid");
      }

      // Simpan hasil API ke cache
      setDirectoryCache((prev) => ({
        ...prev,
        [data.current_dir]: data,
      }));

      setDirectory(data);

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Navigasi ke direktori baru
  const navigateTo = async (path) => {
    try {
      const data = await fetchDirectory(path);

      setNavigationHistory((prev) => [
        ...prev.slice(0, historyIndex + 1),
        data.current_dir,
      ]);

      setHistoryIndex((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Back
  const goBack = async () => {
    if (historyIndex <= 0) return;

    const nextIndex = historyIndex - 1;

    try {
      await fetchDirectory(navigationHistory[nextIndex]);
      setHistoryIndex(nextIndex);
    } catch (err) {
      console.error(err);
    }
  };

  // Forward
  const goForward = async () => {
    if (historyIndex >= navigationHistory.length - 1) return;

    const nextIndex = historyIndex + 1;

    try {
      await fetchDirectory(navigationHistory[nextIndex]);
      setHistoryIndex(nextIndex);
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh direktori saat ini, abaikan cache
  const refreshDirectory = async () => {
    return fetchDirectory(directory.current_dir, true);
  };

  // Initial directory
  useEffect(() => {
    const initializeDirectory = async () => {
      try {
        const data = await fetchDirectory("/");

        setNavigationHistory([data.current_dir]);
        setHistoryIndex(0);
      } catch (err) {
        console.error(err);
      }
    };

    initializeDirectory();
  }, []);

  // Sorting direktori
  const sortedItems = useMemo(() => {
    return [...directory.items].sort((a, b) => {
      // Folder lebih dahulu daripada file
      if (a.type !== b.type) {
        return a.type === "dir" ? -1 : 1;
      }

      // Urutkan berdasarkan nama
      return a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
        numeric: true,
      });
    });
  }, [directory.items]);

  const value = {
    directory,
    directoryCache,
    sortedItems,
    loading,
    error,
    navigationHistory,
    historyIndex,
    navigateTo,
    goBack,
    goForward,
    fetchDirectory,
    refreshDirectory,
  };

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => {
  const context = useContext(DirectoryContext);

  if (!context) {
    throw new Error("useDirectory must be used within DirectoryProvider");
  }

  return context;
};
