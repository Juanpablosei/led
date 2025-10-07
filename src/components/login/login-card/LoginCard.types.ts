export interface LoginFormData {
  nif: string;
  password: string;
  code: string;
  rememberNif: boolean;
}

export interface TabData {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

export interface LoginCardProps {
  onLogin: (data: LoginFormData, activeTab: string) => void;
  onRegister: () => void;
  onForgotPassword: (activeTab: string) => void;
  isLoading?: boolean;
  rememberedNif?: string | null;
}
