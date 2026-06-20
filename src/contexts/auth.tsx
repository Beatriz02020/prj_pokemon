import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { extractUserId, login as loginRequest, register as registerRequest } from '@/src/services/authApi';

type User = {
  name: string;
  email: string;
};

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  userId: string | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    name: string,
    password: string,
  ) => Promise<{ success: boolean; userId: string | null }>;
  establishSession: (username: string, userId?: string | null, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const [storageUser, storageUserId] = await Promise.all([
        AsyncStorage.getItem('@Auth:user'),
        AsyncStorage.getItem('@Auth:userId'),
      ]);

      if (storageUser) {
        setUser({ name: storageUser, email: storageUser });
        setUserId(storageUserId);
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    }

    void loadStorageData();
  }, []);

  const establishSession = async (username: string, nextUserId?: string | null, name?: string) => {
    const displayName = name?.trim() || username;

    setIsAuthenticated(true);
    setUser({ name: displayName, email: username });
    setUserId(nextUserId ?? null);

    await AsyncStorage.setItem('@Auth:user', username);

    if (nextUserId) {
      await AsyncStorage.setItem('@Auth:userId', nextUserId);
    } else {
      await AsyncStorage.removeItem('@Auth:userId');
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const response = await loginRequest({ username, password });
      const authToken = (response.token as string | undefined) ?? null;
      const id = extractUserId(response);
      const responseUsername = (response.username as string | undefined) ?? username;

      setToken(authToken);
      await establishSession(responseUsername, id);

      return true;
    } catch (err: unknown) {
      console.error('signIn error:', err instanceof Error ? err.message : err);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      setUserId(null);
      return false;
    }
  };

  const register = async (username: string, name: string, password: string) => {
    try {
      const response = await registerRequest({ username, password });
      const id = extractUserId(response);
      const responseUsername = (response.username as string | undefined) ?? username;
      const authToken = (response.token as string | undefined) ?? null;

      setToken(authToken);
      await establishSession(responseUsername, id, name);

      return { success: true, userId: id };
    } catch (err: unknown) {
      console.error('register error:', err instanceof Error ? err.message : err);
      return { success: false, userId: null };
    }
  };

  const signOut = async () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setUserId(null);
    await AsyncStorage.removeItem('@Auth:user');
    await AsyncStorage.removeItem('@Auth:userId');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        userId,
        isLoading,
        signIn,
        register,
        establishSession,
        signOut,
      }}
    >
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
