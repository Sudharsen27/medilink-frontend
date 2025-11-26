import React, { createContext, useContext, useState } from "react";

const PrescriptionsContext = createContext();

export const PrescriptionsProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([]);

  return (
    <PrescriptionsContext.Provider value={{ prescriptions, setPrescriptions }}>
      {children}
    </PrescriptionsContext.Provider>
  );
};

export const usePrescriptions = () => useContext(PrescriptionsContext);
