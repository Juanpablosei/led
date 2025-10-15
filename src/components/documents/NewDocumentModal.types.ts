export interface NewDocumentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (documentData: NewDocumentData) => void;
  category?: string;
  documentTypes?: any[];
  isLoadingTypes?: boolean;
  selectedTypeName?: string;
  selectedTypeId?: string;
}

export interface NewDocumentData {
  name: string;
  type: string;
  file: string;
  validUntil: string;
  includeInBook: boolean;
  fileData?: any;
}