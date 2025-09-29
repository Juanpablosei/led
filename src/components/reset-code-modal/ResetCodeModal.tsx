import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './ResetCodeModal.styles';
import { ResetCodeModalProps } from './ResetCodeModal.types';

export const ResetCodeModal: React.FC<ResetCodeModalProps> = ({
  visible,
  onClose,
  onResetCode,
}) => {
  const { t } = useTranslation();
  const [nif, setNif] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');

  const handleResetCode = () => {
    if (nif.trim() && buildingNumber.trim()) {
      onResetCode(nif.trim(), buildingNumber.trim());
      setNif('');
      setBuildingNumber('');
    }
  };

  const handleClose = () => {
    setNif('');
    setBuildingNumber('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('resetCodeTitle', 'auth')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.modalContent}>
            <Text style={styles.descriptionText}>
              {t('resetCodeDescription', 'auth')}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('nifLabel', 'auth')} *</Text>
              <TextInput
                style={styles.textInput}
                value={nif}
                onChangeText={setNif}
                placeholder={t('nifPlaceholder', 'auth')}
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('buildingNumber', 'auth')} *</Text>
              <View style={styles.selectContainer}>
                <TextInput
                  style={styles.selectInput}
                  value={buildingNumber}
                  onChangeText={setBuildingNumber}
                  placeholder={t('buildingNumberPlaceholder', 'auth')}
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Text style={styles.dropdownIcon}>⌄</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleResetCode}
            >
              <Text style={styles.resetButtonText}>
                {t('resetCodeButton', 'auth')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
