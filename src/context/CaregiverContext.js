import { createContext, useContext, useState } from "react";

const CaregiverContext = createContext();

export const useCaregiver = () => useContext(CaregiverContext);

export function CaregiverProvider({ children }) {
  const [activePerson, setActivePerson] = useState({
    type: "self",
    id: null,
    name: "Myself",
  });

  return (
    <CaregiverContext.Provider value={{ activePerson, setActivePerson }}>
      {children}
    </CaregiverContext.Provider>
  );
}
