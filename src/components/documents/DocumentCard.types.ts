export interface DocumentData {
  id: string;
  title: string;
  type: string;
  validUntil: string;
  isExpired: boolean;
  isIncludedInBook: boolean;
}

export interface DocumentCardProps {
  document: DocumentData;
  isSelected?: boolean;
  onPress?: (documentId: string) => void;
}
