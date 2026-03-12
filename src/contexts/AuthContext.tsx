import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Usuario' | 'Administrador';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'Usuario' | 'Administrador') => boolean;
  register: (name: string, email: string, password: string, role: 'Usuario' | 'Administrador') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: 'Usuario' | 'Administrador') => {
    // Simulación de autenticación
    if (email && password) {
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        name: email.split('@')[0],
        email,
        role,
      };
      setUser(newUser);
      localStorage.setItem('ecoland_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string, role: 'Usuario' | 'Administrador') => {
    // Simulación de registro
    if (name && email && password) {
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        role,
      };
      setUser(newUser);
      localStorage.setItem('ecoland_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecoland_user');
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'Administrador';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
