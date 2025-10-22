import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';
import { styles } from './ProfessionalDataModal.styles';
import {
  AutonomousCommunityOption,
  ProfessionalCollegeOption,
  ProfessionalDataFormData,
  ProfessionalDataModalProps,
  ProfessionOption,
  UserTypeOption,
} from './ProfessionalDataModal.types';

const ProfessionalDataModal: React.FC<ProfessionalDataModalProps> = ({
  visible,
  onClose,
  onFinish,
  initialData,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ProfessionalDataFormData>({
    nombre: '',
    userType: 'propietario',
    profession: '',
    autonomousCommunity: '',
    collegiateNumber: '',
    professionalCollege: '',
    acceptRegistrationConditions: false,
    acceptDataProtection: false,
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [professionOptions, setProfessionOptions] = useState<ProfessionOption[]>([]);
  const [autonomousCommunityOptions, setAutonomousCommunityOptions] = useState<AutonomousCommunityOption[]>([]);
  const [professionalCollegeOptions, setProfessionalCollegeOptions] = useState<ProfessionalCollegeOption[]>([]);
  const [isLoadingProfessions, setIsLoadingProfessions] = useState(false);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [isLoadingColleges, setIsLoadingColleges] = useState(false);
  const [showProfessionModal, setShowProfessionModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showCollegeModal, setShowCollegeModal] = useState(false);

  // Cargar nombre del usuario del token
  useEffect(() => {
    const loadUserName = async () => {
      try {
        const userData = await storageService.getUserData();
        if (userData) {
          const fullName = `${userData.first_name} ${userData.last_name}`.trim();
          setFormData(prev => ({ ...prev, nombre: fullName }));
        }
      } catch (error) {
        console.error('Error loading user name:', error);
      }
    };

    if (visible) {
      loadUserName();
    }
  }, [visible]);

  const loadProfessions = useCallback(async () => {
    setIsLoadingProfessions(true);
    try {
      const response = await authService.getPublicParameters([
        { parametroPadre: 'profesion' }
      ]);

      if (response.profesion) {
        const professions = Object.entries(response.profesion).map(([id, name]) => ({
          value: id,
          label: name
        }));
        setProfessionOptions(professions);
      }
    } catch (error) {
      console.error('Error loading professions:', error);
    } finally {
      setIsLoadingProfessions(false);
    }
  }, []);

  const loadAutonomousCommunities = useCallback(async () => {
    if (!formData.profession || formData.userType !== 'profesional') {
      return;
    }
    
    setIsLoadingCommunities(true);
    try {
      const professionId = parseInt(formData.profession);
      
      // Arquitectura técnica (4) o Arquitectura (5)
      if (professionId === 4 || professionId === 5) {
        const apiResponse = await authService.getComunidadesAutonomas(professionId);
        const response = (apiResponse as any).comunidadautonoma || apiResponse;
        
        if (response && typeof response === 'object') {
          const communities = Object.entries(response).map(([key, value]) => ({
            value: key,
            label: String(value)
          }));
          setAutonomousCommunityOptions(communities);
        }
      } 
      // Altres/Otras (10) - usar parámetros públicos
      else if (professionId === 10) {
        const paramResponse = await authService.getPublicParameters([
          { parametroPadre: 'comunidadautonoma' }
        ]);
        
        if (paramResponse.comunidadautonoma && typeof paramResponse.comunidadautonoma === 'object') {
          const communities = Object.entries(paramResponse.comunidadautonoma).map(([key, value]) => ({
            value: key,
            label: String(value)
          }));
          setAutonomousCommunityOptions(communities);
        }
      }
      // Otras profesiones - no tienen comunidades
      else {
        setAutonomousCommunityOptions([]);
      }
    } catch (error) {
      console.error('Error loading autonomous communities:', error);
    } finally {
      setIsLoadingCommunities(false);
    }
  }, [formData.profession, formData.userType]);

  const loadProfessionalColleges = useCallback(async () => {
    if (!formData.autonomousCommunity || !formData.profession || formData.userType !== 'profesional') {
      return;
    }
    
    setIsLoadingColleges(true);
    try {
      const professionId = parseInt(formData.profession);
      const apiResponse = await authService.getColegiosProfesionales(formData.autonomousCommunity, professionId);
      
      // La respuesta viene con estructura {status, message, data: [...]}
      if (apiResponse.data && Array.isArray(apiResponse.data)) {
        const colleges = apiResponse.data.map((colegio: any) => ({
          value: String(colegio.id), // Usar el ID del colegio
          label: colegio.nombre
        }));
        setProfessionalCollegeOptions(colleges);
      } else {
        setProfessionalCollegeOptions([]);
      }
    } catch (error) {
      console.error('Error loading professional colleges:', error);
    } finally {
      setIsLoadingColleges(false);
    }
  }, [formData.autonomousCommunity, formData.profession, formData.userType]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Cargar profesiones al abrir el modal
  useEffect(() => {
    if (visible) {
      loadProfessions();
    }
  }, [visible, loadProfessions]);

  // Cargar comunidades cuando cambia la profesión (solo si es profesional)
  useEffect(() => {
    if (formData.profession && formData.userType === 'profesional') {
      loadAutonomousCommunities();
    }
  }, [formData.profession, formData.userType, loadAutonomousCommunities]);

  // Cargar colegios cuando cambia la comunidad autónoma (solo si es profesional)
  useEffect(() => {
    if (formData.autonomousCommunity && formData.profession && formData.userType === 'profesional') {
      loadProfessionalColleges();
    }
  }, [formData.autonomousCommunity, formData.profession, formData.userType, loadProfessionalColleges]);

  const userTypeOptions: UserTypeOption[] = [
    { value: 'propietario', label: 'Propietario' },
    { value: 'profesional', label: 'Profesional' },
  ];

  const handleInputChange = (field: keyof ProfessionalDataFormData, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Limpiar campos dependientes cuando cambia la profesión
      if (field === 'profession') {
        newData.autonomousCommunity = '';
        newData.professionalCollege = '';
        setAutonomousCommunityOptions([]);
        setProfessionalCollegeOptions([]);
      }
      
      // Limpiar colegio cuando cambia la comunidad autónoma
      if (field === 'autonomousCommunity') {
        newData.professionalCollege = '';
        setProfessionalCollegeOptions([]);
      }
      
      return newData;
    });
  };

  const handleFinish = () => {
    // Validaciones básicas (siempre requeridas)
    if (!formData.acceptRegistrationConditions || !formData.acceptDataProtection) {
      // Aquí podrías mostrar un mensaje de error
      return;
    }

    // Validaciones específicas para profesionales
    if (formData.userType === 'profesional') {
      if (!formData.profession) {
        // Mostrar error: profesión requerida
        return;
      }
      if (!formData.autonomousCommunity) {
        // Mostrar error: comunidad autónoma requerida
        return;
      }
    }

    onFinish(formData);
  };

  const renderDropdown = (
    value: string,
    options: { value: string; label: string }[],
    onSelect: (value: string) => void,
    placeholder: string,
    isLoading: boolean = false,
    modalType: 'profession' | 'community' | 'college'
  ) => (
    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => {
        if (modalType === 'profession') {
          setShowProfessionModal(true);
        } else if (modalType === 'community') {
          setShowCommunityModal(true);
        } else if (modalType === 'college') {
          setShowCollegeModal(true);
        }
      }}
      disabled={isLoading}
    >
      <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
        {isLoading ? 'Cargando...' : (value ? options.find(opt => opt.value === value)?.label : placeholder)}
      </Text>
      <Ionicons name="chevron-down" size={16} color="#666" style={{ position: 'absolute', right: 12, top: 12 }} />
    </TouchableOpacity>
  );

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
            <Text style={styles.modalTitle}>Actualizar datos de usuario</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Datos personales</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.inputDisabled,
                  ]}
                  value={formData.nombre}
                  editable={false}
                  placeholder="Nombre obtenido del token"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de usuario</Text>
              <View style={styles.radioGroup}>
                {userTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.radioOption}
                    onPress={() => handleInputChange('userType', option.value)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        formData.userType === option.value && styles.radioButtonSelected,
                      ]}
                    >
                      {formData.userType === option.value && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                    <Text style={styles.radioText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Profesión - Solo si es profesional */}
            {formData.userType === 'profesional' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profesión</Text>
                <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Profesión: <Text style={styles.required}>*</Text>
                </Text>
            {renderDropdown(
              formData.profession,
              professionOptions,
              (value) => handleInputChange('profession', value),
              'Seleccionar profesión',
              isLoadingProfessions,
              'profession'
            )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Comunidad autónoma: <Text style={styles.required}>*</Text>
                </Text>
            {renderDropdown(
              formData.autonomousCommunity,
              autonomousCommunityOptions,
              (value) => handleInputChange('autonomousCommunity', value),
              'Seleccionar comunidad',
              isLoadingCommunities,
              'community'
            )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Número de colegiado/da:</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'collegiateNumber' && styles.inputFocused,
                  ]}
                  value={formData.collegiateNumber}
                  onChangeText={(value) => handleInputChange('collegiateNumber', value)}
                  onFocus={() => setFocusedField('collegiateNumber')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Colegio profesional:</Text>
            {renderDropdown(
              formData.professionalCollege,
              professionalCollegeOptions,
              (value) => handleInputChange('professionalCollege', value),
              'Seleccionar colegio',
              isLoadingColleges,
              'college'
            )}
              </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    formData.acceptRegistrationConditions && styles.checkboxSelected,
                  ]}
                  onPress={() => handleInputChange('acceptRegistrationConditions', !formData.acceptRegistrationConditions)}
                >
                  {formData.acceptRegistrationConditions && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>
                  Manifiesto que he leído y acepto las{' '}
                  <Text style={styles.linkText}>condiciones de registro</Text>.
                </Text>
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    formData.acceptDataProtection && styles.checkboxSelected,
                  ]}
                  onPress={() => handleInputChange('acceptDataProtection', !formData.acceptDataProtection)}
                >
                  {formData.acceptDataProtection && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </TouchableOpacity>
                <Text style={styles.checkboxText}>
                  Manifiesto que he leído y acepto la información relativa a la{' '}
                  <Text style={styles.linkText}>protección de datos de carácter personal</Text>.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={onClose}>
              <Text style={styles.exitButtonText}>SALIR</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.finishButton]} 
              onPress={handleFinish}
              disabled={isLoading}
            >
              <Text style={styles.finishButtonText}>
                {isLoading ? t('updatingData', 'auth') : 'FINALIZAR'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal de selección de profesión */}
      <Modal
        visible={showProfessionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfessionModal(false)}
      >
        <View style={styles.selectionModalOverlay}>
          <View style={styles.selectionModal}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>Seleccionar profesión</Text>
              <TouchableOpacity onPress={() => setShowProfessionModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.selectionList}>
              {professionOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.selectionItem}
                  onPress={() => {
                    handleInputChange('profession', option.value);
                    setShowProfessionModal(false);
                  }}
                >
                  <Text style={styles.selectionItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de comunidad */}
      <Modal
        visible={showCommunityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCommunityModal(false)}
      >
        <View style={styles.selectionModalOverlay}>
          <View style={styles.selectionModal}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>Seleccionar comunidad</Text>
              <TouchableOpacity onPress={() => setShowCommunityModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.selectionList}>
              {autonomousCommunityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.selectionItem}
                  onPress={() => {
                    handleInputChange('autonomousCommunity', option.value);
                    setShowCommunityModal(false);
                  }}
                >
                  <Text style={styles.selectionItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de selección de colegio */}
      <Modal
        visible={showCollegeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCollegeModal(false)}
      >
        <View style={styles.selectionModalOverlay}>
          <View style={styles.selectionModal}>
            <View style={styles.selectionHeader}>
              <Text style={styles.selectionTitle}>Seleccionar colegio</Text>
              <TouchableOpacity onPress={() => setShowCollegeModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.selectionList}>
              {professionalCollegeOptions.length > 0 ? (
                professionalCollegeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.selectionItem}
                    onPress={() => {
                      handleInputChange('professionalCollege', option.value);
                      setShowCollegeModal(false);
                    }}
                  >
                    <Text style={styles.selectionItemText}>{option.label}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.selectionItem}>
                  <Text style={styles.selectionItemText}>
                    {isLoadingColleges ? 'Cargando colegios...' : 'No hay colegios disponibles'}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default ProfessionalDataModal;
