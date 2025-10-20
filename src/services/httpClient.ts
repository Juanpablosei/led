import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { config } from '../config/environment';
import { TRANSLATION_CONFIG } from '../utils/translationConfig';
import { storageService } from './storageService';

// Crear instancia de Axios
export const httpClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: config.API_TIMEOUT,
});

// Rutas públicas que NO requieren token
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/login_usuario_edificio',
  '/auth/forgo_password',
  '/auth/forgo_code_edificio',
  '/auth/send_code_edificio',
  '/auth/comprobar_nif',
  '/maestros/parametros-publicos',
  '/auth/register',
  '/maestros/colegio-profesionales-publicos/comunidades-autonomas',
  '/maestros/colegio-profesionales-publicos',
];

// ==========================================
// INTERCEPTOR DE REQUEST
// ==========================================
httpClient.interceptors.request.use(
  async (config) => {
    // Verificar si es una ruta pública
    const isPublicRoute = PUBLIC_ROUTES.some(route => config.url?.includes(route));

    // 1. Agregar Token automáticamente (solo si NO es ruta pública)
    if (!isPublicRoute) {
      const token = await storageService.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 2. Agregar idioma automáticamente (siempre)
    const language = await AsyncStorage.getItem(TRANSLATION_CONFIG.storageKey);
    if (language) {
      config.headers['Accept-Language'] = language; // "es" o "ca"
    } else {
      // Si no hay idioma guardado, usar el default
      config.headers['Accept-Language'] = 'es';
    }

    // 3. Configuración completada

    return config;
  },
  (error) => {
    // Request Error
    return Promise.reject(error);
  }
);

// ==========================================
// INTERCEPTOR DE RESPONSE
// ==========================================
httpClient.interceptors.response.use(
  (response) => {
    // Respuesta exitosa procesada
    return response;
  },
  async (error) => {
    // Manejar token expirado (401)
    if (error.response?.status === 401) {
      // Token expirado o inválido
      
      // Limpiar datos de autenticación
      await storageService.clearAuthData();
      
      // Aquí podrías redirigir al login si tienes acceso al router
      // router.push('/login');
      
      return Promise.reject({
        ...error,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      });
    }

    // Error manejado silenciosamente
    
    // Devolver el error sin más logging para que el código que llama lo maneje
    return Promise.reject(error);
  }
);

