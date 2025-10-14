import { httpClient } from './httpClient';

export interface Building {
  id: number;
  nom: string;
  tipus_edifici_id: number;
  ref_cadastral: string;
  versio_estesa: boolean;
  created_at: string;
  fecha_contratacion_led_redaccion: string | null;
  fecha_contratacion_led_gestion: string;
  fecha_limite_uso: string | null;
  user_id: number;
  deleted_at: string | null;
  comunitat_autonoma: string | null;
  revisado: string;
  alias_tarifa_aplicada: string | null;
  tiempo_inicio_actividad: string | null;
  tiempo_caducidad_documentos: string | null;
  estado_convenio: string | null;
  fecha_validacion_convenio: string | null;
  fecha_limite_uso_led_redaccion: string | null;
  fecha_limite_uso_led_redaccion_modified_by_user_id: number | null;
  estado: string;
  propietario: boolean;
  sincronizado: boolean;
  es_catastro: boolean;
  fecha_contratacion: string;
  tipus_edifici: string;
  perfil_llibre: {
    id: number;
    name: string;
  }[];
  identificacion: {
    id: number;
    tipus_via: string;
    via: string;
    numero: string;
    bloc: string;
    escala: string | null;
    codi_postal: string;
    poblacio: string;
    provincia: string;
    any_inici_construccio: number;
    any_fi_construccio: number | null;
    origen_any_construccio: string;
    observacions: string | null;
    created_at: string;
    updated_at: string;
    ref_cadastral: string;
    direccion: string;
  }[];
  propiedad: any[];
  imagen: string | null;
  planos: any[];
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface BuildingsData {
  current_page: number;
  data: Building[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface BuildingsResponse {
  status: boolean;
  message: string;
  data: BuildingsData;
}

export interface BuildingsError {
  status: false;
  message: string;
  code: number;
}

export type BuildingsApiResponse = BuildingsResponse | BuildingsError;

export interface BuildingDetailData extends Building {
  tipus_producte: {
    id: number;
    producte: string;
  };
  usuario: {
    id: number;
    first_name: string;
    last_name: string;
    nif: string;
    collegi_professional: string | null;
  };
  inmuebles: {
    id: number;
    edifici_id: number;
    ref_cadastral: string;
    localitzacio: string;
    us: string;
    superficie: string;
    any_construccio: number;
    coeficient: string;
    created_at: string;
    updated_at: string;
    no_existeix_cadastre: boolean;
    habitatge_actiu: boolean;
    es_manual: string | null;
  }[];
  data_anulacio: string | null;
  data_confirmacio: string | null;
  usuario_estado_edificio: boolean;
}

export interface BuildingDetailResponse {
  status: boolean;
  message: string;
  data: BuildingDetailData;
}

export interface BuildingDetailError {
  status: false;
  message: string;
  code: number;
}

export type BuildingDetailApiResponse = BuildingDetailResponse | BuildingDetailError;

// Interfaces para notificaciones
export interface NotificationComunicacion {
  id: number;
  assumpte: string;
  leido: string | null;
  edifici_id: number | null;
  edifici_nom: string | null;
}

export interface NotificationDocumento {
  id: number;
  edifici_nom: string;
  edifici_id: number;
  tipus_document: string;
  nom: string;
  hash_arxiu: string;
  data_validesa: string;
  ocultar_notificacion: boolean;
  texto: string;
  ruta: string;
  tipus: string;
}

export interface NotificationActividad {
  id: number;
  titol: string;
  edifici_id: number;
  edifici_nom: string;
  data_inici_calculada: string;
  durada_mesos: number;
  tipus_intervencio: string;
  descripcio: string;
  sistema_id: number;
  projecte_id: number;
  projecte_nom: string;
  projecte_estat: string;
}

export interface NotificationsData {
  documentos_edificio_caducados: {
    cantidad: number;
    documentos: { [edificioId: string]: NotificationDocumento[] } | NotificationDocumento[];
  };
  documentos_inmueble_caducados: {
    cantidad: number;
    documentos: { [edificioId: string]: NotificationDocumento[] } | NotificationDocumento[];
  };
  comunicaciones_no_leidas: {
    cantidad: number;
    comunicaciones: NotificationComunicacion[];
  };
  actividades_proximas: {
    cantidad: number;
    actividades: { [edificioId: string]: NotificationActividad[] };
  };
}

export interface NotificationsResponse {
  status: boolean;
  message: string;
  data: NotificationsData;
}

export interface NotificationsError {
  status: false;
  message: string;
  code: number;
}

export type NotificationsApiResponse = NotificationsResponse | NotificationsError;

// Interfaces para usuarios del edificio
export interface BuildingUser {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  nif: string;
  email: string;
  telefon?: string;
  roles?: string[];
  verificado?: boolean;
}

export interface BuildingUsersData {
  current_page: number;
  data: BuildingUser[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface BuildingUsersResponse {
  status: boolean;
  message: string;
  data: BuildingUsersData;
}

export interface BuildingUsersError {
  status: false;
  message: string;
  code: number;
}

export type BuildingUsersApiResponse = BuildingUsersResponse | BuildingUsersError;

// Interfaces para envío de email
export interface EmailAttachment {
  base64: string;
  nombre: string;
}

export interface SendEmailRequest {
  assumpte: string;
  message: string;
  plantilles_email_id: number;
  edifici_id: string;
  lista_ids: string[];
  adjuntos: EmailAttachment[];
}

export interface SendEmailResponse {
  status: boolean;
  message: string;
}

export interface SendEmailError {
  status: false;
  message: string;
  code: number;
}

export type SendEmailApiResponse = SendEmailResponse | SendEmailError;

// Interfaces para detalle de comunicación
export interface ComunicacionDetailData {
  id: number;
  assumpte: string;
  cos: string;
  data_enviament: string;
  emisor: string;
  edifici_id?: number | null;
  edifici_nom?: string | null;
  leido: string | null;
}

export interface ComunicacionDetailResponse {
  status: boolean;
  message: string;
  data: ComunicacionDetailData;
}

export interface ComunicacionDetailError {
  status: false;
  message: string;
  code: number;
}

export type ComunicacionDetailApiResponse = ComunicacionDetailResponse | ComunicacionDetailError;

// Interfaces para marcar comunicación como leída
export interface MarkAsReadResponse {
  status: boolean;
  message: string;
}

export interface MarkAsReadError {
  status: false;
  message: string;
  code: number;
}

export type MarkAsReadApiResponse = MarkAsReadResponse | MarkAsReadError;

// Interfaces para listado de comunicaciones
export interface CommunicationDestinee {
  id: number;
  comunicacio_id: number;
  destinatari_id: number;
  destinatari_email: string;
  assumpte: string;
  message: string;
  estat: string;
  error: string | null;
  data_enviada: string;
  leido: boolean | null;
}

export interface CommunicationAttachment {
  id: number;
  comunicacio_id: number;
  comunicacio_destinatari_id: number | null;
  ruta_adjunt: string;
  nombre_adjunt: string;
}

export interface Communication {
  id: number;
  assumpte: string;
  message: string;
  tipus: string | null;
  descripcio: string | null;
  total_comunicacions: number;
  total_enviades: number;
  total_no_enviades: number;
  plantilles_email_id: number;
  remitent_id: number;
  creat_per_id: number;
  modul_relacionat_id: number | null;
  modulo_relacionat: string | null;
  data_inici: string;
  data_fin: string;
  data_enviada: string;
  remitent_nom: string;
  remitent_email: string;
  edifici_id: number;
  timestamp_en_proceso: string | null;
  first_name: string;
  last_name: string;
  destinatarios: CommunicationDestinee[];
  adjuntos: CommunicationAttachment[];
}

export interface CommunicationsData {
  current_page: number;
  data: Communication[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CommunicationsResponse {
  status: boolean;
  data: CommunicationsData;
}

export interface CommunicationsError {
  status: false;
  message: string;
  code: number;
}

export type CommunicationsApiResponse = CommunicationsResponse | CommunicationsError;

export const buildingService = {
  async getBuildings(page: number = 1, searchText: string = ''): Promise<BuildingsApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      let url = `/edificio?page=${page}`;
      
      // Agregar parámetro de búsqueda si existe
      if (searchText.trim()) {
        url += `&magic=${encodeURIComponent(searchText.trim())}`;
      }
      
      const response = await httpClient.get(url);
      
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

  async getBuildingById(id: number): Promise<BuildingDetailApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 GET /edificio/${id}`);
      const response = await httpClient.get(`/edificio/${id}`);
      
      console.log('📦 Respuesta recibida para edificio:', id);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error en GET /edificio/${id}:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async getNotifications(limit: number = 5, full: boolean = true): Promise<NotificationsApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 GET /edificio/notificaciones/listar?limit=${limit}&full=${full}`);
      const response = await httpClient.get(`/edificio/notificaciones/listar?limit=${limit}&full=${full}`);
      
      console.log('📦 Notificaciones recibidas');
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al obtener notificaciones:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async getComunicacionDetail(id: number): Promise<ComunicacionDetailApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 GET /comunicaciones/my_comunicacion/${id}`);
      const response = await httpClient.get(`/comunicaciones/my_comunicacion/${id}`);
      
      console.log('📦 Detalle de comunicación recibido');
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al obtener detalle de comunicación:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async markComunicacionAsRead(id: number, leido: boolean = true): Promise<MarkAsReadApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 PATCH /comunicaciones/mensaje_leido?id=${id}&leido=${leido}`);
      const response = await httpClient.patch(`/comunicaciones/mensaje_leido?id=${id}&leido=${leido}`);
      
      console.log('✅ Comunicación marcada como leída');
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al marcar comunicación como leída:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async hideActivityNotification(id: number): Promise<any> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 PATCH /edificio_proyectos/intervenciones/${id}/ocultar_notificacion`);
      const response = await httpClient.patch(`/edificio_proyectos/intervenciones/${id}/ocultar_notificacion`);
      
      console.log('✅ Notificación de actividad ocultada');
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al ocultar notificación de actividad:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async hideDocumentNotification(id: number, type: 'building' | 'home' = 'building'): Promise<any> {
    try {
      // Usar endpoint diferente según el tipo
      const endpoint = type === 'building' 
        ? `/edificio_documentos/notificaciones/${id}/ocultar`
        : `/edificio_inmuebles/notificaciones/${id}/ocultar`;
      
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 PATCH ${endpoint}`);
      const response = await httpClient.patch(endpoint);
      
      console.log('✅ Notificación de documento ocultada');
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al ocultar notificación de documento:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async getBuildingUsers(edificiId: number, page: number = 1, limit: number = 15): Promise<BuildingUsersApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 GET /edificio_usuarios?page=${page}&limit=${limit}&edifici_id=${edificiId}`);
      const response = await httpClient.get(`/edificio_usuarios?page=${page}&limit=${limit}&edifici_id=${edificiId}`);
      
      console.log('📦 Usuarios del edificio obtenidos');
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al obtener usuarios del edificio:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async sendBuildingEmail(emailData: SendEmailRequest): Promise<SendEmailApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log('📧 POST /comunicaciones/comunicacion_edificio');
      console.log('Datos del email:', JSON.stringify(emailData, null, 2));
      
      const response = await httpClient.post('/comunicaciones/comunicacion_edificio', emailData);
      
      console.log('✅ Email enviado exitosamente');
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al enviar email:', error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  },

  async getBuildingCommunications(edificiId: number, page: number = 1, limit: number = 15): Promise<CommunicationsApiResponse> {
    try {
      // El interceptor agrega automáticamente el token y el idioma
      console.log(`🌐 GET /comunicaciones/comunicaciones_edificios/${edificiId}?page=${page}&limit=${limit}`);
      const response = await httpClient.get(`/comunicaciones/comunicaciones_edificios/${edificiId}?page=${page}&limit=${limit}`);
      
      console.log('📦 Comunicaciones del edificio obtenidas');
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al obtener comunicaciones del edificio:`, error.response?.status || error.message);
      // Si axios devuelve un error con respuesta, devolver esa data
      if (error.response?.data) {
        return error.response.data;
      }
      // Error de red o sin respuesta del servidor
      throw error;
    }
  }
};

