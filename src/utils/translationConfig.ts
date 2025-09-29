import { Platform } from 'react-native';

export const TRANSLATION_CONFIG = {
  // Configuración de idiomas soportados
  supportedLanguages: ['es', 'ca'] as const,
  defaultLanguage: 'es' as const,
  
  // Configuración de almacenamiento
  storageKey: 'app_language',
  
  // Configuración de fallback
  fallbackLanguage: 'es' as const,
  
  // Configuración de carga
  loadTimeout: 5000, // 5 segundos
  
  // Configuración de debug
  debug: __DEV__,
  
  // Configuración de plataforma
  platform: Platform.OS,
};

export type SupportedLanguage = typeof TRANSLATION_CONFIG.supportedLanguages[number];
