import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  NOTIFICATION_TOKEN: 'notification_token',
  BUILDING_DATA: 'building_data',
  USER_ROLES: 'user_roles',
  USER_DATA: 'user_data',
  REMEMBERED_NIF: 'remembered_nif',
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
      console.error('Error saving remembered NIF:', error);
      throw error;
    }
  },

  async getRememberedNif(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REMEMBERED_NIF);
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

  // Clear all auth data
  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.NOTIFICATION_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.BUILDING_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_ROLES),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.REMEMBERED_NIF),
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
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
  }
};
