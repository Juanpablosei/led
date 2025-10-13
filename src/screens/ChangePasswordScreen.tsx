import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast, ToastType } from '../components/ui';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { authService } from '../services/authService';
import { styles } from './ChangePasswordScreen.styles';

export const ChangePasswordScreen: React.FC = () => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');
  
  const isMounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    router.back();
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleSave = async () => {
    // Validaciones
    if (!newPassword || !confirmPassword) {
      showToast(t('changePassword.errorEmptyFields', 'user'), 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast(t('changePassword.errorPasswordsNotMatch', 'user'), 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.changePassword({
        password: newPassword,
        password_confirmation: confirmPassword
      });

      if (response.status) {
        // Éxito
        // Extraer mensaje correctamente (puede venir como objeto o string)
        const message = response.message?.message || response.message || t('changePassword.successMessage', 'user');
        showToast(message, 'success');
        
        // Limpiar campos después de guardar exitosamente
        setNewPassword('');
        setConfirmPassword('');
        
        // Navegar después del toast solo si el componente está montado
        timeoutRef.current = setTimeout(() => {
          if (isMounted.current) {
            router.back();
          }
        }, 2000);
      } else {
        // Error del servidor
        const errorMessage = response.message?.message || response.message || 'Error al cambiar la contraseña';
        showToast(errorMessage, 'error');
      }
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      showToast('Error de conexión. Inténtalo de nuevo.', 'error');
    } finally {
      setIsLoading(false);
    }
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

      {/* Content */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
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
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Guardando...' : t('changePassword.save', 'user')}
            </Text>
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

