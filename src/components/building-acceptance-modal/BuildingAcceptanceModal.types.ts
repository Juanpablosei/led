export interface BuildingData {
  id: number;
  nom: string;
  ref_cadastral: string;
  created_at: string;
  fecha_contratacion: string;
  estado: string;
}

export interface RoleData {
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

export interface BuildingAcceptanceModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  building?: BuildingData;
  roles?: RoleData[];
}
