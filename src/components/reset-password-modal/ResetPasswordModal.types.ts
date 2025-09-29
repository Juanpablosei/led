export interface ResetPasswordModalProps {
  visible: boolean;
  activeTab: string;
  onClose: () => void;
  onResetPassword: (nif: string) => void;
  onCatebLinkPress: () => void;
}
