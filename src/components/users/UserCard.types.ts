export interface UserData {
  id: string;
  name: string;
  surname: string;
  profiles: string[];
  isVerified: boolean;
  avatar?: string;
}

export interface UserCardProps {
  user: UserData;
  onPress?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}
