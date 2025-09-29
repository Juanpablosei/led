import { CreateAccountData } from './CreateAccountStep2Modal.types';

export interface CreateAccountStep3ModalProps {
  visible: boolean;
  userData: CreateAccountData;
  onClose: () => void;
  onBack: () => void;
  onFinish: (data: CreateAccountCompleteData) => void;
}

export interface CreateAccountCompleteData extends CreateAccountData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptDataProtection: boolean;
}
