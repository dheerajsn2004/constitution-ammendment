import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [sessionToken, setSessionToken] = useState(null);

  return (
    <AuthContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);