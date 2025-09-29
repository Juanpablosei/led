export interface ResetCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onResetCode: (nif: string, buildingNumber: string) => void;
}
