import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './BuildingRejectedModal.styles';
import { BuildingRejectedModalProps } from './BuildingRejectedModal.types';

const BuildingRejectedModal: React.FC<BuildingRejectedModalProps> = ({
  visible,
  onClose,
}) => {
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
            <Text style={styles.modalTitle}>Acceso denegado</Text>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.errorMessage}>
              Ha rechazado el acceso al edificio
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BuildingRejectedModal;
