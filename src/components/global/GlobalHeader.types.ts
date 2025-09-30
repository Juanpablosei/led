export interface GlobalHeaderProps {
  variant: 'logo' | 'navigation';
  title?: string;
  onBackPress?: () => void;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}
