import { createContext, useContext, useState, type ReactNode } from 'react';
import * as api from '@/src/services/api';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  userId: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

type User = {
  name: string;
  email: string;
};

const TEST_USER = {
  name: 'Bia',
  email: 'bia@email.com',
  password: '123',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      const resp = await api.login(email, password);
      // expect resp to include some token and user id, but be defensive
      const authToken = resp?.token ?? resp?.accessToken ?? null;
      const id = resp?.userId ?? resp?.id ?? resp?.user?.id ?? null;
      const name = resp?.username ?? resp?.user?.name ?? email;

      setIsAuthenticated(true);
      setUser({ name, email });
      setToken(authToken);
      setUserId(id);

      return true;
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      setUserId(null);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.register(email, password);
      // auto-login after register
      return await signIn(email, password);
    } catch {
      return false;
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, userId, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
