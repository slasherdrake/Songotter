import { createContext, useContext, ReactNode } from 'react';
import { useAuthStatus } from '../hooks/UseAuthStatus';

const AuthContext = createContext<ReturnType<typeof useAuthStatus> | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthStatus();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

