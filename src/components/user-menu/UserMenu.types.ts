export type UserMenuOption = 'myData' | 'myBuildings' | 'alerts' | 'logout';

export interface UserMenuProps {
  visible: boolean;
  onClose: () => void;
  onOptionPress: (option: UserMenuOption) => void;
  position?: { top: number; right: number };
}

