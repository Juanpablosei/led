export interface NewDocumentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (documentData: NewDocumentData) => void;
}

export interface NewDocumentData {
  name: string;
  type: string;
  file: string;
  validUntil: string;
  includeInBook: boolean;
}