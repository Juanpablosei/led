export interface LoginFormData {
  nif: string;
  password: string;
  rememberNif: boolean;
}

export interface TabData {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

export interface LoginCardProps {
  onLogin: (data: LoginFormData) => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}
