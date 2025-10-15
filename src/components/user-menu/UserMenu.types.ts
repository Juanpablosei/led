export type UserMenuOption = 'myData' | 'alerts' | 'logout';

export interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
  onOptionPress: (option: UserMenuOption) => void;
  position?: { top: number; right: number };
}

