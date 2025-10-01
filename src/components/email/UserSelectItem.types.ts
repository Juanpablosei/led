export interface UserSelectData {
  id: string;
  name: string;
  surname: string;
  isSelected: boolean;
}

export interface UserSelectItemProps {
  user: UserSelectData;
  onToggle: (userId: string) => void;
}
