export interface CreateAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue: (nifNie: string) => void;
  onExit: () => void;
}
