import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  username: string | null;
  setUsername: (username: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [username, setUsernameState] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('ghz_username');
    if (storedUsername) {
      setUsernameState(storedUsername);
    }
  }, []);

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    localStorage.setItem('ghz_username', newUsername);
  };

  const logout = () => {
    setUsernameState(null);
    localStorage.removeItem('ghz_username');
  };

  return (
    <UserContext.Provider value={{ username, setUsername, logout }}>
      {children}
    </UserContext.Provider>
  );
};