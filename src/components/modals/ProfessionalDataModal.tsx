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
import { authService } from '../../services/authService';
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
}) => {
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
    if (!formData.profession) return;
    
    setIsLoadingCommunities(true);
    try {
      const professionId = parseInt(formData.profession);
      
      // Arquitectura técnica (4) o Arquitectura (5)
      if (professionId === 4 || professionId === 5) {
        const apiResponse = await authService.getComunidadesAutonomas(professionId);
        const response = (apiResponse as any).comunidadautonoma || apiResponse;
        
        if (response) {
          const communities = Object.entries(response).map(([id, name]) => ({
            value: id,
            label: name as string
          }));
          setAutonomousCommunityOptions(communities);
        }
      } 
      // Altres/Otras (10) - usar parámetros públicos
      else if (professionId === 10) {
        const paramResponse = await authService.getPublicParameters([
          { parametroPadre: 'comunidadautonoma' }
        ]);
        
        if (paramResponse.comunidadautonoma) {
          const communities = Object.entries(paramResponse.comunidadautonoma).map(([id, name]) => ({
            value: id,
            label: name as string
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
  }, [formData.profession]);

  const loadProfessionalColleges = useCallback(async () => {
    if (!formData.autonomousCommunity || !formData.profession) return;
    
    setIsLoadingColleges(true);
    try {
      const professionId = parseInt(formData.profession);
      const apiResponse = await authService.getColegiosProfesionales(formData.autonomousCommunity, professionId);
      
      if (apiResponse && apiResponse.colegioprofesional) {
        const colleges = Object.entries(apiResponse.colegioprofesional).map(([id, name]) => ({
          value: id,
          label: name as string
        }));
        setProfessionalCollegeOptions(colleges);
      }
    } catch (error) {
      console.error('Error loading professional colleges:', error);
    } finally {
      setIsLoadingColleges(false);
    }
  }, [formData.autonomousCommunity, formData.profession]);

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

  // Cargar comunidades cuando cambia la profesión
  useEffect(() => {
    if (formData.profession) {
      loadAutonomousCommunities();
    }
  }, [formData.profession, loadAutonomousCommunities]);

  // Cargar colegios cuando cambia la comunidad autónoma
  useEffect(() => {
    if (formData.autonomousCommunity && formData.profession) {
      loadProfessionalColleges();
    }
  }, [formData.autonomousCommunity, formData.profession, loadProfessionalColleges]);

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
    if (!formData.acceptRegistrationConditions || !formData.acceptDataProtection) {
      // Aquí podrías mostrar un mensaje de error
      return;
    }
    onFinish(formData);
  };

  const renderDropdown = (
    value: string,
    options: { value: string; label: string }[],
    onSelect: (value: string) => void,
    placeholder: string,
    isLoading: boolean = false
  ) => (
    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => {
        // Aquí implementarías un picker nativo o modal
        console.log('Open dropdown for:', placeholder);
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
                    focusedField === 'nombre' && styles.inputFocused,
                  ]}
                  value={formData.nombre}
                  onChangeText={(value) => handleInputChange('nombre', value)}
                  onFocus={() => setFocusedField('nombre')}
                  onBlur={() => setFocusedField(null)}
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
                  isLoadingProfessions
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
                  isLoadingCommunities
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
                  isLoadingColleges
                )}
              </View>
            </View>

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
            <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={handleFinish}>
              <Text style={styles.finishButtonText}>FINALIZAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProfessionalDataModal;
