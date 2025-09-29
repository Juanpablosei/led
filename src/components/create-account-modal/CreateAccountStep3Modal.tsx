import React, { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './CreateAccountStep3Modal.styles';
import { CreateAccountStep3ModalProps } from './CreateAccountStep3Modal.types';

export const CreateAccountStep3Modal: React.FC<CreateAccountStep3ModalProps> = ({
  visible,
  onClose,
  onBack,
  onFinish,
  userData,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptDataProtection: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFinish = () => {
    if (formData.email.trim() && formData.password.trim() && formData.confirmPassword.trim() && formData.acceptTerms && formData.acceptDataProtection) {
      onFinish({
        ...userData,
        ...formData,
      });
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        acceptDataProtection: false,
      });
    }
  };

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptDataProtection: false,
    });
    onClose();
  };

  const isFormValid = formData.email.trim() && formData.password.trim() && formData.confirmPassword.trim() && formData.acceptTerms && formData.acceptDataProtection;

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
                <Text style={styles.modalTitle}>{t('step3Title', 'auth')}</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.modalContent}>
                {/* Step Indicator */}
                <View style={styles.stepIndicator}>
                  <View style={styles.stepContainer}>
                    <View style={styles.stepCircleInactive}>
                      <Text style={styles.stepNumberInactive}>1</Text>
                    </View>
                    <View style={styles.stepLine} />
                    <View style={styles.stepCircleInactive}>
                      <Text style={styles.stepNumberInactive}>2</Text>
                    </View>
                    <View style={styles.stepLine} />
                    <View style={styles.stepCircle}>
                      <Text style={styles.stepNumber}>3</Text>
                    </View>
                  </View>
                </View>

                {/* Step Instruction */}
                <Text style={styles.stepInstruction}>{t('step3Title', 'auth')}</Text>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('email', 'auth')}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      placeholder={t('emailPlaceholder', 'auth')}
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  {/* Contraseña */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('password', 'auth')}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      placeholder={t('passwordPlaceholder', 'auth')}
                      placeholderTextColor="#999"
                      secureTextEntry={true}
                      autoCorrect={false}
                    />
                  </View>

                  {/* Confirmación de contraseña */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('confirmPassword', 'auth')}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      placeholder={t('confirmPasswordPlaceholder', 'auth')}
                      placeholderTextColor="#999"
                      secureTextEntry={true}
                      autoCorrect={false}
                    />
                  </View>

                  {/* Checkboxes */}
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity 
                      style={styles.checkboxRow}
                      onPress={() => handleInputChange('acceptTerms', !formData.acceptTerms)}
                    >
                      <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
                        {formData.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={styles.checkboxText}>
                        {t('contractConditionsText', 'auth')}{' '}
                        <Text style={styles.redText}>{t('contractConditions', 'auth')}</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity 
                      style={styles.checkboxRow}
                      onPress={() => handleInputChange('acceptDataProtection', !formData.acceptDataProtection)}
                    >
                      <View style={[styles.checkbox, formData.acceptDataProtection && styles.checkboxChecked]}>
                        {formData.acceptDataProtection && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={styles.checkboxText}>
                        {t('dataProtectionText', 'auth')}{' '}
                        <Text style={styles.redText}>{t('dataProtection', 'auth')}</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleBack}
                  >
                    <Text style={styles.backButtonText}>
                      REGRESAR
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[
                      styles.finishButton,
                      !isFormValid && styles.finishButtonDisabled
                    ]}
                    onPress={handleFinish}
                    disabled={!isFormValid}
                  >
                    <Text style={styles.finishButtonText}>
                      FINALIZAR
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
