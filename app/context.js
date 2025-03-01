"use client";
import { createContext, useContext, useState } from "react";

const OpenContext = createContext();

export const OpenProvider = ({ children }) => {
  const [open, setOpenA] = useState(false);

  return (
    <OpenContext.Provider value={{ open, setOpenA }}>
      {children}
    </OpenContext.Provider>
  );
};

export const useOpen = () => useContext(OpenContext);
