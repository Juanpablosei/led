import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast, ToastType } from '../components/ui';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './MyDataScreen.styles';

type UserTypeOption = 'owner' | 'professional';

// Datos de ejemplo
const mockUserData = {
  name: 'Daniel',
  surname: 'QA',
  nif: '28242856Y',
  email: 'daniel@arescoopes',
  phone: '123123123',
};

// Datos para tipo de usuario
const professions = ['Arquitectura', 'Ingeniería', 'Abogacía'];
const autonomousCommunities = ['Andalucía', 'Cataluña', 'Madrid', 'Valencia'];
const professionalColleges = [
  'Colegio Oficial de Arquitectos de ...',
  'Colegio de Ingenieros',
  'Colegio de Abogados',
];

export const MyDataScreen: React.FC = () => {
  const { t } = useTranslation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
  
  // Estados para tipo de usuario
  const [userType, setUserType] = useState<UserTypeOption>('professional');
  const [profession, setProfession] = useState('Arquitectura');
  const [autonomousCommunity, setAutonomousCommunity] = useState('Andalucía');
  const [collegiateNumber, setCollegiateNumber] = useState('1112');
  const [professionalCollege, setProfessionalCollege] = useState('Colegio Oficial de Arquitectos de ...');
  const [agreement, setAgreement] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los datos
    console.log('Guardar datos:', mockUserData);
    
    // Mostrar toast de éxito
    setToastMessage(t('myData.successMessage', 'user'));
    setToastType('success');
    setToastVisible(true);
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
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
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Nombre y Apellidos en la misma fila */}
          <View style={styles.rowContainer}>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.name', 'user')}:</Text>
              <Text style={styles.value}>{mockUserData.name}</Text>
            </View>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.surname', 'user')}:</Text>
              <Text style={styles.value}>{mockUserData.surname}</Text>
            </View>
          </View>

          {/* NIF */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.nif', 'user')}:</Text>
            <Text style={styles.value}>{mockUserData.nif}</Text>
          </View>

          {/* Correo electrónico y Teléfono en la misma fila */}
          <View style={styles.rowContainer}>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.email', 'user')}:</Text>
              <Text style={styles.value}>{mockUserData.email}</Text>
            </View>
            <View style={styles.halfFieldContainer}>
              <Text style={styles.label}>{t('myData.phone', 'user')}:</Text>
              <Text style={styles.value}>{mockUserData.phone}</Text>
            </View>
          </View>

          {/* Tipo de usuario */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('userType.userTypeLabel', 'user')}</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setUserType('owner')}
              >
                <View
                  style={[
                    styles.radioButton,
                    userType === 'owner' && styles.radioButtonSelected,
                  ]}
                >
                  {userType === 'owner' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioText}>{t('userType.owner', 'user')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setUserType('professional')}
              >
                <View
                  style={[
                    styles.radioButton,
                    userType === 'professional' && styles.radioButtonSelected,
                  ]}
                >
                  {userType === 'professional' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioText}>{t('userType.professional', 'user')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Profesión */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('userType.profession', 'user')}</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{profession}</Text>
              <Ionicons name="chevron-down" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Comunidad autónoma */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('userType.autonomousCommunity', 'user')}</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{autonomousCommunity}</Text>
              <Ionicons name="chevron-down" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Número de colegiado/a */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {t('userType.collegiateNumber', 'user')} <Text style={styles.required}>{t('userType.required', 'user')}</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={collegiateNumber}
              onChangeText={setCollegiateNumber}
              keyboardType="numeric"
            />
          </View>

          {/* Colegio profesional */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('userType.professionalCollege', 'user')}</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{professionalCollege}</Text>
              <Ionicons name="chevron-down" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Convenio */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('userType.agreement', 'user')}</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownPlaceholder}>
                {agreement || t('userType.selectOption', 'user')}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('myData.save', 'user')}</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>

      {/* Toast notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

