export interface ResetCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onResetCode: (edificioId: number) => void;
}
