import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useBiometricAuth } from '../../../hooks/useBiometricAuth';
import { useTranslation } from '../../../hooks/useTranslation';
import { storageService } from '../../../services/storageService';
import { Button } from '../../buttons/Button';
import { Input } from '../../inputs/Input';
import { Tab } from '../../tabs/Tab';
import { styles } from './LoginForm.styles';
import { LoginFormData } from './LoginForm.types';

export interface LoginFormProps {
  onLogin: (data: LoginFormData, activeTab: string) => void;
  onForgotPassword: (activeTab: string) => void;
  isLoading?: boolean;
  rememberedNif?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onForgotPassword,
  isLoading = false,
  rememberedNif = null,
}) => {
  const { t } = useTranslation();
  const { 
    isAvailable: isBiometricAvailable, 
    isLoading: isBiometricLoading, 
    authenticateWithBiometric, 
    getBiometricIcon, 
    getBiometricLabel 
  } = useBiometricAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    nif: '',
    password: '',
    code: '',
    rememberNif: false,
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  // Cargar NIF recordado cuando el componente se monta
  useEffect(() => {
    if (rememberedNif) {
      setFormData(prev => ({
        ...prev,
        nif: rememberedNif.toUpperCase(), // Convertir a mayúsculas
        rememberNif: true
      }));
    }
  }, [rememberedNif]);

  // Verificar si Face ID está habilitado para el NIF actual
  useEffect(() => {
    const checkBiometricEnabled = async () => {
      if (formData.nif && isBiometricAvailable) {
        try {
          const enabled = await storageService.isBiometricEnabled(formData.nif);
          setIsBiometricEnabled(enabled);
        } catch (error) {
          console.error('Error checking biometric enabled:', error);
          setIsBiometricEnabled(false);
        }
      } else {
        setIsBiometricEnabled(false);
      }
    };

    checkBiometricEnabled();
  }, [formData.nif, isBiometricAvailable]);

  const tabs = [
    {
      id: 'general',
      label: t('generalAccess', 'auth'),
      icon: 'people-outline',
      active: activeTab === 'general',
    },
    {
      id: 'building',
      label: t('buildingAccess', 'auth'),
      icon: 'business-outline',
      active: activeTab === 'building',
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    // Convertir NIF a mayúsculas automáticamente
    const processedValue = field === 'nif' && typeof value === 'string' ? value.toUpperCase() : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue,
    }));
  };

  const handleLogin = () => {
    onLogin(formData, activeTab);
  };

  const handleForgotPassword = () => {
    onForgotPassword(activeTab);
  };

  const handleBiometricLogin = async () => {
    if (!isBiometricAvailable || !formData.nif || !isBiometricEnabled) {
      Alert.alert('Error', 'Autenticación biométrica no disponible o NIF requerido');
      return;
    }

    try {
      const result = await authenticateWithBiometric();
      
      if (result.success) {
        // Obtener las credenciales guardadas para el login biométrico
        console.log('🔍 Obteniendo credenciales guardadas...');
        const savedPassword = await storageService.getRememberedPassword();
        const savedCode = await storageService.getRememberedCode();
        
        console.log('🔍 Credenciales encontradas:');
        console.log('  - Contraseña:', savedPassword ? '***' : 'null');
        console.log('  - Código:', savedCode ? '***' : 'null');
        console.log('  - NIF:', formData.nif);
        console.log('  - Tab activo:', activeTab);
        
        // Para login biométrico, usar las credenciales guardadas
        const biometricLoginData: LoginFormData = {
          nif: formData.nif,
          password: savedPassword || '', // Usar contraseña guardada
          code: savedCode || '', // Usar código guardado
          rememberNif: formData.rememberNif,
        };
        
        console.log('🔐 Login biométrico con credenciales guardadas');
        console.log('📤 Datos que se enviarán:', {
          nif: biometricLoginData.nif,
          password: biometricLoginData.password ? '***' : 'vacío',
          code: biometricLoginData.code ? '***' : 'vacío',
          rememberNif: biometricLoginData.rememberNif
        });
        
        onLogin(biometricLoginData, activeTab);
      } else {
        Alert.alert('Error', result.error || 'Error en la autenticación biométrica');
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      Alert.alert('Error', 'Error en la autenticación biométrica');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.formWrapper}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            onPress={() => handleTabChange(tab.id)}
          />
        ))}
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {activeTab === 'general' 
          ? t('loginDescription', 'auth')
          : t('buildingDescription', 'auth')
        }
      </Text>
      

      <View style={styles.formContainer}>
      <Input
        label={t('nif', 'auth')}
        value={formData.nif}
        onChangeText={(text) => handleInputChange('nif', text)}
        placeholder={t('nifPlaceholder', 'auth')}
        autoCapitalize="characters"
      />

      <Input
        label={activeTab === 'building' ? t('accessCode', 'auth') : t('password', 'common')}
        value={activeTab === 'building' ? formData.code : formData.password}
        onChangeText={(text) => handleInputChange(activeTab === 'building' ? 'code' : 'password', text)}
        secureTextEntry={activeTab === 'general'}
        placeholder={activeTab === 'building' ? t('accessCodePlaceholder', 'auth') : t('passwordPlaceholder', 'auth')}
      />

      {/* Remember NIF Checkbox */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleInputChange('rememberNif', !formData.rememberNif)}
      >
        <View style={[styles.checkbox, formData.rememberNif && styles.checkboxChecked]}>
          {formData.rememberNif && (
            <Text style={styles.checkboxText}>✓</Text>
          )}
        </View>
        <Text style={styles.checkboxLabel}>{t('rememberNif', 'auth')}</Text>
      </TouchableOpacity>

      {/* Biometric Login Button - Solo mostrar si Face ID está habilitado para este NIF */}
      {isBiometricAvailable && formData.nif && isBiometricEnabled && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricLogin}
          disabled={isBiometricLoading || isLoading}
        >
          <Ionicons 
            name={getBiometricIcon() as any} 
            size={24} 
            color="#E95460" 
          />
          <Text style={styles.biometricButtonText}>
            {isBiometricLoading ? 'Autenticando...' : 'Usar datos biométricos'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Login Button */}
      <Button
        title={isLoading ? 'Iniciando sesión...' : t('loginButton', 'auth')}
        onPress={handleLogin}
        variant="primary"
        disabled={isLoading}
      />

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>
          {activeTab === 'building' 
            ? t('forgotAccessCode', 'auth') 
            : t('forgotPassword', 'auth')
          }
        </Text>
      </TouchableOpacity>
      </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
