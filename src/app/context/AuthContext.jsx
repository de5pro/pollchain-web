'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (cookies.user) {
        try {
          const parsedUser = cookies.user;
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user cookie:", error);
        }
      }
      setLoading(false); // Set loading to false after initialization
    };

    initializeUser();
  }, [cookies]);

  const login = async (npm, password) => {
    if (npm && password) {
      const user = { npm, name: 'Test User' };
      setUser(user);
      setCookie('user', JSON.stringify(user), { path: '/', maxAge: 60 * 60 * 24 * 7 }); // 7 days
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    removeCookie('user', { path: '/' });
  };

  return (
     <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
