import { createContext, useContext, useState, type ReactNode } from 'react';
import * as api from '@/src/services/api';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  userId: string | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  register: (username: string, name: string, password: string) => Promise<boolean>;
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

  const signIn = async (username: string, password: string) => {
    try {
      const resp = await api.login(username, password);
      // expect resp to include some token and user id, but be defensive
      const authToken = resp?.token ?? resp?.accessToken ?? null;
      const id = resp?.userId ?? resp?.id ?? resp?.user?.id ?? null;
      const name = resp?.username ?? resp?.user?.name ?? username;

      setIsAuthenticated(true);
      setUser({ name, email: username });
      setToken(authToken);
      setUserId(id);

      return true;
    } catch (err: any) {
      // log error to Metro/console so developer can see API errors when testing
      // eslint-disable-next-line no-console
      console.error('signIn error:', err?.message ?? err);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      setUserId(null);
      return false;
    }
  };

  const register = async (username: string, name: string, password: string) => {
    try {
      await api.register(username, password);
      // auto-login after register
      return await signIn(username, password);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('register error:', err?.message ?? err);
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
