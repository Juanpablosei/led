export interface DocumentData {
  id: string;
  title: string;
  type: string;
  validUntil: string;
  isExpired: boolean;
  isIncludedInBook: boolean;
  ruta?: string;
}

export interface DocumentCardProps {
  document: DocumentData;
  onPress?: (documentId: string) => void;
}
