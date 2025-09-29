import React, { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './CreateAccountModal.styles';
import { CreateAccountModalProps } from './CreateAccountModal.types';

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  visible,
  onClose,
  onContinue,
  onExit,
}) => {
  const { t } = useTranslation();
  const [nifNie, setNifNie] = useState('');

  const handleContinue = () => {
    if (nifNie.trim()) {
      onContinue(nifNie.trim());
      setNifNie('');
    }
  };

  const handleExit = () => {
    setNifNie('');
    onExit();
  };

  const handleClose = () => {
    setNifNie('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('createAccountTitle', 'auth')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.modalContent}>
            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              <View style={styles.stepContainer}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepCircleInactive}>
                  <Text style={styles.stepNumberInactive}>2</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepCircleInactive}>
                  <Text style={styles.stepNumberInactive}>3</Text>
                </View>
              </View>
            </View>

            {/* Step Instruction */}
            <Text style={styles.stepInstruction}>{t('stepIndicator', 'auth')}</Text>

            {/* NIF/NIE Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={nifNie}
                onChangeText={setNifNie}
                placeholder={t('nifNiePlaceholder', 'auth')}
                placeholderTextColor="#999"
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {/* Cateb Member Info */}
            <Text style={styles.infoText}>
              {t('catebMemberInfo', 'auth')}
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.exitButton}
                onPress={handleExit}
              >
                <Text style={styles.exitButtonText}>
                  {t('exitButton', 'auth')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.continueButton,
                  !nifNie.trim() && styles.continueButtonDisabled
                ]}
                onPress={handleContinue}
                disabled={!nifNie.trim()}
              >
                <Text style={styles.continueButtonText}>
                  {t('continueButton', 'auth')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
