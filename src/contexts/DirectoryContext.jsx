import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";

const DirectoryContext = createContext();

export const DirectoryProvider = ({ children }) => {
  const [directory, setDirectory] = useState({});

  const sortedItems = useMemo(() => {
    const items = directory.items ?? [];


    return [
      ...items.filter(file => file.type === "dir"),
      ...items.filter(file => file.type !== "dir"),
    ];
  }, [directory.items]);

  const value = useMemo(
    () => ({
      directory,
      setDirectory,
      sortedItems,
    }),
    [directory, sortedItems]
  );

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error("useDirectory harus digunakan di dalam DirectoryProvider");
  }
  return context;
};
