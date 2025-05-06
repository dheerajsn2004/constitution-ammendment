import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [sessionToken, setSessionToken] = useState(() => {
    // Check if sessionToken is already in localStorage
    return localStorage.getItem('sessionToken') || null;
  });

  useEffect(() => {
    if (sessionToken) {
      // Store sessionToken in localStorage whenever it changes
      localStorage.setItem('sessionToken', sessionToken);
    } else {
      // Remove sessionToken from localStorage when it's null
      localStorage.removeItem('sessionToken');
    }
  }, [sessionToken]);

  return (
    <AuthContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
