import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Toast, ToastType } from '../components/ui';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './MyDataScreen.styles';

// Datos de ejemplo
const mockUserData = {
  name: 'Daniel',
  surname: 'QA',
  nif: '28242856Y',
  email: 'daniel@arescoopes',
  phone: '123123123',
};

export const MyDataScreen: React.FC = () => {
  const { t } = useTranslation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

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
          {/* Nombre */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.name', 'user')}:</Text>
            <Text style={styles.value}>{mockUserData.name}</Text>
          </View>

          {/* Apellidos */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.surname', 'user')}:</Text>
            <Text style={styles.value}>{mockUserData.surname}</Text>
          </View>

          {/* NIF */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.nif', 'user')}:</Text>
            <Text style={styles.value}>{mockUserData.nif}</Text>
          </View>

          {/* Correo electrónico */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.email', 'user')}:</Text>
            <Text style={styles.value}>{mockUserData.email}</Text>
          </View>

          {/* Teléfono */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('myData.phone', 'user')}:</Text>
            <Text style={styles.value}>{mockUserData.phone}</Text>
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

