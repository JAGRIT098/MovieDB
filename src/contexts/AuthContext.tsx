import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { movieDB, User } from '../services/database';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await movieDB.init();
        
        // Check for saved user session
        const savedUserId = localStorage.getItem('moviedb_user_id');
        if (savedUserId) {
          // In a real app, you'd validate the session with the server
          // For now, we'll just clear it and require re-login
          localStorage.removeItem('moviedb_user_id');
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const validUser = await movieDB.validateUser(username, password);
      if (validUser) {
        setUser(validUser);
        localStorage.setItem('moviedb_user_id', validUser.id);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if username already exists
      const existingUser = await movieDB.getUserByUsername(username);
      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }

      // Check if email already exists
      const existingEmail = await movieDB.getUserByEmail(email);
      if (existingEmail) {
        return { success: false, error: 'Email already exists' };
      }

      const newUser = await movieDB.createUser(username, email, password);
      setUser(newUser);
      localStorage.setItem('moviedb_user_id', newUser.id);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moviedb_user_id');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};