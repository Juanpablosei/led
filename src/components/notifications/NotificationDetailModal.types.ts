export interface NotificationDetailData {
  id: string;
  subject: string;
  dateSent?: string | null;
  sender?: string | null;
  message: string;
  edifici_id?: number | null;
  edifici_nom?: string | null;
  adjuntos?: {
    id: number;
    comunicacio_id: number;
    comunicacio_destinatari_id: number | null;
    ruta_adjunt: string;
    nombre_adjunt: string;
  }[];
}

export interface NotificationDetailModalProps {
  visible: boolean;
  notification: NotificationDetailData | null;
  onClose: () => void;
  onMarkAsRead?: () => void;
  showMarkAsReadButton?: boolean;
}

