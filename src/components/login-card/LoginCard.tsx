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
}) => {
  const handleLogin = (data: LoginFormData) => {
    onLogin(data);
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
      />

      {/* Registration Section Component */}
      <RegistrationSection
        onRegister={handleRegister}
      />
    </View>
  );
};
