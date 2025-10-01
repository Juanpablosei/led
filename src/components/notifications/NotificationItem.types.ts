export interface NotificationData {
  id: string;
  title: string;
  date: string;
  isRead?: boolean;
}

export interface NotificationItemProps {
  notification: NotificationData;
  onPress?: (id: string) => void;
}

