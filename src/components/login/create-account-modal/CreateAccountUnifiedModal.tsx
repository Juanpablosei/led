import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Modal, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { authService, RegisterRequest } from '../../../services/authService';
import { styles } from './CreateAccountUnifiedModal.styles';
import { CreateAccountUnifiedModalProps } from './CreateAccountUnifiedModal.types';

// Función para validar DNI/NIE español
const validateSpanishDNI = (dni: string): boolean => {
  // Eliminar espacios y convertir a mayúsculas
  const cleanDNI = dni.trim().toUpperCase();
  
  // Patrón: X, Y, Z opcional + 7-8 dígitos + letra
  const dniPattern = /^[XYZ]?\d{7,8}[A-Z]$/;
  
  if (!dniPattern.test(cleanDNI)) {
    return false;
  }
  
  // Validar letra del DNI con el algoritmo del módulo 23
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  let number: number;
  let letter: string;
  
  // NIE (empieza con X, Y o Z)
  if (/^[XYZ]/.test(cleanDNI)) {
    const niePrefix = cleanDNI.charAt(0);
    const nieNumber = cleanDNI.slice(1, -1);
    letter = cleanDNI.slice(-1);
    
    // Reemplazar X=0, Y=1, Z=2
    const prefixMap: { [key: string]: string } = { 'X': '0', 'Y': '1', 'Z': '2' };
    number = parseInt(prefixMap[niePrefix] + nieNumber, 10);
  } else {
    // DNI normal
    number = parseInt(cleanDNI.slice(0, -1), 10);
    letter = cleanDNI.slice(-1);
  }
  
  // Verificar que la letra sea correcta
  const calculatedLetter = letters.charAt(number % 23);
  return letter === calculatedLetter;
};

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
  
  // Estado para errores de validación
  const [nifError, setNifError] = useState('');
  const [isCheckingNif, setIsCheckingNif] = useState(false);
  const [showAccountFoundModal, setShowAccountFoundModal] = useState(false);
  const [showRegistrationSuccessModal, setShowRegistrationSuccessModal] = useState(false);
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para el paso 2
  const [step2Data, setStep2Data] = useState({
    firstName: '',
    lastName: '',
    nif: '',
    userType: 'propertyOwner' as 'propertyOwner' | 'professional',
    profession: '',
    otraProfesion: '', // Para cuando selecciona "Altres"
    numeroColegiado: '', // Para Arquitectura técnica o Arquitectura
    comunidadAutonoma: '',
    colegioProfesionalId: '', // ID del colegio
    colegioProfesionalSlug: '', // SLUG del colegio (para enviar)
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
  const [showComunidadAutonomaModal, setShowComunidadAutonomaModal] = useState(false);
  const [showColegioProfesionalModal, setShowColegioProfesionalModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  // Opciones desde la API
  const [professionOptions, setProfessionOptions] = useState<{ id: string; name: string }[]>([]);
  const [comunidadAutonomaOptions, setComunidadAutonomaOptions] = useState<{ id: string; name: string }[]>([]);
  const [colegioProfesionalOptions, setColegioProfesionalOptions] = useState<{ id: string; name: string; slug?: string }[]>([]);
  const [agreementOptions, setAgreementOptions] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingParameters, setIsLoadingParameters] = useState(false);
  const [isLoadingComunidades, setIsLoadingComunidades] = useState(false);
  const [isLoadingColegios, setIsLoadingColegios] = useState(false);

  // Cargar parámetros públicos al montar el componente
  useEffect(() => {
    const loadPublicParameters = async () => {
      setIsLoadingParameters(true);
      try {
        const response = await authService.getPublicParameters([
          { parametroPadre: 'profesion' },
          { parametroPadre: 'entidadconvenio' }
        ]);

        // Convertir profesion a array
        if (response.profesion) {
          const professions = Object.entries(response.profesion).map(([id, name]) => ({
            id,
            name
          }));
          setProfessionOptions(professions);
        }

        // Convertir entidadconvenio a array
        if (response.entidadconvenio) {
          const agreements = Object.entries(response.entidadconvenio).map(([id, name]) => ({
            id,
            name
          }));
          setAgreementOptions(agreements);
        }
      } catch (error) {
        console.error('Error al cargar parámetros públicos:', error);
      } finally {
        setIsLoadingParameters(false);
      }
    };

    if (visible) {
      loadPublicParameters();
    }
  }, [visible]);

  // Cargar comunidades autónomas cuando se selecciona una profesión
  useEffect(() => {
    const loadComunidadesAutonomas = async () => {
      if (!step2Data.profession || step2Data.userType !== 'professional') {
        setComunidadAutonomaOptions([]);
        return;
      }

      const professionId = parseInt(step2Data.profession);
      setIsLoadingComunidades(true);
      setComunidadAutonomaOptions([]);
      setStep2Data(prev => ({ ...prev, comunidadAutonoma: '' })); // Limpiar selección

      try {
        let response: any;

        // Arquitectura técnica (4) o Arquitectura (5)
        if (professionId === 4 || professionId === 5) {
          const apiResponse = await authService.getComunidadesAutonomas(professionId);
          console.log('Respuesta API GET:', apiResponse);
          
          // La respuesta viene envuelta en { comunidadautonoma: {...} }
          response = (apiResponse as any).comunidadautonoma || apiResponse;
          console.log('Respuesta extraída:', response);
        } 
        // Altres/Otras (10) - usar parámetros públicos
        else if (professionId === 10) {
          const paramResponse = await authService.getPublicParameters([
            { parametroPadre: 'comunidadautonoma' }
          ]);
          response = paramResponse.comunidadautonoma || {};
          console.log('Respuesta comunidades POST:', response);
        }
        // Otras profesiones - no tienen comunidades
        else {
          setComunidadAutonomaOptions([]);
          setIsLoadingComunidades(false);
          return;
        }

        // Convertir respuesta a array
        if (response && typeof response === 'object') {
          const comunidades = Object.entries(response).map(([key, value]) => {
            console.log('Procesando:', key, '=', value);
            
            // Todos los valores deberían ser strings en este punto
            return {
              id: key,
              name: String(value)
            };
          });
          
          console.log('Comunidades finales:', comunidades);
          setComunidadAutonomaOptions(comunidades);
        } else {
          console.log('Respuesta no es objeto:', response);
          setComunidadAutonomaOptions([]);
        }
      } catch (error) {
        console.error('Error al cargar comunidades autónomas:', error);
        setComunidadAutonomaOptions([]);
      } finally {
        setIsLoadingComunidades(false);
      }
    };

    loadComunidadesAutonomas();
  }, [step2Data.profession, step2Data.userType]);

  // Cargar colegios profesionales cuando se selecciona una comunidad autónoma
  useEffect(() => {
    const loadColegiosProfesionales = async () => {
      if (!step2Data.comunidadAutonoma || !step2Data.profession || step2Data.userType !== 'professional') {
        setColegioProfesionalOptions([]);
        return;
      }

      const professionId = parseInt(step2Data.profession);
      
      // Solo para Arquitectura técnica (4) o Arquitectura (5)
      if (professionId !== 4 && professionId !== 5) {
        setColegioProfesionalOptions([]);
        return;
      }

      setIsLoadingColegios(true);
      setColegioProfesionalOptions([]);
      setStep2Data(prev => ({ ...prev, colegioProfesional: '' })); // Limpiar selección

      try {
        const apiResponse: any = await authService.getColegiosProfesionales(step2Data.comunidadAutonoma, professionId);
        console.log('Respuesta API colegios:', apiResponse);

        // La respuesta viene con estructura {status, message, data: [...]}
        if (apiResponse.data && Array.isArray(apiResponse.data)) {
          const colegios = apiResponse.data.map((colegio: any) => ({
            id: String(colegio.id), // Usar el ID del colegio
            name: colegio.nombre
          }));
          
          console.log('Colegios procesados:', colegios);
          setColegioProfesionalOptions(colegios);
        } else {
          console.log('Formato de respuesta inesperado');
          setColegioProfesionalOptions([]);
        }
      } catch (error) {
        console.error('Error al cargar colegios profesionales:', error);
        setColegioProfesionalOptions([]);
      } finally {
        setIsLoadingColegios(false);
      }
    };

    loadColegiosProfesionales();
  }, [step2Data.comunidadAutonoma, step2Data.profession, step2Data.userType]);

  const handleInputChange = (step: number, field: string, value: string | boolean) => {
    if (step === 1) {
      setStep1Data(prev => ({ ...prev, [field]: value }));
    } else if (step === 2) {
      // Si cambia el tipo de usuario a propietario, limpiar todos los campos relacionados
      if (field === 'userType' && value === 'propertyOwner') {
        setStep2Data(prev => ({ 
          ...prev, 
          [field]: value,
          profession: '',
          otraProfesion: '',
          numeroColegiado: '',
          comunidadAutonoma: '',
          colegioProfesionalId: '',
          colegioProfesionalSlug: '',
          agreement: ''
        }));
      } else {
        setStep2Data(prev => ({ ...prev, [field]: value }));
      }
    } else if (step === 3) {
      setStep3Data(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNifChange = (value: string) => {
    // Limitar a 9 caracteres
    const cleanValue = value.toUpperCase().slice(0, 9);
    handleInputChange(1, 'nifNie', cleanValue);
    
    // Validar cuando tiene 9 caracteres
    if (cleanValue.length === 9) {
      if (!validateSpanishDNI(cleanValue)) {
        setNifError('NIF/NIE no válido. Ejemplo: 12345678Z o X1234567L');
      } else {
        setNifError('');
      }
    } else if (cleanValue.length > 0 && cleanValue.length < 9) {
      setNifError('El NIF/NIE debe tener 9 caracteres');
    } else {
      setNifError('');
    }
  };

  const handleStep1Continue = async () => {
    const cleanNif = step1Data.nifNie.trim();
    
    if (!cleanNif) {
      setNifError('El NIF/NIE es obligatorio');
      return;
    }
    
    if (cleanNif.length !== 9) {
      setNifError('El NIF/NIE debe tener 9 caracteres');
      return;
    }
    
    if (!validateSpanishDNI(cleanNif)) {
      setNifError('NIF/NIE no válido. Ejemplo: 12345678Z o X1234567L');
      return;
    }
    
    // Verificar si el NIF ya existe en el servidor
    setIsCheckingNif(true);
    setNifError('');
    
    try {
      const response = await authService.checkNif({ nif: cleanNif });
      
      if (response.success && response.code === 200) {
        // NIF encontrado - mostrar modal personalizado y NO continuar
        setIsCheckingNif(false);
        setShowAccountFoundModal(true);
        return;
      }
      
      // NIF no encontrado (404) o cualquier otro caso - continuar al paso 2
      setNifError('');
      setStep2Data(prev => ({ ...prev, nif: step1Data.nifNie }));
      onStepChange(2);
      
    } catch (error) {
      console.error('Error al verificar NIF:', error);
      // En caso de error de red, permitir continuar
      setStep2Data(prev => ({ ...prev, nif: step1Data.nifNie }));
      onStepChange(2);
    } finally {
      setIsCheckingNif(false);
    }
  };

  // Validar si puede continuar desde el paso 2
  const canContinueStep2 = (): boolean => {
    // Validaciones base (siempre obligatorias)
    if (!step2Data.firstName.trim() || !step2Data.lastName.trim() || !step2Data.nif.trim()) {
      return false;
    }

    // Si es propietario, puede continuar
    if (step2Data.userType === 'propertyOwner') {
      return true;
    }

    // Si es profesional, validar campos adicionales obligatorios
    if (step2Data.userType === 'professional') {
      // Profesión es obligatoria
      if (!step2Data.profession) {
        return false;
      }

      // Si seleccionó "Altres" (10), "Otra profesión" es obligatoria
      if (step2Data.profession === '10' && !step2Data.otraProfesion.trim()) {
        return false;
      }

      // Si seleccionó Arquitectura técnica (4) o Arquitectura (5)
      if (step2Data.profession === '4' || step2Data.profession === '5') {
        // Número de colegiado es obligatorio
        if (!step2Data.numeroColegiado.trim()) {
          return false;
        }
        // Comunidad autónoma es obligatoria
        if (!step2Data.comunidadAutonoma) {
          return false;
        }
        // Colegio profesional es OPCIONAL
      }

      // Convenio es OPCIONAL para todos los profesionales
    }

    return true;
  };

  const handleStep2Continue = () => {
    if (canContinueStep2()) {
      onStepChange(3);
    }
  };

  const handleStep2Back = () => {
    onStepChange(1);
  };

  const handleStep3Finish = async () => {
    if (step3Data.email.trim() && step3Data.password.trim() && step3Data.confirmPassword.trim() && 
        step3Data.acceptTerms && step3Data.acceptDataProtection) {
      
      setIsLoading(true);
      
      try {
        // Preparar los datos para el registro
        const tipoUsuario: 'profesional' | 'propietario' = step2Data.userType === 'professional' ? 'profesional' : 'propietario';
        
        const registerData: RegisterRequest = {
          email: step3Data.email,
          nif: step2Data.nif,
          password: step3Data.password,
          password_confirmation: step3Data.confirmPassword,
          first_name: step2Data.firstName,
          last_name: step2Data.lastName,
          comunitat_autonoma: step2Data.userType === 'professional' ? step2Data.comunidadAutonoma : '',
          professio: step2Data.userType === 'professional' ? parseInt(step2Data.profession) || 0 : 0,
          otra_profesion: step2Data.userType === 'professional' && step2Data.profession === '10' ? step2Data.otraProfesion : undefined,
          colegiado_externo_num_colegiado: step2Data.userType === 'professional' && (step2Data.profession === '4' || step2Data.profession === '5') ? step2Data.numeroColegiado : undefined,
          collegi_professional: step2Data.userType === 'professional' && (step2Data.profession === '4' || step2Data.profession === '5') && step2Data.colegioProfesionalSlug ? step2Data.colegioProfesionalSlug : undefined,
          entitat_conveni_id: step2Data.userType === 'professional' && step2Data.agreement ? step2Data.agreement : undefined,
          politica_privacitat_acceptada_en: step3Data.acceptTerms,
          tipo_usuario: tipoUsuario
        };
        
        const response = await authService.register(registerData);
        
        console.log('📦 Respuesta completa del registro:', JSON.stringify(response));
        console.log('Tiene success?', 'success' in response);
        console.log('Tiene status?', 'status' in response);
        console.log('Valor success:', (response as any).success);
        console.log('Valor status:', (response as any).status);
        
        // La respuesta puede venir con "status" en lugar de "success"
        const isSuccess = ('success' in response && response.success) || 
                         ('status' in response && (response as any).status);
        
        if (isSuccess) {
          // Registro exitoso - mostrar modal personalizado
          console.log('✅ Registro exitoso, mostrando modal');
          console.log('Mensaje:', response.message);
          setRegistrationSuccessMessage(response.message || 'Registro exitoso');
          setShowRegistrationSuccessModal(true);
          console.log('Estado modal éxito:', true);
        } else {
          // Error en el registro
          if ('errors' in response && response.errors) {
            // Errores de validación
            const errors = Object.values(response.errors).flat();
            Alert.alert('', errors.join('\n'));
          } else {
            Alert.alert('', response.message || 'Error en el registro');
          }
        }
      } catch (error) {
        console.error('Error en registro:', error);
        Alert.alert('', 'Error de conexión. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStep3Back = () => {
    onStepChange(2);
  };

  const handleClose = () => {
    // Reset all data
    setStep1Data({ nifNie: '' });
    setNifError('');
    setShowAccountFoundModal(false);
    setShowRegistrationSuccessModal(false);
    setRegistrationSuccessMessage('');
    setStep2Data({
      firstName: '',
      lastName: '',
      nif: '',
      userType: 'propertyOwner',
      profession: '',
      otraProfesion: '',
      numeroColegiado: '',
      comunidadAutonoma: '',
      colegioProfesionalId: '',
      colegioProfesionalSlug: '',
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

  const handleAccountFoundClose = () => {
    setShowAccountFoundModal(false);
    handleClose(); // Cerrar todo el modal de registro y volver al login
  };

  const handleRegistrationSuccessClose = () => {
    setShowRegistrationSuccessModal(false);
    setRegistrationSuccessMessage('');
    handleClose(); // Cerrar todo el modal de registro y volver al login
  };

  const handleProfessionSelect = (id: string, name: string) => {
    // Limpiar campos relacionados cuando cambia de profesión
    setStep2Data(prev => ({
      ...prev,
      profession: id,
      otraProfesion: '',
      numeroColegiado: '',
      comunidadAutonoma: '',
      colegioProfesionalId: '',
      colegioProfesionalSlug: ''
    }));
    setShowProfessionModal(false);
  };

  const handleComunidadAutonomaSelect = (id: string, name: string) => {
    // Guardar el ID (esto disparará el useEffect para cargar colegios)
    handleInputChange(2, 'comunidadAutonoma', id);
    setShowComunidadAutonomaModal(false);
  };

  const handleColegioProfesionalSelect = (id: string, name: string, slug: string) => {
    // Guardar tanto el ID como el SLUG (se usa el slug para enviar)
    setStep2Data(prev => ({
      ...prev,
      colegioProfesionalId: id,
      colegioProfesionalSlug: slug
    }));
    setShowColegioProfesionalModal(false);
  };

  const handleAgreementSelect = (id: string, name: string) => {
    // Guardar el ID
    handleInputChange(2, 'agreement', id);
    setShowAgreementModal(false);
  };

  // Función para obtener el nombre de la profesión por ID
  const getProfessionName = () => {
    const profession = professionOptions.find(p => p.id === step2Data.profession);
    return profession ? profession.name : '';
  };

  // Función para obtener el nombre del convenio por ID
  const getAgreementName = () => {
    const agreement = agreementOptions.find(a => a.id === step2Data.agreement);
    return agreement ? agreement.name : '';
  };

  // Función para obtener el nombre de la comunidad autónoma por ID
  const getComunidadAutonomaName = () => {
    const comunidad = comunidadAutonomaOptions.find(c => c.id === step2Data.comunidadAutonoma);
    return comunidad ? comunidad.name : '';
  };

  // Función para obtener el nombre del colegio profesional por ID
  const getColegioProfesionalName = () => {
    const colegio = colegioProfesionalOptions.find(c => c.id === step2Data.colegioProfesionalId);
    return colegio ? colegio.name : '';
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
          style={[
            styles.textInput,
            nifError ? styles.textInputError : null
          ]}
          value={step1Data.nifNie}
          onChangeText={handleNifChange}
          placeholder={t('nifNiePlaceholder', 'auth')}
          placeholderTextColor="#999"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={9}
        />
        {nifError ? (
          <Text style={styles.errorText}>{nifError}</Text>
        ) : null}
        {step1Data.nifNie.length > 0 && !nifError && step1Data.nifNie.length === 9 ? (
          <Text style={styles.successText}>✓ NIF/NIE válido</Text>
        ) : null}
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
            (!step1Data.nifNie.trim() || nifError || step1Data.nifNie.length !== 9 || isCheckingNif) && styles.continueButtonDisabled
          ]}
          onPress={handleStep1Continue}
          disabled={!step1Data.nifNie.trim() || !!nifError || step1Data.nifNie.length !== 9 || isCheckingNif}
        >
          {isCheckingNif ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueButtonText}>
              {t('continueButton', 'auth')}
            </Text>
          )}
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

        {/* Profesión - Solo si es profesional */}
        {step2Data.userType === 'professional' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('profession', 'auth')}</Text>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowProfessionModal(true)}
              disabled={isLoadingParameters || professionOptions.length === 0}
            >
              <Text style={[styles.selectButtonText, step2Data.profession ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
                {isLoadingParameters ? 'Cargando...' : (getProfessionName() || t('professionPlaceholder', 'auth'))}
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Otra Profesión - Solo si seleccionó "Altres" (10) */}
        {step2Data.userType === 'professional' && step2Data.profession === '10' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('otraProfesion', 'auth')}</Text>
            <TextInput
              style={styles.textInput}
              value={step2Data.otraProfesion}
              onChangeText={(value) => handleInputChange(2, 'otraProfesion', value)}
              placeholder={t('otraProfesionPlaceholder', 'auth')}
              placeholderTextColor="#999"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        )}

        {/* Número de Colegiado - Solo si seleccionó Arquitectura técnica (4) o Arquitectura (5) */}
        {step2Data.userType === 'professional' && (step2Data.profession === '4' || step2Data.profession === '5') && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('numeroColegiado', 'auth')}</Text>
            <TextInput
              style={styles.textInput}
              value={step2Data.numeroColegiado}
              onChangeText={(value) => handleInputChange(2, 'numeroColegiado', value)}
              placeholder={t('numeroColegiadoPlaceholder', 'auth')}
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {/* Comunidad Autónoma - Siempre visible si es profesional */}
        {step2Data.userType === 'professional' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('comunidadAutonoma', 'auth')}</Text>
            <TouchableOpacity 
              style={[
                styles.selectButton,
                (!step2Data.profession || isLoadingComunidades || comunidadAutonomaOptions.length === 0) && styles.selectButtonDisabled
              ]}
              onPress={() => setShowComunidadAutonomaModal(true)}
              disabled={!step2Data.profession || isLoadingComunidades || comunidadAutonomaOptions.length === 0}
            >
              <Text style={[styles.selectButtonText, step2Data.comunidadAutonoma ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
                {!step2Data.profession 
                  ? 'Primero seleccione una profesión' 
                  : isLoadingComunidades 
                    ? 'Cargando...' 
                    : (getComunidadAutonomaName() || t('comunidadAutonomaPlaceholder', 'auth'))
                }
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Colegio Profesional - Solo para Arquitectura técnica (4) o Arquitectura (5) - OPCIONAL */}
        {step2Data.userType === 'professional' && (step2Data.profession === '4' || step2Data.profession === '5') && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t('colegioProfesional', 'auth')} <Text style={styles.optionalLabel}>(Opcional)</Text>
            </Text>
            <TouchableOpacity 
              style={[
                styles.selectButton,
                (!step2Data.comunidadAutonoma || isLoadingColegios || colegioProfesionalOptions.length === 0) && styles.selectButtonDisabled
              ]}
              onPress={() => setShowColegioProfesionalModal(true)}
              disabled={!step2Data.comunidadAutonoma || isLoadingColegios || colegioProfesionalOptions.length === 0}
            >
              <Text style={[styles.selectButtonText, step2Data.colegioProfesionalId ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
                {!step2Data.comunidadAutonoma 
                  ? 'Primero seleccione una comunidad autónoma' 
                  : isLoadingColegios 
                    ? 'Cargando...' 
                    : (getColegioProfesionalName() || t('colegioProfesionalPlaceholder', 'auth'))
                }
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Convenio - Solo si es profesional - OPCIONAL */}
        {step2Data.userType === 'professional' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {t('agreement', 'auth')} <Text style={styles.optionalLabel}>(Opcional)</Text>
            </Text>
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => setShowAgreementModal(true)}
              disabled={isLoadingParameters || agreementOptions.length === 0}
            >
              <Text style={[styles.selectButtonText, step2Data.agreement ? styles.selectButtonTextSelected : styles.selectButtonTextPlaceholder]}>
                {isLoadingParameters ? 'Cargando...' : (getAgreementName() || t('agreementPlaceholder', 'auth'))}
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        )}
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
            !canContinueStep2() && styles.finishButtonDisabled
          ]}
          onPress={handleStep2Continue}
          disabled={!canContinueStep2()}
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

        <View style={[styles.checkboxContainer, { marginTop: 10 }]}>
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
             !step3Data.acceptTerms || !step3Data.acceptDataProtection || isLoading) && styles.finishButtonDisabled
          ]}
          onPress={handleStep3Finish}
          disabled={!step3Data.email.trim() || !step3Data.password.trim() || !step3Data.confirmPassword.trim() || 
                   !step3Data.acceptTerms || !step3Data.acceptDataProtection || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.finishButtonText}>
              FINALIZAR
            </Text>
          )}
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
              <ScrollView 
                style={styles.modalContent}
                contentContainerStyle={styles.modalContentContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Dynamic Content Based on Step */}
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </ScrollView>
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
            
            <ScrollView 
              style={styles.selectionScrollView}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {professionOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionOption}
                  onPress={() => handleProfessionSelect(option.id, option.name)}
                >
                  <Text style={styles.selectionOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.selectionCancelButton}
              onPress={() => setShowProfessionModal(false)}
            >
              <Text style={styles.selectionCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de Comunidad Autónoma */}
      <Modal
        visible={showComunidadAutonomaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowComunidadAutonomaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectionModal}>
            <Text style={styles.selectionModalTitle}>{t('comunidadAutonoma', 'auth')}</Text>
            
            <ScrollView 
              style={styles.selectionScrollView}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {comunidadAutonomaOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionOption}
                  onPress={() => handleComunidadAutonomaSelect(option.id, option.name)}
                >
                  <Text style={styles.selectionOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.selectionCancelButton}
              onPress={() => setShowComunidadAutonomaModal(false)}
            >
              <Text style={styles.selectionCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de Colegio Profesional */}
      <Modal
        visible={showColegioProfesionalModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowColegioProfesionalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectionModal}>
            <Text style={styles.selectionModalTitle}>{t('colegioProfesional', 'auth')}</Text>
            
            <ScrollView 
              style={styles.selectionScrollView}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {colegioProfesionalOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionOption}
                  onPress={() => handleColegioProfesionalSelect(option.id, option.name, option.slug || '')}
                >
                  <Text style={styles.selectionOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.selectionCancelButton}
              onPress={() => setShowColegioProfesionalModal(false)}
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
            
            <ScrollView 
              style={styles.selectionScrollView}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {agreementOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionOption}
                  onPress={() => handleAgreementSelect(option.id, option.name)}
                >
                  <Text style={styles.selectionOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.selectionCancelButton}
              onPress={() => setShowAgreementModal(false)}
            >
              <Text style={styles.selectionCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Cuenta Encontrada */}
      <Modal
        visible={showAccountFoundModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleAccountFoundClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.accountFoundModal}>
            <Text style={styles.accountFoundTitle}>Cuenta encontrada</Text>
            
            <Text style={styles.accountFoundSubtitle}>
              Este NIF ya se encuentra asociado a una cuenta
            </Text>
            
            <View style={styles.accountFoundContent}>
              <Text style={styles.accountFoundText}>
                En caso de ser un usuario ya registrado y haber olvidado la contraseña, es necesario restablecerla.
              </Text>
              
              <Text style={styles.accountFoundText}>
                En caso de tener acceso a un edificio con código, puede terminar el registro mediante el proceso de restablecer contraseña.
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.accountFoundButton}
              onPress={handleAccountFoundClose}
            >
              <Text style={styles.accountFoundButtonText}>SALIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Registro Exitoso */}
      <Modal
        visible={showRegistrationSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleRegistrationSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.registrationSuccessModal}>
            <Text style={styles.registrationSuccessTitle}>✓ Registro exitoso</Text>
            
            <View style={styles.registrationSuccessContent}>
              <Text style={styles.registrationSuccessText}>
                {registrationSuccessMessage}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.registrationSuccessButton}
              onPress={handleRegistrationSuccessClose}
            >
              <Text style={styles.registrationSuccessButtonText}>SALIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};
