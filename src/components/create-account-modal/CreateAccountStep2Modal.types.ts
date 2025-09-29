export interface CreateAccountStep2ModalProps {
  visible: boolean;
  nifNie: string;
  onClose: () => void;
  onBack: () => void;
  onFinish: (data: CreateAccountData) => void;
}

export interface CreateAccountData {
  nifNie: string;
  firstName: string;
  lastName: string;
  nif: string;
  userType: 'propertyOwner' | 'professional';
  profession: string;
  agreement: string;
}
