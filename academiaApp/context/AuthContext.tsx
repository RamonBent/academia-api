import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  loggedIn: boolean;
  userEmail: string;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  userEmail: '',
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const login = (email: string) => {
    setUserEmail(email);
    setLoggedIn(true);
  };

  const logout = () => {
    setLoggedIn(false);
    setUserEmail('');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);