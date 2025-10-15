import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './BiometricSetupModal.styles';

interface BiometricSetupModalProps {
  visible: boolean;
  biometricType: string; // 'Face ID' o 'Touch ID'
  onAccept: () => void;
  onReject: () => void;
}

export const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({
  visible,
  biometricType,
  onAccept,
  onReject,
}) => {
  const getBiometricIcon = () => {
    if (biometricType.toLowerCase().includes('face')) {
      return 'scan-outline';
    } else if (biometricType.toLowerCase().includes('touch')) {
      return 'finger-print-outline';
    }
    return 'shield-checkmark-outline';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onReject}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getBiometricIcon() as any}
              size={48}
              color="#E95460"
            />
          </View>
          
          <Text style={styles.title}>
            ¿Quieres usar datos biométricos?
          </Text>
          
          <Text style={styles.description}>
            Puedes usar {biometricType} para iniciar sesión de forma rápida y segura en futuros accesos. 
            No necesitarás escribir tu contraseña.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={onReject}
            >
              <Text style={styles.rejectButtonText}>Ahora no</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={onAccept}
            >
              <Text style={styles.acceptButtonText}>Sí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
