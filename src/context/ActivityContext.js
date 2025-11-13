import React, { createContext, useContext, useState } from 'react';

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activityLog, setActivityLog] = useState([]);

  const logActivity = (message) => {
    const entry = {
      message,
      timestamp: new Date().toISOString(),
    };

    setActivityLog((prev) => [...prev, entry]);
  };

  return (
    <ActivityContext.Provider value={{ activityLog, logActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  return useContext(ActivityContext);
}
