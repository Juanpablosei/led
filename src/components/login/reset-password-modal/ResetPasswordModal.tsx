import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { styles } from './ResetPasswordModal.styles';
import { ResetPasswordModalProps } from './ResetPasswordModal.types';

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  visible,
  activeTab,
  onClose,
  onResetPassword,
  onCatebLinkPress,
}) => {
  const { t } = useTranslation();
  const [nif, setNif] = useState('');

  const handleResetPassword = () => {
    if (nif.trim()) {
      onResetPassword(nif.trim());
      setNif('');
    }
  };

  const handleClose = () => {
    setNif('');
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
            <Text style={styles.modalTitle}>
              {activeTab === 'building' 
                ? t('resetAccessCodeTitle', 'auth') 
                : t('resetPasswordTitle', 'auth')
              }
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.modalContent}>
            <Text style={styles.descriptionText}>
              {activeTab === 'building' 
                ? t('resetAccessCodeDescription', 'auth') 
                : t('resetPasswordDescription', 'auth')
              }
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('nifLabel', 'auth')}</Text>
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

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.resetButtonText}>
                {activeTab === 'building' 
                  ? t('resetAccessCodeButton', 'auth') 
                  : t('resetPasswordButton', 'auth')
                }
              </Text>
            </TouchableOpacity>

            <Text style={styles.catebText}>
              {t('catebMemberText', 'auth')}{' '}
              <Text 
                style={styles.linkText}
                onPress={onCatebLinkPress}
              >
                {t('followingLink', 'auth')}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
