"use client"
import { createContext, useContext, useState } from "react";

const OpenContext = createContext();

export function OpenProvider({ children }) {
  const [open, setOpenA] = useState(false);
  const [toggle, settoggle] = useState("signup")

  return (
    <OpenContext.Provider value={{ open, setOpenA, toggle, settoggle}}>
      {children}
    </OpenContext.Provider>
  );
}

export function useOpen() {
  return useContext(OpenContext);
}
