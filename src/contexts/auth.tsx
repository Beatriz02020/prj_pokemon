import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => boolean;
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

  const signIn = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const canSignIn =
      normalizedEmail === TEST_USER.email && normalizedPassword === TEST_USER.password;

    if (canSignIn) {
      setIsAuthenticated(true);
      setUser({ name: TEST_USER.name, email: TEST_USER.email });
      return true;
    }

    setIsAuthenticated(false);
    setUser(null);
    return false;
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
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
