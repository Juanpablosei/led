import React, { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './CreateAccountStep2Modal.styles';
import { CreateAccountStep2ModalProps } from './CreateAccountStep2Modal.types';

export const CreateAccountStep2Modal: React.FC<CreateAccountStep2ModalProps> = ({
  visible,
  onClose,
  onBack,
  onFinish,
  nifNie,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nif: nifNie, // Inicializar con el NIF del paso anterior
    userType: 'propertyOwner', // 'propertyOwner' or 'professional'
    profession: '',
    agreement: '',
  });

  // Opciones mockeadas para los selects
  const professionOptions = [
    'Arquitecto',
    'Ingeniero',
    'Abogado',
    'Contador'
  ];

  const agreementOptions = [
    'Convenio General',
    'Convenio Especial',
    'Convenio Plus',
    'Convenio Premium'
  ];

  const [showProfessionModal, setShowProfessionModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfessionSelect = (profession: string) => {
    handleInputChange('profession', profession);
    setShowProfessionModal(false);
  };

  const handleAgreementSelect = (agreement: string) => {
    handleInputChange('agreement', agreement);
    setShowAgreementModal(false);
  };

  const handleFinish = () => {
    if (formData.firstName.trim() && formData.lastName.trim() && formData.nif.trim()) {
      onFinish({
        nifNie,
        ...formData,
      });
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        nif: nifNie,
        userType: 'propertyOwner',
        profession: '',
        agreement: '',
      });
    }
  };

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      nif: nifNie,
      userType: 'propertyOwner',
      profession: '',
      agreement: '',
    });
    onClose();
  };

  const isFormValid = formData.firstName.trim() && formData.lastName.trim() && formData.nif.trim();

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
            <Text style={styles.modalTitle}>{t('step2Title', 'auth')}</Text>
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
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepLine} />
                <View style={styles.stepCircleInactive}>
                  <Text style={styles.stepNumberInactive}>3</Text>
                </View>
              </View>
            </View>

            {/* Step Instruction */}
            <Text style={styles.stepInstruction}>{t('step2Instruction', 'auth')}</Text>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Nombre y Apellidos */}
              <View style={styles.inputRow}>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>{t('firstName', 'auth')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    placeholder={t('firstNamePlaceholder', 'auth')}
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.inputGroupHalf}>
                  <Text style={styles.inputLabel}>{t('lastName', 'auth')}</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    placeholder={t('lastNamePlaceholder', 'auth')}
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* NIF */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('nif', 'auth')}</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.nif}
                  onChangeText={(value) => handleInputChange('nif', value)}
                  placeholder={t('nifPlaceholder', 'auth')}
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>

              {/* Tipo de usuario */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('userType', 'auth')}</Text>
                <View style={styles.checkboxRow}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => handleInputChange('userType', 'propertyOwner')}
                  >
                    <View style={[styles.checkbox, formData.userType === 'propertyOwner' && styles.checkboxChecked]}>
                      {formData.userType === 'propertyOwner' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.checkboxText}>{t('propertyOwner', 'auth')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => handleInputChange('userType', 'professional')}
                  >
                    <View style={[styles.checkbox, formData.userType === 'professional' && styles.checkboxChecked]}>
                      {formData.userType === 'professional' && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.checkboxText}>{t('professional', 'auth')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Profesión */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('profession', 'auth')}</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => setShowProfessionModal(true)}
                >
                  <Text style={[styles.selectButtonText, formData.profession ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
                    {formData.profession || t('professionPlaceholder', 'auth')}
                  </Text>
                  <Text style={styles.selectArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Convenio */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('agreement', 'auth')}</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={() => setShowAgreementModal(true)}
                >
                  <Text style={[styles.selectButtonText, formData.agreement ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
                    {formData.agreement || t('agreementPlaceholder', 'auth')}
                  </Text>
                  <Text style={styles.selectArrow}>▼</Text>
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
                  {t('backButton', 'auth')}
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
                  {t('continueButton', 'auth')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Modal de selección de Profesión */}
      <Modal
        visible={showProfessionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfessionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectionModal}>
            <Text style={styles.selectionModalTitle}>Seleccionar Profesión</Text>
            {professionOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectionOption}
                onPress={() => handleProfessionSelect(option)}
              >
                <Text style={styles.selectionOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.selectionCancelButton}
              onPress={() => setShowProfessionModal(false)}
            >
              <Text style={styles.selectionCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de Convenio */}
      <Modal
        visible={showAgreementModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAgreementModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectionModal}>
            <Text style={styles.selectionModalTitle}>Seleccionar Convenio</Text>
            {agreementOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectionOption}
                onPress={() => handleAgreementSelect(option)}
              >
                <Text style={styles.selectionOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.selectionCancelButton}
              onPress={() => setShowAgreementModal(false)}
            >
              <Text style={styles.selectionCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};
