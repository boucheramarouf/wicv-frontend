// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored && stored !== 'undefined') {
      try {
        return JSON.parse(stored);
      } catch {
        console.error("Failed to parse user from localStorage");
      }
    }
    return null;
  });

  const login = (userData) => {
    try {
      const userToStore = {
        idUtilisateur: userData.idUtilisateur,
        nom: userData.nom,
        prenom: userData.prenom,
        roles: userData.roles,
        email: userData.email,
        numeroTelephone: userData.numeroTelephone || "",
      };
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error("Failed to clear auth data", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};