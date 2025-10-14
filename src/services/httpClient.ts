import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TRANSLATION_CONFIG } from '../utils/translationConfig';
import { storageService } from './storageService';

const API_BASE_URL = 'https://librodigitalws.arescoop.es/api';

// Crear instancia de Axios
export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos
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

    // 3. Log para debugging (opcional - puedes comentarlo en producción)
    if (__DEV__) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
      console.log('🌐 Language enviado en header:', config.headers['Accept-Language']);
      console.log('🌐 Language del storage:', language || 'sin valor (usando default: es)');
      console.log('🔑 Token:', !isPublicRoute && config.headers.Authorization ? '✅' : '❌');
      console.log('🌍 Ruta pública:', isPublicRoute ? 'Sí' : 'No');
      console.log('📦 Datos enviados:', config.data);
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ==========================================
// INTERCEPTOR DE RESPONSE
// ==========================================
httpClient.interceptors.response.use(
  (response) => {
    // Log de respuestas exitosas (opcional)
    if (__DEV__) {
      console.log('📥 Response:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    // Manejar token expirado (401)
    if (error.response?.status === 401) {
      if (__DEV__) {
        console.warn('⚠️ Token expirado o inválido');
      }
      
      // Limpiar datos de autenticación
      await storageService.clearAuthData();
      
      // Aquí podrías redirigir al login si tienes acceso al router
      // router.push('/login');
      
      return Promise.reject({
        ...error,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
      });
    }

    // Log silencioso de errores en desarrollo (sin console.error para evitar logs feos)
    if (__DEV__) {
      const status = error.response?.status;
      const url = error.config?.url;
      
      // Solo loggear información útil, no el stack trace completo
      if (status === 422) {
        console.log('⚠️ Error de validación (422):', url);
      } else if (status === 403) {
        console.log('🚫 Acceso denegado (403):', url);
      } else if (status === 500) {
        console.log('💥 Error del servidor (500):', url);
      } else if (status) {
        console.log(`⚠️ Error ${status}:`, url);
      }
    }
    
    // Devolver el error sin más logging para que el código que llama lo maneje
    return Promise.reject(error);
  }
);

