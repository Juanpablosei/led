import React, { useEffect, useState } from 'react';
import { Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
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
  const [formData, setFormData] = useState<LoginFormData>({
    nif: '',
    password: '',
    code: '',
    rememberNif: false,
  });

  const [activeTab, setActiveTab] = useState('general');

  // Cargar NIF recordado cuando el componente se monta
  useEffect(() => {
    if (rememberedNif) {
      setFormData(prev => ({
        ...prev,
        nif: rememberedNif,
        rememberNif: true
      }));
    }
  }, [rememberedNif]);

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
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = () => {
    onLogin(formData, activeTab);
  };

  const handleForgotPassword = () => {
    onForgotPassword(activeTab);
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
