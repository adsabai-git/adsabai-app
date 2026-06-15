'use client';

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react';

// useLayoutEffect fires synchronously before paint on the client;
// falls back to useEffect on the server (where layout effects are skipped anyway).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (identifier: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (name: string, identifier: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

function readCachedUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user') ?? localStorage.getItem('adSabaiUser');
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    return { id: p.id ? String(p.id) : '0', name: p.name, email: p.email ?? null, phone: p.phone ?? null };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Runs synchronously before the browser paints — eliminates spinner flash for cached users.
  useIsomorphicLayoutEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    const cached = readCachedUser();
    if (cached) {
      setUser(cached);
      setIsLoading(false);
    } else {
      // Token exists but no cached user — mark ready now; verify() will fetch fresh data
      setIsLoading(false);
    }
  }, []);

  // Background token verification — runs after paint, keeps session fresh
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    const verify = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (response.status === 401) {
          // Token is genuinely invalid — log out
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          return;
        }

        if (!response.ok) {
          // Server error or network hiccup — keep the cached user, try again next visit
          return;
        }

        const data = await response.json();
        const fresh: User = {
          id:    data.user.id.toString(),
          email: data.user.email ?? null,
          phone: data.user.phone ?? null,
          name:  data.user.name,
        };
        setUser(fresh);
        localStorage.setItem('user', JSON.stringify(fresh));
      } catch {
        // Network failure (offline, timeout, etc.) — keep cached user, do NOT log out
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, []);

  const login = async (identifier: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const body = isEmail ? { email: identifier, password } : { phone: identifier, password };
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        return { ok: false, error: data.error || 'Login failed.' };
      }

      const userData: User = {
        id: data.user.id.toString(),
        email: data.user.email ?? null,
        phone: data.user.phone ?? null,
        name: data.user.name,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      setIsLoading(false);
      return { ok: true };
    } catch {
      setIsLoading(false);
      return { ok: false, error: 'Network error. Please check your connection.' };
    }
  };

  const register = async (identifier: string, password: string, name: string): Promise<{ ok: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const body = isEmail
        ? { name, email: identifier, password }
        : { name, phone: identifier, password };
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        setIsLoading(false);
        return { ok: false, error: data.error || 'Registration failed.' };
      }

      const userData: User = {
        id: data.user.id.toString(),
        email: data.user.email ?? null,
        phone: data.user.phone ?? null,
        name: data.user.name,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      setIsLoading(false);
      return { ok: true };
    } catch {
      setIsLoading(false);
      return { ok: false, error: 'Network error. Please check your connection.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateProfile = async (name: string, identifier: string, password?: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const isEmail = identifier.includes('@');
      const body = isEmail
        ? { name, email: identifier, password }
        : { name, phone: identifier, password };

      const response = await fetch('/api/auth/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) return false;

      const data = await response.json();
      const userData: User = {
        id: data.user.id.toString(),
        email: data.user.email ?? null,
        phone: data.user.phone ?? null,
        name: data.user.name,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Update profile failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    updateProfile,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};