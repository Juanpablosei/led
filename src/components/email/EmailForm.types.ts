export interface EmailFormData {
  subject: string;
  attachments: string[];
  message: string;
}

export interface EmailFormProps {
  onSubmit: (data: EmailFormData) => void;
}
