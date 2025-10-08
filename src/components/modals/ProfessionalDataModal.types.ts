export interface ProfessionalDataModalProps {
  visible: boolean;
  onClose: () => void;
  onFinish: (data: ProfessionalDataFormData) => void;
  initialData?: Partial<ProfessionalDataFormData>;
}

export interface ProfessionalDataFormData {
  nombre: string;
  userType: 'propietario' | 'profesional';
  profession: string;
  autonomousCommunity: string;
  collegiateNumber: string;
  professionalCollege: string;
  acceptRegistrationConditions: boolean;
  acceptDataProtection: boolean;
}

export interface UserTypeOption {
  value: 'propietario' | 'profesional';
  label: string;
}

export interface ProfessionOption {
  value: string;
  label: string;
}

export interface AutonomousCommunityOption {
  value: string;
  label: string;
}

export interface ProfessionalCollegeOption {
  value: string;
  label: string;
}
