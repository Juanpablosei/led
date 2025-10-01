export interface NotificationDetailData {
  id: string;
  subject: string;
  dateSent: string;
  sender: string;
  message: string;
}

export interface NotificationDetailModalProps {
  visible: boolean;
  notification: NotificationDetailData | null;
  onClose: () => void;
}

