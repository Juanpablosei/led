export interface CreateAccountUnifiedModalProps {
  visible: boolean;
  currentStep: number;
  onClose: () => void;
  onStepChange: (step: number) => void;
  onFinish: (data: CreateAccountCompleteData) => void;
}

export interface CreateAccountCompleteData {
  nifNie: string;
  firstName: string;
  lastName: string;
  nif: string;
  userType: 'propertyOwner' | 'professional';
  profession: string;
  agreement: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptDataProtection: boolean;
}
