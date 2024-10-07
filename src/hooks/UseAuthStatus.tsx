import { useState, useEffect } from 'react';
import { getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<any>(null);
  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();

      setUser(currentUser);
      setDisplayName(userAttributes.preferred_username);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return { isAuthenticated, isAuthLoading, checkAuthStatus, user, logout, displayName };
}


