import React, { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { styles } from './CreateAccountUnifiedModal.styles';
import { CreateAccountUnifiedModalProps } from './CreateAccountUnifiedModal.types';

export const CreateAccountUnifiedModal: React.FC<CreateAccountUnifiedModalProps> = ({
  visible,
  currentStep,
  onClose,
  onStepChange,
  onFinish,
}) => {
  const { t } = useTranslation();
  
  // Estado para el paso 1
  const [step1Data, setStep1Data] = useState({
    nifNie: '',
  });

  // Estado para el paso 2
  const [step2Data, setStep2Data] = useState({
    firstName: '',
    lastName: '',
    nif: '',
    userType: 'propertyOwner' as 'propertyOwner' | 'professional',
    profession: '',
    agreement: '',
  });

  // Estado para el paso 3
  const [step3Data, setStep3Data] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptDataProtection: false,
  });

  // Estados para modales de selección
  const [showProfessionModal, setShowProfessionModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

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

  const handleInputChange = (step: number, field: string, value: string | boolean) => {
    if (step === 1) {
      setStep1Data(prev => ({ ...prev, [field]: value }));
    } else if (step === 2) {
      setStep2Data(prev => ({ ...prev, [field]: value }));
    } else if (step === 3) {
      setStep3Data(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleStep1Continue = () => {
    if (step1Data.nifNie.trim()) {
      // Actualizar el NIF en el paso 2
      setStep2Data(prev => ({ ...prev, nif: step1Data.nifNie }));
      onStepChange(2);
    }
  };

  const handleStep2Continue = () => {
    if (step2Data.firstName.trim() && step2Data.lastName.trim() && step2Data.nif.trim()) {
      onStepChange(3);
    }
  };

  const handleStep2Back = () => {
    onStepChange(1);
  };

  const handleStep3Finish = () => {
    if (step3Data.email.trim() && step3Data.password.trim() && step3Data.confirmPassword.trim() && 
        step3Data.acceptTerms && step3Data.acceptDataProtection) {
      onFinish({
        nifNie: step1Data.nifNie,
        ...step2Data,
        ...step3Data,
      });
    }
  };

  const handleStep3Back = () => {
    onStepChange(2);
  };

  const handleClose = () => {
    // Reset all data
    setStep1Data({ nifNie: '' });
    setStep2Data({
      firstName: '',
      lastName: '',
      nif: '',
      userType: 'propertyOwner',
      profession: '',
      agreement: '',
    });
    setStep3Data({
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptDataProtection: false,
    });
    onClose();
  };

  const handleProfessionSelect = (profession: string) => {
    handleInputChange(2, 'profession', profession);
    setShowProfessionModal(false);
  };

  const handleAgreementSelect = (agreement: string) => {
    handleInputChange(2, 'agreement', agreement);
    setShowAgreementModal(false);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, currentStep === 1 ? styles.stepCircleActive : styles.stepCircleInactive]}>
          <Text style={[styles.stepNumber, currentStep === 1 ? styles.stepNumberActive : styles.stepNumberInactive]}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.stepCircle, currentStep === 2 ? styles.stepCircleActive : styles.stepCircleInactive]}>
          <Text style={[styles.stepNumber, currentStep === 2 ? styles.stepNumberActive : styles.stepNumberInactive]}>2</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.stepCircle, currentStep === 3 ? styles.stepCircleActive : styles.stepCircleInactive]}>
          <Text style={[styles.stepNumber, currentStep === 3 ? styles.stepNumberActive : styles.stepNumberInactive]}>3</Text>
        </View>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <>
      <Text style={styles.stepInstruction}>{t('stepIndicator', 'auth')}</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={step1Data.nifNie}
          onChangeText={(value) => handleInputChange(1, 'nifNie', value)}
          placeholder={t('nifNiePlaceholder', 'auth')}
          placeholderTextColor="#999"
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>

      <Text style={styles.infoText}>
        {t('catebMemberInfo', 'auth')}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={handleClose}
        >
          <Text style={styles.exitButtonText}>
            {t('exitButton', 'auth')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.continueButton,
            !step1Data.nifNie.trim() && styles.continueButtonDisabled
          ]}
          onPress={handleStep1Continue}
          disabled={!step1Data.nifNie.trim()}
        >
          <Text style={styles.continueButtonText}>
            {t('continueButton', 'auth')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepInstruction}>{t('step2Instruction', 'auth')}</Text>

      <View style={styles.formContainer}>
        {/* Nombre y Apellidos */}
        <View style={styles.inputRow}>
          <View style={styles.inputGroupHalf}>
            <Text style={styles.inputLabel}>{t('firstName', 'auth')}</Text>
            <TextInput
              style={styles.textInput}
              value={step2Data.firstName}
              onChangeText={(value) => handleInputChange(2, 'firstName', value)}
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
              value={step2Data.lastName}
              onChangeText={(value) => handleInputChange(2, 'lastName', value)}
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
            value={step2Data.nif}
            onChangeText={(value) => handleInputChange(2, 'nif', value)}
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
              onPress={() => handleInputChange(2, 'userType', 'propertyOwner')}
            >
              <View style={[styles.checkbox, step2Data.userType === 'propertyOwner' && styles.checkboxChecked]}>
                {step2Data.userType === 'propertyOwner' && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.checkboxText}>{t('propertyOwner', 'auth')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={() => handleInputChange(2, 'userType', 'professional')}
            >
              <View style={[styles.checkbox, step2Data.userType === 'professional' && styles.checkboxChecked]}>
                {step2Data.userType === 'professional' && <View style={styles.radioDot} />}
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
            <Text style={[styles.selectButtonText, step2Data.profession ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
              {step2Data.profession || t('professionPlaceholder', 'auth')}
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
            <Text style={[styles.selectButtonText, step2Data.agreement ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
              {step2Data.agreement || t('agreementPlaceholder', 'auth')}
            </Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleStep2Back}
        >
          <Text style={styles.backButtonText}>
            {t('backButton', 'auth')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.finishButton,
            (!step2Data.firstName.trim() || !step2Data.lastName.trim() || !step2Data.nif.trim()) && styles.finishButtonDisabled
          ]}
          onPress={handleStep2Continue}
          disabled={!step2Data.firstName.trim() || !step2Data.lastName.trim() || !step2Data.nif.trim()}
        >
          <Text style={styles.finishButtonText}>
            {t('continueButton', 'auth')}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepInstruction}>{t('step3Title', 'auth')}</Text>

      <View style={styles.formContainer}>
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('email', 'auth')}</Text>
          <TextInput
            style={styles.textInput}
            value={step3Data.email}
            onChangeText={(value) => handleInputChange(3, 'email', value)}
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
            value={step3Data.password}
            onChangeText={(value) => handleInputChange(3, 'password', value)}
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
            value={step3Data.confirmPassword}
            onChangeText={(value) => handleInputChange(3, 'confirmPassword', value)}
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
            onPress={() => handleInputChange(3, 'acceptTerms', !step3Data.acceptTerms)}
          >
            <View style={[styles.checkbox, step3Data.acceptTerms && styles.checkboxChecked]}>
              {step3Data.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
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
            onPress={() => handleInputChange(3, 'acceptDataProtection', !step3Data.acceptDataProtection)}
          >
            <View style={[styles.checkbox, step3Data.acceptDataProtection && styles.checkboxChecked]}>
              {step3Data.acceptDataProtection && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              {t('dataProtectionText', 'auth')}{' '}
              <Text style={styles.redText}>{t('dataProtection', 'auth')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleStep3Back}
        >
          <Text style={styles.backButtonText}>
            REGRESAR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.finishButton,
            (!step3Data.email.trim() || !step3Data.password.trim() || !step3Data.confirmPassword.trim() || 
             !step3Data.acceptTerms || !step3Data.acceptDataProtection) && styles.finishButtonDisabled
          ]}
          onPress={handleStep3Finish}
          disabled={!step3Data.email.trim() || !step3Data.password.trim() || !step3Data.confirmPassword.trim() || 
                   !step3Data.acceptTerms || !step3Data.acceptDataProtection}
        >
          <Text style={styles.finishButtonText}>
            FINALIZAR
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

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
                <Text style={styles.modalTitle}>
                  {currentStep === 1 ? t('createAccountTitle', 'auth') : 
                   currentStep === 2 ? t('step2Title', 'auth') : 
                   t('step3Title', 'auth')}
                </Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.modalContent}>
                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Dynamic Content Based on Step */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
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
