export interface EmailAttachment {
  base64: string;
  nombre: string;
  type?: string;
}

export interface EmailFormData {
  subject: string;
  attachments: EmailAttachment[];
  message: string;
}

export interface EmailFormProps {
  onSubmit: (data: EmailFormData) => void;
}
