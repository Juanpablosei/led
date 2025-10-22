export interface TermsAndConditionsModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}