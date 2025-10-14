export interface NewDocumentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (documentData: NewDocumentData) => void;
  category?: string;
  onOpenTypesModal?: () => void;
  documentTypes?: any[];
  isLoadingTypes?: boolean;
  selectedTypeName?: string;
  onSelectType?: (typeId: string, typeName: string) => void;
}

export interface NewDocumentData {
  name: string;
  type: string;
  file: string;
  validUntil: string;
  includeInBook: boolean;
  fileData?: any;
}