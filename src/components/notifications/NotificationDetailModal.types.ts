export interface NotificationDetailData {
  id: string;
  subject: string;
  dateSent?: string | null;
  sender?: string | null;
  message: string;
}

export interface NotificationDetailModalProps {
  visible: boolean;
  notification: NotificationDetailData | null;
  onClose: () => void;
  onMarkAsRead?: () => void;
  showMarkAsReadButton?: boolean;
}

