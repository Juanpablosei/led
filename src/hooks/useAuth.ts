import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await storageService.getAuthToken();
      const hasToken = token !== null && token !== '';
      
      setIsAuthenticated(hasToken);
      
      if (!hasToken) {
        // No hay token, redirigir al login
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await storageService.clearAuthData();
      setIsAuthenticated(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      router.replace('/login');
    }
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
    checkAuthStatus
  };
};
