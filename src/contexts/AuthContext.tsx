'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  age?: number;
  nationality?: string;
  is_admin: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (username: string, token: string) => void;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        localStorage.removeItem('user');
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        full_name: email.split('@')[0],
        phone: '',
        is_admin: email.includes('admin')
      };

      setUser(mockUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = (username: string, token: string) => {
    const adminUser: User = {
      id: username,
      email: '',
      full_name: username,
      phone: '',
      is_admin: true,
      token,
    };
    setUser(adminUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(adminUser));
    }
  };

  const getToken = (): string | null => {
    return user?.token || null;
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        age: userData.age,
        nationality: userData.nationality,
        is_admin: false
      };

      setUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(newUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, signUp, logout, updateProfile, getToken }}>
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
