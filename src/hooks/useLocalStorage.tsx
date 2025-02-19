import { useState, useEffect } from "react";

const useLocalStorage = (key: string) => {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key);
    try {
      return JSON.parse(savedValue || "null"); // Attempt to parse if possible
    } catch {
      return savedValue; // Return raw value if not JSON
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedValue = localStorage.getItem(key);
      try {
        setValue(JSON.parse(updatedValue || "null"));
      } catch {
        setValue(updatedValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return value;
};

export default useLocalStorage;
