import React from 'react';
import { View } from 'react-native';
import { LoginForm } from '../login-form/LoginForm';
import { RegistrationSection } from '../registration-section/RegistrationSection';
import { styles } from './LoginCard.styles';
import { LoginCardProps, LoginFormData } from './LoginCard.types';

export const LoginCard: React.FC<LoginCardProps> = ({
  onLogin,
  onRegister,
  onForgotPassword,
  isLoading = false,
  rememberedNif = null,
}) => {
  const handleLogin = (data: LoginFormData, activeTab: string) => {
    onLogin(data, activeTab);
  };

  const handleRegister = () => {
    onRegister();
  };

  const handleForgotPassword = (activeTab: string) => {
    onForgotPassword(activeTab);
  };

  return (
    <View style={styles.card}>
      {/* Form Component */}
      <LoginForm
        onLogin={handleLogin}
        onForgotPassword={handleForgotPassword}
        isLoading={isLoading}
        rememberedNif={rememberedNif}
      />

      {/* Registration Section Component */}
      <RegistrationSection
        onRegister={handleRegister}
      />
    </View>
  );
};
