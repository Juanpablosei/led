export interface EditDocumentData {
  id: string;
  name: string;
  type: string;
  file: string;
  validUntil: string;
  includeInBook: boolean;
  tipusDocument?: string;
  ruta?: string;
}

export interface EditDocumentModalProps {
  isVisible: boolean;
  document: EditDocumentData | null;
  onClose: () => void;
  onSave: (documentData: EditDocumentData) => void;
  onDelete: (documentId: string) => void;
  isReadOnly?: boolean; // Para modo solo lectura
  documentTypes?: any[]; // Tipos de documento del servidor
  isLoadingTypes?: boolean; // Estado de carga de tipos
}
