import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
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

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const userTypeOptions: UserTypeOption[] = [
    { value: 'propietario', label: 'Propietario' },
    { value: 'profesional', label: 'Profesional' },
  ];

  const professionOptions: ProfessionOption[] = [
    { value: 'arquitectura_tecnica', label: 'Arquitectura técnica' },
    { value: 'arquitectura', label: 'Arquitectura' },
    { value: 'ingenieria', label: 'Ingeniería' },
    { value: 'derecho', label: 'Derecho' },
    { value: 'economia', label: 'Economía' },
  ];

  const autonomousCommunityOptions: AutonomousCommunityOption[] = [
    { value: 'andalucia', label: 'Andalucía' },
    { value: 'cataluna', label: 'Cataluña' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'valencia', label: 'Comunidad Valenciana' },
    { value: 'galicia', label: 'Galicia' },
  ];

  const professionalCollegeOptions: ProfessionalCollegeOption[] = [
    { value: 'colegio_arquitectos', label: 'Colegio de Arquitectos' },
    { value: 'colegio_aparejadores', label: 'Colegio de Aparejadores' },
    { value: 'colegio_ingenieros', label: 'Colegio de Ingenieros' },
    { value: 'colegio_abogados', label: 'Colegio de Abogados' },
  ];

  const handleInputChange = (field: keyof ProfessionalDataFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    placeholder: string
  ) => (
    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => {
        // Aquí implementarías un picker nativo o modal
        console.log('Open dropdown for:', placeholder);
      }}
    >
      <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
        {value ? options.find(opt => opt.value === value)?.label : placeholder}
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
                  'Seleccionar profesión'
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
                  'Seleccionar comunidad'
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
                  'Seleccionar colegio'
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
