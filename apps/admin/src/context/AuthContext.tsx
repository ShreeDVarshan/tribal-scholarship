import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  mobile: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (mobile: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('jss_admin_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Demo session restore
      const savedUser = localStorage.getItem('jss_admin_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (mobile: string, pass: string) => {
    try {
      const res = await axios.post('/api/auth/login', { mobile, password: pass });
      if (res.data.success && res.data.data.user.role === 'ADMIN') {
        const { accessToken, user } = res.data.data;
        setToken(accessToken);
        setUser(user);
        localStorage.setItem('jss_admin_token', accessToken);
        localStorage.setItem('jss_admin_user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error', e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jss_admin_token');
    localStorage.removeItem('jss_admin_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
