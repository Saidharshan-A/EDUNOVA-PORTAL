import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('erp_token');
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role.toLowerCase() as UserRole,
            avatar: userData.avatar,
            details: {
              grade: userData.grade,
              section: userData.section,
              rollNo: userData.rollNo,
              department: userData.department,
            },
          });
        })
        .catch(() => {
          localStorage.removeItem('erp_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const { user: userData } = await api.login(email, password);
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role.toLowerCase() as UserRole,
        avatar: userData.avatar,
        details: {
          grade: userData.grade,
          section: userData.section,
          rollNo: userData.rollNo,
          department: userData.department,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
