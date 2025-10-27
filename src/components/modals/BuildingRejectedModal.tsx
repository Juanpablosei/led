import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './BuildingRejectedModal.styles';
import { BuildingRejectedModalProps } from './BuildingRejectedModal.types';

const BuildingRejectedModal: React.FC<BuildingRejectedModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Ionicons 
              name="close-circle" 
              size={48} 
              color="#dc3545" 
              style={styles.errorIcon} 
            />
            <Text style={styles.modalTitle}>{t('accessDenied', 'common')}</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.errorMessage}>
              {t('buildingRejectedMessage', 'common')}
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{t('understood', 'common')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BuildingRejectedModal;
