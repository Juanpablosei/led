import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './DocumentCard.styles';
import { DocumentCardProps } from './DocumentCard.types';

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onPress }) => {
  const { t } = useTranslation();
  
  const handlePress = () => {
    onPress?.(document.id);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.type}>{t('type', 'documents')}: {document.type}</Text>
      <Text style={[
        styles.validUntil,
        document.isExpired && styles.validUntilExpired
      ]}>
        {t('validUntil', 'documents')}: {document.validUntil}
      </Text>
      
      {document.isIncludedInBook && (
        <View style={styles.includedInBook}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.includedInBookText}>{t('includedInBook', 'documents')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
