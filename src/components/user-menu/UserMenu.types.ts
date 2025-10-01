export type UserMenuOption = 'myData' | 'userType' | 'alerts' | 'changePassword';

export interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
  onOptionPress: (option: UserMenuOption) => void;
  position?: { top: number; right: number };
}

