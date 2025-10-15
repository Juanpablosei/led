export interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onItemPress?: (itemId: string) => void;
  currentRoute?: string;
  buildingData?: any; // Datos del edificio para validar permisos
}

export interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  isExpanded?: boolean;
  children?: SidebarItem[];
}
