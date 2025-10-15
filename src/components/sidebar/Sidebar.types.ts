export interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onItemPress?: (itemId: string) => void;
  currentRoute?: string;
}

export interface SidebarItem {
  id: string;
  title: string;
  icon: string;
  isExpanded?: boolean;
  children?: SidebarItem[];
}
