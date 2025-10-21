import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Toast, ToastType } from '../components/ui';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/authService';
import { storageService, StoredUserData } from '../services/storageService';
import { styles } from './MyDataScreen.styles';

interface SelectOption {
  id: string;
  name: string;
}

export const MyDataScreen: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
  
  // Estados editables
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'propietario' | 'profesional'>('propietario');
  
  // Estados para profesional (igual que en registro)
  const [profession, setProfession] = useState('');
  const [otraProfesion, setOtraProfesion] = useState('');
  const [comunidadAutonoma, setComunidadAutonoma] = useState('');
  const [numeroColegiado, setNumeroColegiado] = useState('');
  const [colegioProfesional, setColegioProfesional] = useState('');
  const [agreement, setAgreement] = useState('');
  
  // Estados para cambio de contraseña
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Opciones para dropdowns
  const [professionOptions, setProfessionOptions] = useState<SelectOption[]>([]);
  const [comunidadAutonomaOptions, setComunidadAutonomaOptions] = useState<SelectOption[]>([]);
  const [colegioProfesionalOptions, setColegioProfesionalOptions] = useState<SelectOption[]>([]);
  const [agreementOptions, setAgreementOptions] = useState<SelectOption[]>([]);
  
  // Estados de loading
  const [isLoadingComunidades, setIsLoadingComunidades] = useState(false);
  const [isLoadingColegios, setIsLoadingColegios] = useState(false);
  
  // Estados para modales de selección
  const [showProfessionModal, setShowProfessionModal] = useState(false);
  const [showComunidadModal, setShowComunidadModal] = useState(false);
  const [showColegioModal, setShowColegioModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Obtener datos frescos desde el servidor
      const response = await authService.getMyData();
      
      if (response.status && response.data) {
        const data = response.data;
        
        // Guardar datos en storage para uso posterior
        await storageService.setUserData(data);
        
        // Actualizar estados con los datos del servidor
        setUserData(data);
        setEmail(data.email || '');
        setTelefon(data.telefon || '');
        setTipoUsuario(data.tipo_usuario || 'propietario');
        
        // Cargar datos profesionales si existen
        if (data.tipo_usuario === 'profesional') {
          setProfession(data.professio ? String(data.professio) : '');
          setOtraProfesion(data.otra_profesion || '');
          setComunidadAutonoma(data.comunitat_autonoma || '');
          setNumeroColegiado(data.colegiado_externo_num_colegiado || '');
          setColegioProfesional(data.collegi_professional || '');
          setAgreement(data.entitat_conveni_id ? String(data.entitat_conveni_id) : '');
        }
      } else {
        // No se pudieron obtener los datos del usuario desde el servidor
        showToast(t('myData.noDataFound', 'user'), 'error');
      }
    } catch {
      // Error al cargar datos del usuario
      showToast('Error al cargar los datos', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const loadPublicParameters = async () => {
    try {
      const response = await authService.getPublicParameters([
        { parametroPadre: 'profesion' },
        { parametroPadre: 'entidadconvenio' }
      ]);

      if (response.profesion) {
        const professions = Object.entries(response.profesion).map(([id, name]) => ({
          id,
          name: String(name)
        }));
        setProfessionOptions(professions);
      }

      if (response.entidadconvenio) {
        const agreements = Object.entries(response.entidadconvenio).map(([id, name]) => ({
          id,
          name: String(name)
        }));
        setAgreementOptions(agreements);
      }
    } catch {
      // Error loading public parameters
    }
  };

  const loadComunidadesAutonomas = useCallback(async () => {
    if (!profession) return;

    const professionId = parseInt(profession);
    setIsLoadingComunidades(true);
    setComunidadAutonomaOptions([]);

    try {
      let response: any;

      if (professionId === 4 || professionId === 5) {
        const apiResponse = await authService.getComunidadesAutonomas(professionId);
        response = (apiResponse as any).comunidadautonoma || apiResponse;
      } else if (professionId === 10) {
        const paramResponse = await authService.getPublicParameters([
          { parametroPadre: 'comunidadautonoma' }
        ]);
        response = paramResponse.comunidadautonoma || {};
      } else {
        setComunidadAutonomaOptions([]);
        setIsLoadingComunidades(false);
        return;
      }

      if (response && typeof response === 'object') {
        const comunidades = Object.entries(response).map(([key, value]) => ({
          id: key,
          name: String(value)
        }));
        setComunidadAutonomaOptions(comunidades);
      }
    } catch {
      // Error loading comunidades
    } finally {
      setIsLoadingComunidades(false);
    }
  }, [profession]);

  const loadColegiosProfesionales = useCallback(async () => {
    if (!comunidadAutonoma || !profession) return;

    const professionId = parseInt(profession);
    
    if (professionId !== 4 && professionId !== 5) {
      setColegioProfesionalOptions([]);
      return;
    }

    setIsLoadingColegios(true);
    setColegioProfesionalOptions([]);

    try {
      const apiResponse: any = await authService.getColegiosProfesionales(comunidadAutonoma, professionId);

      if (apiResponse.data && Array.isArray(apiResponse.data)) {
        const colegios = apiResponse.data.map((colegio: any) => ({
          id: colegio.slug, // Usar slug como id para hacer match con collegi_professional
          name: colegio.nombre
        }));
        setColegioProfesionalOptions(colegios);
      }
    } catch {
      // Error loading colegios
    } finally {
      setIsLoadingColegios(false);
    }
  }, [comunidadAutonoma, profession]);

  // TODOS los useEffect después de las declaraciones de funciones
  
  // Cargar datos del usuario desde storage
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Cargar opciones de profesiones y convenios
  useEffect(() => {
    loadPublicParameters();
  }, []);

  // Cargar comunidades autónomas cuando cambia la profesión
  useEffect(() => {
    if (tipoUsuario === 'profesional' && profession) {
      loadComunidadesAutonomas();
    }
  }, [profession, tipoUsuario, loadComunidadesAutonomas]);

  // Cargar colegios profesionales cuando cambia la comunidad
  useEffect(() => {
    if (tipoUsuario === 'profesional' && comunidadAutonoma && profession) {
      loadColegiosProfesionales();
    }
  }, [comunidadAutonoma, profession, tipoUsuario, loadColegiosProfesionales]);

  const handleBack = () => {
    router.back();
  };

  // Validación en tiempo real (solo muestra errores, no bloquea)
  const validatePasswordsInRealTime = (password: string, confirmation: string) => {
    setPasswordError('');
    
    // Si no coinciden, mostrar error
    if (password !== confirmation) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    // Si es muy corta, mostrar error
    if (password.length > 0 && password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    // Verificar que tenga al menos una letra
    if (password.length > 0) {
      const hasLetter = /[a-zA-Z]/.test(password);
      if (!hasLetter) {
        setPasswordError('La contraseña debe contener al menos una letra');
        return;
      }
    }
    
    // Si llega aquí, no hay errores
    setPasswordError('');
  };

  // Validar contraseñas (validación completa para envío)
  const validatePasswords = () => {
    setPasswordError('');
    
    // Si ambos campos están vacíos, no hay error
    if (!newPassword && !confirmPassword) {
      return true;
    }
    
    // Si uno está lleno y el otro no, hay error
    if (!newPassword || !confirmPassword) {
      setPasswordError('Ambos campos de contraseña son obligatorios');
      return false;
    }
    
    // Si no coinciden, hay error
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return false;
    }
    
    // Si es muy corta, hay error
    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    // Verificar que tenga al menos una letra
    const hasLetter = /[a-zA-Z]/.test(newPassword);
    if (!hasLetter) {
      setPasswordError('La contraseña debe contener al menos una letra');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!userData) return;
    
    // Validar contraseñas antes de enviar
    if (!validatePasswords()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Crear objeto con datos para enviar al API
      const dataToUpdate: any = {
        professio: profession,
        colegiado_externo_num_colegiado: numeroColegiado,
        collegi_professional: colegioProfesional,
        role_altres: userData.role_altres || '',
        telefon: telefon,
        email: email,
        comunitat_autonoma: comunidadAutonoma,
        entidad_convenio: agreement,
        tipo_usuario: tipoUsuario,
        otra_profesion: otraProfesion || undefined,
      };
      
      // Solo agregar contraseña si se proporcionó
      if (newPassword && confirmPassword) {
        dataToUpdate.password = newPassword;
        dataToUpdate.password_confirmation = confirmPassword;
      }
      
      // Actualizar en el servidor
      const response = await authService.updateMyData(dataToUpdate);
      
      if (response.status) {
        // Actualizar storage con los datos actualizados
        const updatedData: StoredUserData = {
          ...userData,
          email,
          telefon,
          tipo_usuario: tipoUsuario,
          professio: profession,
          otra_profesion: otraProfesion,
          comunitat_autonoma: comunidadAutonoma,
          colegiado_externo_num_colegiado: numeroColegiado,
          collegi_professional: colegioProfesional,
          entidad_convenio: agreement,
        };
        
        await storageService.setUserData(updatedData);
        
        // Si se cambió la contraseña, actualizar el storage para Face ID
        if (newPassword && confirmPassword) {
          await storageService.setRememberedPassword(newPassword);
        }
        
        showToast(t('myData.successMessage', 'user'), 'success');
        
        // Limpiar campos de contraseña después de guardar exitosamente
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
      } else {
        // Error del servidor
        // Extraer mensaje correctamente (puede venir como objeto o string)
        const errorMessage = response.message?.message || response.message || 'Error al guardar';
        showToast(errorMessage, 'error');
      }
    } catch {
      // Error al guardar datos
      showToast('Error al guardar los datos', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Mostrar loading mientras carga
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('myData.title', 'user')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={{ marginTop: 12, fontSize: 16, color: '#666' }}>
            {t('myData.loading', 'user')}
          </Text>
        </View>
      </View>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!userData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('myData.title', 'user')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            {t('myData.noDataFound', 'user')}
          </Text>
        </View>
      </View>
    );
  }

  const isProfessional = tipoUsuario === 'profesional';
  const showOtraProfesion = profession === '10';
  const showNumeroColegiado = profession === '4' || profession === '5';
  const showComunidad = profession === '4' || profession === '5' || profession === '10';
  const showColegio = profession === '4' || profession === '5';
  
  const handleTipoUsuarioChange = (tipo: 'propietario' | 'profesional') => {
    setTipoUsuario(tipo);
    
    // Limpiar campos profesionales si cambia a propietario
    if (tipo === 'propietario') {
      setProfession('');
      setOtraProfesion('');
      setComunidadAutonoma('');
      setNumeroColegiado('');
      setColegioProfesional('');
      setAgreement('');
    }
  };

  const getProfessionName = () => {
    const prof = professionOptions.find(p => p.id === profession);
    return prof?.name || t('myData.selectProfession', 'user');
  };

  const getComunidadName = () => {
    const com = comunidadAutonomaOptions.find(c => c.id === comunidadAutonoma);
    return com?.name || t('myData.selectCommunity', 'user');
  };

  const getColegioName = () => {
    const col = colegioProfesionalOptions.find(c => c.id === colegioProfesional);
    return col?.name || t('myData.selectCollege', 'user');
  };

  const getAgreementName = () => {
    const agr = agreementOptions.find(a => a.id === agreement);
    return agr?.name || t('myData.selectAgreement', 'user');
  };

  // Función para ocultar el teclado
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('myData.title', 'user')}</Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
        <View style={styles.formContainer}>
          {/* Nombre y Apellidos en la misma fila - SOLO LECTURA */}
          <View style={styles.rowContainer}>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.name', 'user')}:</Text>
              <Text style={styles.value}>{userData.first_name || 'N/A'}</Text>
            </View>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.surname', 'user')}:</Text>
              <Text style={styles.value}>{userData.last_name || 'N/A'}</Text>
            </View>
          </View>

          {/* NIF - SOLO LECTURA */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.nif', 'user')}:</Text>
            <Text style={styles.value}>{userData.nif || 'N/A'}</Text>
          </View>

          {/* Correo electrónico y Teléfono - EDITABLES */}
          <View style={styles.rowContainer}>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.email', 'user')}:</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.phone', 'user')}:</Text>
              <TextInput
                style={styles.input}
                value={telefon}
                onChangeText={setTelefon}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Tipo de usuario - EDITABLE */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('userType.userTypeLabel', 'user')}</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleTipoUsuarioChange('propietario')}
              >
                <View
                  style={[
                    styles.radioButton,
                    tipoUsuario === 'propietario' && styles.radioButtonSelected,
                  ]}
                >
                  {tipoUsuario === 'propietario' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioText}>{t('userType.owner', 'user')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleTipoUsuarioChange('profesional')}
              >
                <View
                  style={[
                    styles.radioButton,
                    tipoUsuario === 'profesional' && styles.radioButtonSelected,
                  ]}
                >
                  {tipoUsuario === 'profesional' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioText}>{t('userType.professional', 'user')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Campos profesionales - Solo si es profesional */}
          {isProfessional && (
            <>
              {/* Profesión - EDITABLE */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>{t('userType.profession', 'user')}</Text>
                <TouchableOpacity 
                  style={styles.dropdown}
                  onPress={() => setShowProfessionModal(true)}
                >
                  <Text style={profession ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {getProfessionName()}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Otra Profesión - si profesión === 10 */}
              {showOtraProfesion && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('myData.otherProfession', 'user')}</Text>
                  <TextInput
                    style={styles.input}
                    value={otraProfesion}
                    onChangeText={setOtraProfesion}
                    placeholder={t('myData.otherProfessionPlaceholder', 'user')}
                  />
                </View>
              )}

              {/* Comunidad autónoma - EDITABLE (solo para profesiones 4, 5, 10) */}
              {showComunidad && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('userType.autonomousCommunity', 'user')}</Text>
                  <TouchableOpacity 
                    style={styles.dropdown}
                    onPress={() => setShowComunidadModal(true)}
                    disabled={isLoadingComunidades || comunidadAutonomaOptions.length === 0}
                  >
                    <Text style={comunidadAutonoma ? styles.dropdownText : styles.dropdownPlaceholder}>
                      {isLoadingComunidades ? t('myData.loadingText', 'user') : getComunidadName()}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Número de colegiado - EDITABLE (solo para profesiones 4, 5) */}
              {showNumeroColegiado && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('userType.collegiateNumber', 'user')}</Text>
                  <TextInput
                    style={styles.input}
                    value={numeroColegiado}
                    onChangeText={setNumeroColegiado}
                    keyboardType="numeric"
                    placeholder="Número de colegiado"
                  />
                </View>
              )}

              {/* Colegio profesional - EDITABLE (solo para profesiones 4, 5) */}
              {showColegio && (
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('userType.professionalCollege', 'user')}</Text>
                  <TouchableOpacity 
                    style={styles.dropdown}
                    onPress={() => setShowColegioModal(true)}
                    disabled={isLoadingColegios || colegioProfesionalOptions.length === 0}
                  >
                    <Text style={colegioProfesional ? styles.dropdownText : styles.dropdownPlaceholder}>
                      {isLoadingColegios ? t('myData.loadingText', 'user') : getColegioName()}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Convenio - EDITABLE */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>{t('userType.agreement', 'user')}</Text>
                <TouchableOpacity 
                  style={styles.dropdown}
                  onPress={() => setShowAgreementModal(true)}
                >
                  <Text style={agreement ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {getAgreementName()}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Campos de cambio de contraseña */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.newPassword', 'user')}</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError(''); // Limpiar error al escribir
                // Validación en tiempo real si ambos campos tienen contenido
                if (text && confirmPassword) {
                  validatePasswordsInRealTime(text, confirmPassword);
                }
              }}
              placeholder={t('myData.newPasswordPlaceholder', 'user')}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.confirmPassword', 'user')}</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordError(''); // Limpiar error al escribir
                // Validación en tiempo real si ambos campos tienen contenido
                if (text && newPassword) {
                  validatePasswordsInRealTime(newPassword, text);
                }
              }}
              placeholder={t('myData.confirmPasswordPlaceholder', 'user')}
              secureTextEntry
              autoCapitalize="none"
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? t('myData.saving', 'user') : t('myData.save', 'user')}
            </Text>
          </TouchableOpacity>
          </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Toast notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />

      {/* Modal de selección de Profesión */}
      <Modal
        visible={showProfessionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfessionModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfessionModal(false)}
        >
          <View style={styles.selectionModal}>
            <Text style={styles.selectionTitle}>{t('myData.selectProfessionTitle', 'user')}</Text>
            <ScrollView style={styles.selectionScrollView}>
              {professionOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionItem}
                  onPress={() => {
                    setProfession(option.id);
                    setComunidadAutonoma('');
                    setColegioProfesional('');
                    setShowProfessionModal(false);
                  }}
                >
                  <Text style={styles.selectionItemText}>{option.name}</Text>
                  {profession === option.id && (
                    <Ionicons name="checkmark" size={20} color="#E95460" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de selección de Comunidad Autónoma */}
      <Modal
        visible={showComunidadModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowComunidadModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowComunidadModal(false)}
        >
          <View style={styles.selectionModal}>
            <Text style={styles.selectionTitle}>{t('myData.selectCommunityTitle', 'user')}</Text>
            <ScrollView style={styles.selectionScrollView}>
              {comunidadAutonomaOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionItem}
                  onPress={() => {
                    setComunidadAutonoma(option.id);
                    setColegioProfesional('');
                    setShowComunidadModal(false);
                  }}
                >
                  <Text style={styles.selectionItemText}>{option.name}</Text>
                  {comunidadAutonoma === option.id && (
                    <Ionicons name="checkmark" size={20} color="#E95460" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de selección de Colegio Profesional */}
      <Modal
        visible={showColegioModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColegioModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColegioModal(false)}
        >
          <View style={styles.selectionModal}>
            <Text style={styles.selectionTitle}>{t('myData.selectCollegeTitle', 'user')}</Text>
            <ScrollView style={styles.selectionScrollView}>
              {colegioProfesionalOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionItem}
                  onPress={() => {
                    setColegioProfesional(option.id);
                    setShowColegioModal(false);
                  }}
                >
                  <Text style={styles.selectionItemText}>{option.name}</Text>
                  {colegioProfesional === option.id && (
                    <Ionicons name="checkmark" size={20} color="#E95460" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de selección de Convenio */}
      <Modal
        visible={showAgreementModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAgreementModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAgreementModal(false)}
        >
          <View style={styles.selectionModal}>
            <Text style={styles.selectionTitle}>{t('myData.selectAgreementTitle', 'user')}</Text>
            <ScrollView style={styles.selectionScrollView}>
              {agreementOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.selectionItem}
                  onPress={() => {
                    setAgreement(option.id);
                    setShowAgreementModal(false);
                  }}
                >
                  <Text style={styles.selectionItemText}>{option.name}</Text>
                  {agreement === option.id && (
                    <Ionicons name="checkmark" size={20} color="#E95460" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

