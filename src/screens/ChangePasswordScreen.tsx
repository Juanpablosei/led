import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast, ToastType } from '../components/ui';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './ChangePasswordScreen.styles';

export const ChangePasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const handleBack = () => {
    router.back();
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleSave = () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast(t('changePassword.errorEmptyFields', 'user'), 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(t('changePassword.errorPasswordsNotMatch', 'user'), 'error');
      return;
    }

    // Aquí iría la lógica para cambiar la contraseña
    console.log('Cambiar contraseña');
    
    // Mostrar toast de éxito
    showToast(t('changePassword.successMessage', 'user'), 'success');
    
    // Limpiar campos después de guardar exitosamente
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('changePassword.title', 'user')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Contraseña actual */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('changePassword.currentPassword', 'user')}:</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'currentPassword' && styles.inputFocused,
              ]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              onFocus={() => setFocusedField('currentPassword')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Contraseña nueva */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('changePassword.newPassword', 'user')}:</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'newPassword' && styles.inputFocused,
              ]}
              value={newPassword}
              onChangeText={setNewPassword}
              onFocus={() => setFocusedField('newPassword')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Confirmar contraseña */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t('changePassword.confirmPassword', 'user')}:</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'confirmPassword' && styles.inputFocused,
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('changePassword.save', 'user')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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

