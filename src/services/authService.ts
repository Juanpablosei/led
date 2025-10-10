// Servicio de autenticación para ambos tipos de login
import { httpClient } from './httpClient';

export interface BuildingLoginRequest {
  nif: string;
  code: string;
}

export interface GeneralLoginRequest {
  nif: string;
  password: string;
}

export interface ForgotPasswordRequest {
  nif: string;
}

export interface ForgotCodeRequest {
  nif: string;
}

export interface Building {
  id: number;
  nom: string;
  ref_cadastral: string;
}

export interface ForgotCodeResponse {
  success: boolean;
  message: string;
  data: Building[];
  code: number;
}

export interface ForgotCodeError {
  success: false;
  message: string;
  code: number;
}

export interface SendCodeToBuildingResponse {
  success: boolean;
  message: string;
  code: number;
}

export interface SendCodeToBuildingError {
  success: false;
  message: string;
  code: number;
}

export interface CheckNifRequest {
  nif: string;
}

export interface CheckNifResponse {
  success: boolean;
  message: string;
  code: number;
}

export interface BuildingLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  activ?: any;
  edificio?: {
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
  };
  roles?: {
    id: number;
    role_llibre_id: number;
    edifici_usuari_id: number;
    role_idioma: {
      id: number;
      role_llibre_id: number;
      locale: string;
      nom: string;
    };
  }[];
  code: number;
}

export interface BuildingLoginError {
  success: false;
  message: string;
  code: number;
}

export interface BuildingLoginValidationError {
  message: string;
  status: boolean;
  errors: {
    nif?: string[];
    code?: string[];
  };
  code: number;
}

// Interfaces para login general
export interface GeneralLoginResponse {
  status: boolean;
  message: string;
  token?: string;
  channel_code?: string;
  token_user_notification?: string;
  datos_profesionales?: boolean;
  code: number;
}

export interface GeneralLoginError {
  status: false;
  message: string;
  code: number;
}

export interface GeneralLoginValidationError {
  message: string;
  status: boolean;
  errors: {
    nif?: string[];
    password?: string[];
  };
  code: number;
}

// Interfaces para olvidé contraseña
export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
  code: number;
}

export interface ForgotPasswordError {
  status: false;
  message: string;
  code: number;
}

export interface ForgotPasswordValidationError {
  message: string;
  status: boolean;
  errors: {
    nif?: string[];
  };
  code: number;
}

export type BuildingLoginApiResponse = BuildingLoginResponse | BuildingLoginError | BuildingLoginValidationError;
export type GeneralLoginApiResponse = GeneralLoginResponse | GeneralLoginError | GeneralLoginValidationError;
export type ForgotPasswordApiResponse = ForgotPasswordResponse | ForgotPasswordError | ForgotPasswordValidationError;
export type ForgotCodeApiResponse = ForgotCodeResponse | ForgotCodeError;
export type SendCodeToBuildingApiResponse = SendCodeToBuildingResponse | SendCodeToBuildingError;
export type CheckNifApiResponse = CheckNifResponse;

// Interfaces para aprobar/rechazar edificio
export interface BuildingApprovalRequest {
  edificio_id: number;
}

export interface BuildingApprovalResponse {
  success: boolean;
  message: string;
  code: number;
}

export interface BuildingApprovalError {
  success: false;
  message: string;
  code: number;
}

export type BuildingApprovalApiResponse = BuildingApprovalResponse | BuildingApprovalError;

export const authService = {
  async loginBuilding(credentials: BuildingLoginRequest): Promise<BuildingLoginApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.post('/auth/login_usuario_edificio', credentials);
      
      // Siempre devolver la respuesta, incluso si no es exitosa
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async loginGeneral(credentials: GeneralLoginRequest): Promise<GeneralLoginApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.post('/auth/login', credentials);
      
      // Siempre devolver la respuesta, incluso si no es exitosa
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async forgotPassword(credentials: ForgotPasswordRequest): Promise<ForgotPasswordApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.post('/auth/forgo_password', credentials);
      
      // Siempre devolver la respuesta, incluso si no es exitosa
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async forgotCode(credentials: ForgotCodeRequest): Promise<ForgotCodeApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.post('/auth/forgo_code_edificio', credentials);
      
      // Siempre devolver la respuesta
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async sendCodeToBuilding(edificioId: number): Promise<SendCodeToBuildingApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.get(`/auth/send_code_edificio/${edificioId}`);
      
      // Siempre devolver la respuesta
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async checkNif(credentials: CheckNifRequest): Promise<CheckNifApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.post('/auth/comprobar_nif', credentials);
      
      // Siempre devolver la respuesta
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async approveBuilding(edificio_id: number): Promise<BuildingApprovalApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      // Ya no necesitas pasar el token como parámetro
      const response = await httpClient.post(`/edificio_usuarios/comprobacion/aprobar/id:${edificio_id}`);
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async rejectBuilding(edificio_id: number): Promise<BuildingApprovalApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      // Ya no necesitas pasar el token como parámetro
      const response = await httpClient.post(`/edificio_usuarios/comprobacion/rechazar/id:${edificio_id}`);
      return response.data;
    } catch (error: any) {
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  }
};
