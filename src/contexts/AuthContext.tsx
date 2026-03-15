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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const loggedInUser: User = {
        ...data.user,
        token: data.token,
      };

      setUser(loggedInUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(loggedInUser));
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: userData.full_name || '',
          phone: userData.phone || '',
          age: userData.age,
          nationality: userData.nationality,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const newUser: User = {
        ...data.user,
        token: data.token,
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
    if (!user || !user.token) return;

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Failed to update profile');
    }

    const updatedUser = { ...user, ...result.user };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
