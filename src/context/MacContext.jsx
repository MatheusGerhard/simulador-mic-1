import { createContext, useContext, useState } from "react";

const MacContext = createContext();

export function MacProvider({ children }) {
  const [activeMac, setActiveMac] = useState("mac1");

  return (
    <MacContext.Provider
      value={{
        activeMac,
        setActiveMac,
      }}
    >
      {children}
    </MacContext.Provider>
  );
}

export function useMac() {
  const context = useContext(MacContext);

  if (!context) {
    throw new Error("useMac deve ser usado dentro de um MacProvider");
  }

  return context;
}