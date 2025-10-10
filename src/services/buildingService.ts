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
  perfil_llibre: Array<{
    id: number;
    name: string;
  }>;
  identificacion: Array<{
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
  }>;
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
  }
};

