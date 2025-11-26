import React, { createContext, useState, useEffect } from "react";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);

  // You can load API data here later
  useEffect(() => {
    setDashboardData({}); // placeholder to prevent errors
  }, []);

  return (
    <DashboardContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};
