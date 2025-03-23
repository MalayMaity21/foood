import React, { createContext, useState, useContext } from 'react';

// Create AdminContext
const AdminContext = createContext();

// AdminContext Provider Component
export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // State to store admin details

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook to use AdminContext
export const useAdmin = () => {
  return useContext(AdminContext);
};
