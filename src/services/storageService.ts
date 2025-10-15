import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  NOTIFICATION_TOKEN: 'notification_token',
  BUILDING_DATA: 'building_data',
  USER_ROLES: 'user_roles',
  USER_DATA: 'user_data',
  REMEMBERED_NIF: 'remembered_nif',
  REMEMBERED_PASSWORD: 'remembered_password',
  REMEMBERED_CODE: 'remembered_code',
  LOGIN_TYPE: 'login_type',
  BIOMETRIC_ENABLED: 'biometric_enabled',
} as const;

export interface StoredBuildingData {
  id: number;
  user_id: number;
  nom: string;
  tipus: number;
  ref_cadastral: string;
  editor_correu?: string;
  editor_nif?: string;
  ambit?: string;
  created_at: string;
  updated_at: string;
  creador?: string;
  valoracio_economica_totalitat_intervencions?: number;
  cost_totalitat_fases?: number;
  duracio_total_obres?: number;
  observacions_cronograma_fases?: string;
  condicions_generals_i_particulars_acceptades_en?: string;
  actiu: boolean;
  versio_estesa: boolean;
  deleted_at?: string;
  fecha_contratacion_led_redaccion: string;
  fecha_contratacion_led_gestion: string;
  fecha_limite_uso?: string;
  fecha_baja_suscripcion?: string;
  user_id_baja_suscripcion?: number;
  estado: string;
  fechaestado?: string;
  comunitat_autonoma?: string;
  revisado: string;
  alias_tarifa_aplicada: string;
  tiempo_inicio_actividad?: string;
  tiempo_caducidad_documentos?: string;
  estado_convenio: string;
  fecha_validacion_convenio: string;
  entitat_conveni_id?: number;
  fecha_limite_uso_led_redaccion?: string;
  fecha_limite_uso_led_redaccion_modified_by_user_id?: number;
  propietario: boolean;
  sincronizado: boolean;
  es_catastro: boolean;
  fecha_contratacion: string;
}

export interface StoredUserRole {
  id: number;
  role_llibre_id: number;
  edifici_usuari_id: number;
  role_idioma: {
    id: number;
    role_llibre_id: number;
    locale: string;
    nom: string;
  };
}

export interface StoredUserData {
  id: number;
  first_name: string;
  last_name: string;
  nif: string;
  email: string;
  telefon?: string;
  tipo_usuario: 'propietario' | 'profesional';
  professio?: number | string;
  otra_profesion?: string;
  colegiado_externo_num_colegiado?: string;
  collegi_professional?: string;
  comunitat_autonoma?: string;
  entidad_convenio?: string | null;
  entitat_conveni_id?: number | null;
  role_altres?: string | null;
  locale?: string;
  colegiat?: string | null;
  politica_privacitat_acceptada_en?: string;
  colegiado_externo?: boolean;
  dades_professionals?: boolean;
  [key: string]: any; // Para cualquier campo adicional
}

export const storageService = {
  // Token management
  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw error;
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error removing auth token:', error);
      throw error;
    }
  },

  // Notification Token management
  async setNotificationToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TOKEN, token);
    } catch (error) {
      console.error('Error saving notification token:', error);
      throw error;
    }
  },

  async getNotificationToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TOKEN);
    } catch (error) {
      console.error('Error getting notification token:', error);
      return null;
    }
  },

  async removeNotificationToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_TOKEN);
    } catch (error) {
      console.error('Error removing notification token:', error);
      throw error;
    }
  },

  // Building data management
  async setBuildingData(buildingData: StoredBuildingData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BUILDING_DATA, JSON.stringify(buildingData));
    } catch (error) {
      console.error('Error saving building data:', error);
      throw error;
    }
  },

  async getBuildingData(): Promise<StoredBuildingData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BUILDING_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting building data:', error);
      return null;
    }
  },

  // User roles management
  async setUserRoles(roles: StoredUserRole[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLES, JSON.stringify(roles));
    } catch (error) {
      console.error('Error saving user roles:', error);
      throw error;
    }
  },

  async getUserRoles(): Promise<StoredUserRole[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user roles:', error);
      return null;
    }
  },

  // User data management
  async setUserData(userData: StoredUserData): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  async getUserData(): Promise<StoredUserData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // NIF management
  async setRememberedNif(nif: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBERED_NIF, nif);
    } catch (error) {
      throw error;
    }
  },

  async getRememberedNif(): Promise<string | null> {
    try {
     
      const nif = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBERED_NIF);
      return nif;
    } catch (error) {
      console.error('Error getting remembered NIF:', error);
      return null;
    }
  },

  async clearRememberedNif(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_NIF);
    } catch (error) {
      console.error('Error clearing remembered NIF:', error);
      throw error;
    }
  },

  // Funciones para manejar contraseña y código recordados
  async setRememberedPassword(password: string): Promise<void> {
    try {
     
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBERED_PASSWORD, password);
     
    } catch (error) {
      console.error('Error saving remembered password:', error);
      throw error;
    }
  },

  async getRememberedPassword(): Promise<string | null> {
    try {
      const password = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
      return password;
    } catch (error) {
      console.error('Error getting remembered password:', error);
      return null;
    }
  },

  async setRememberedCode(code: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REMEMBERED_CODE, code);
    } catch (error) {
      console.error('Error saving remembered code:', error);
      throw error;
    }
  },

  async getRememberedCode(): Promise<string | null> {
    try {
    const code = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBERED_CODE);
      return code;
    } catch (error) {
      console.error('Error getting remembered code:', error);
      return null;
    }
  },

  async clearRememberedCredentials(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD),
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_CODE),
      ]);
    } catch (error) {
      console.error('Error clearing remembered credentials:', error);
      throw error;
    }
  },

  // Clear all auth data
  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.BUILDING_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLES),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        // NO borrar REMEMBERED_NIF - debe persistir entre sesiones
        // NO borrar credenciales recordadas - necesarias para Face ID
        // AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD),
        // AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_CODE),
        AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_TYPE),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },

  // Limpiar completamente todos los datos (incluyendo NIF recordado y credenciales)
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.BUILDING_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLES),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_NIF),
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD),
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_CODE),
        AsyncStorage.removeItem(STORAGE_KEYS.LOGIN_TYPE),
        AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      return token !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  },

  // Login type management (building or general)
  async setLoginType(type: 'building' | 'general'): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOGIN_TYPE, type);
    } catch (error) {
      console.error('Error saving login type:', error);
      throw error;
    }
  },

  async getLoginType(): Promise<'building' | 'general' | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LOGIN_TYPE) as 'building' | 'general' | null;
    } catch (error) {
      console.error('Error getting login type:', error);
      return null;
    }
  },

  async isBuildingLogin(): Promise<boolean> {
    try {
      const loginType = await this.getLoginType();
      return loginType === 'building';
    } catch (error) {
      console.error('Error checking login type:', error);
      return false;
    }
  },

  // Funciones para manejar preferencias de Face ID/Touch ID
  async setBiometricEnabled(nif: string, enabled: boolean): Promise<void> {
    try {
      const biometricData = await this.getBiometricEnabled();
      const updatedData = {
        ...biometricData,
        [nif]: enabled,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error setting biometric preference:', error);
    }
  },

  async getBiometricEnabled(): Promise<Record<string, boolean>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting biometric preferences:', error);
      return {};
    }
  },

  async isBiometricEnabled(nif: string): Promise<boolean> {
    try {
      const biometricData = await this.getBiometricEnabled();
      return biometricData[nif] === true;
    } catch (error) {
      console.error('Error checking biometric preference:', error);
      return false;
    }
  },

  async clearBiometricPreference(nif: string): Promise<void> {
    try {
      const biometricData = await this.getBiometricEnabled();
      delete biometricData[nif];
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, JSON.stringify(biometricData));
    } catch (error) {
      console.error('Error clearing biometric preference:', error);
    }
  }
};
