import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('crave_user');
    
    // SAFETY CHECK: Make sure it exists AND is not the literal string "undefined"
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Corrupted local storage data. Clearing it.", error);
        localStorage.removeItem('crave_user'); // Clean up the bad data
      }
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('crave_token', token);
    localStorage.setItem('crave_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('crave_token');
    localStorage.removeItem('crave_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};