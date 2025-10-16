import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './DocumentCard.styles';
import { DocumentCardProps } from './DocumentCard.types';

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, isSelected = false, onPress }) => {
  const handlePress = () => {
    onPress?.(document.id);
  };

  return (
    <TouchableOpacity style={[styles.container, isSelected && styles.selectedContainer]} onPress={handlePress}>
      <Text style={styles.title}>{document.title}</Text>
      <Text style={styles.type}>Tipo: {document.type}</Text>
      <Text style={[
        styles.validUntil,
        document.isExpired && styles.validUntilExpired
      ]}>
        Válido hasta: {document.validUntil}
      </Text>
      
      {document.isIncludedInBook && (
        <View style={styles.includedInBook}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.includedInBookText}>Incluido en Libro</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
