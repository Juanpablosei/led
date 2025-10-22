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

export interface PublicParametersRequest {
  parametroPadre: string;
}

export interface PublicParametersResponse {
  profesion?: {
    [key: string]: string;
  };
  entidadconvenio?: {
    [key: string]: string;
  };
  comunidadautonoma?: {
    [key: string]: string;
  };
}

export interface RegisterRequest {
  email: string;
  nif: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  comunitat_autonoma: string;
  professio: number;
  otra_profesion?: string;
  colegiado_externo_num_colegiado?: string;
  collegi_professional?: string;
  entitat_conveni_id?: string;
  politica_privacitat_acceptada_en: boolean;
  tipo_usuario: 'propietario' | 'profesional';
}

export interface RegisterResponse {
  status: boolean;
  message: string;
  code: number;
  token?: string;
}

export interface RegisterError {
  status: false;
  message: string;
  code: number;
  errors?: {
    [key: string]: string[];
  };
}

export interface ComunidadAutonomaResponse {
  [key: string]: string | { nombre: string; [key: string]: any };
}

export interface ColegioProfesionalResponse {
  [key: string]: string;
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
export type PublicParametersApiResponse = PublicParametersResponse;
export type RegisterApiResponse = RegisterResponse | RegisterError;
export type ComunidadAutonomaApiResponse = ComunidadAutonomaResponse;
export type ColegioProfesionalApiResponse = ColegioProfesionalResponse;

// Interfaces para obtener datos del usuario
export interface MyDataUserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  nif: string;
  telefon?: string;
  tipo_usuario: 'propietario' | 'profesional';
  professio?: number;
  otra_profesion?: string;
  colegiado_externo_num_colegiado?: string;
  collegi_professional?: string;
  comunitat_autonoma?: string;
  entitat_conveni_id?: number | null;
  role_altres?: string | null;
  locale?: string;
  colegiat?: string | null;
  politica_privacitat_acceptada_en?: string;
  colegiado_externo?: boolean;
  dades_professionals?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface MyDataResponse {
  status: boolean;
  data: MyDataUserResponse;
  message?: string;
}

export type MyDataApiResponse = MyDataResponse;

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

// Interfaces para registro de dispositivo
export interface RegisterDeviceRequest {
  device_id: string;
  expoPushToken: string;
}

export interface RegisterDeviceResponse {
  status: boolean;
  message: string;
}

export interface RegisterDeviceError {
  status: false;
  message: string;
  code: number;
}

export type RegisterDeviceApiResponse = RegisterDeviceResponse | RegisterDeviceError;

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

  async getPublicParameters(parameters: PublicParametersRequest[]): Promise<PublicParametersApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.post('/maestros/parametros-publicos', parameters);
      
      // Devolver la respuesta
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener parámetros públicos:', error);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async register(credentials: RegisterRequest): Promise<RegisterApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.post('/auth/register', credentials);
      
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

  async getComunidadesAutonomas(tipo: number): Promise<ComunidadAutonomaApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.get(`/maestros/colegio-profesionales-publicos/comunidades-autonomas?tipo=${tipo}`);
      
      // Devolver la respuesta
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener comunidades autónomas:', error);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async getColegiosProfesionales(comunitat: string, tipo: number): Promise<ColegioProfesionalApiResponse> {
    try {
      // El interceptor agrega automáticamente el idioma
      const response = await httpClient.get(`/maestros/colegio-profesionales-publicos?comunitat=${comunitat}&tipo=${tipo}`);
      
      // Devolver la respuesta
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener colegios profesionales:', error);
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
      const response = await httpClient.patch(`/edificio_usuarios/comprobacion/aprobar/${edificio_id}`);
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
      const response = await httpClient.patch(`/edificio_usuarios/comprobacion/rechazar/${edificio_id}`);
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

  async getMyData(): Promise<MyDataApiResponse> {
    try {
      const response = await httpClient.get('/mis-datos');
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  async updateMyData(data: {
    professio: string;
    colegiado_externo_num_colegiado: string;
    collegi_professional: string;
    role_altres: string;
    telefon: string;
    email: string;
    comunitat_autonoma: string;
    entidad_convenio: string | null;
    tipo_usuario: 'propietario' | 'profesional';
    otra_profesion?: string;
    password?: string;
    password_confirmation?: string;
  }): Promise<any> {
    try {
      
      const response = await httpClient.patch('/mis-datos', data);
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  async updateProfessionalData(data: {
    professio: string;
    colegiado_externo_num_colegiado: string;
    collegi_professional: string;
    role_altres: string;
    comunitat_autonoma: string;
    tipo_usuario: 'propietario' | 'profesional';
    idioma_preferencia_comunicacion?: string;
    politica_privacitat_acceptada_en?: boolean;
  }): Promise<any> {
    try {
      const response = await httpClient.patch('/auth/actualizar_datos_profesionales?_method=PATCH', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },


  async registerDevice(data: RegisterDeviceRequest): Promise<RegisterDeviceApiResponse> {
    try {      
      const response = await httpClient.post('/register-device', data); 
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
};
