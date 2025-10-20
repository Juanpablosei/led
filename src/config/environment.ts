import Constants from 'expo-constants';

// Configuración de la aplicación
export const config = {
  // API Configuration
  API_BASE_URL: Constants.expoConfig?.extra?.API_BASE_URL || 'https://librodigitalws.arescoop.es/api',
  
  // Web Configuration
  WEB_BASE_URL: Constants.expoConfig?.extra?.WEB_BASE_URL || 'https://desarrollo.arescoop.es/libro-edificio',
  
  // Environment
  NODE_ENV: Constants.expoConfig?.extra?.NODE_ENV || 'development',
  
  // App Configuration
  APP_NAME: Constants.expoConfig?.extra?.APP_NAME || 'LEDAT',
  APP_VERSION: Constants.expoConfig?.extra?.APP_VERSION || '1.0.0',
  
  // Timeouts
  API_TIMEOUT: 10000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 15,
  MAX_PAGE_SIZE: 100,
};

// Función para obtener la URL completa de la API
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.API_BASE_URL.endsWith('/') 
    ? config.API_BASE_URL.slice(0, -1) 
    : config.API_BASE_URL;
  
  const cleanEndpoint = endpoint.startsWith('/') 
    ? endpoint 
    : `/${endpoint}`;
    
  return `${baseUrl}${cleanEndpoint}`;
};

// Función para verificar si estamos en desarrollo
export const isDevelopment = (): boolean => {
  return config.NODE_ENV === 'development';
};

// Función para verificar si estamos en producción
export const isProduction = (): boolean => {
  return config.NODE_ENV === 'production';
};
