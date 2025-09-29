import { router } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { BuildingAcceptanceModal } from '../components/building-acceptance-modal/BuildingAcceptanceModal';
import { Header } from '../components/header/Header';
import { LoginCard } from '../components/login-card/LoginCard';
import { LoginFormData } from '../components/login-card/LoginCard.types';
import { ResetCodeModal } from '../components/reset-code-modal/ResetCodeModal';
import { ResetPasswordModal } from '../components/reset-password-modal/ResetPasswordModal';
import { SupportOptions } from '../components/support-options/SupportOptions';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './LoginScreen.styles';

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetCodeModal, setShowResetCodeModal] = useState(false);
  const [showBuildingAcceptanceModal, setShowBuildingAcceptanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleLanguageChange = () => {
    // Language change is now handled by the Header component
  };

  const handleLogin = (data: LoginFormData) => {
    console.log('Iniciar sesión:', data);
    // Aquí iría la lógica de autenticación
    // Por ahora mostramos el modal de aceptación del edificio
    setShowBuildingAcceptanceModal(true);
  };

  const handleRegister = () => {
    console.log('Ir a registro');
    // Aquí iría la navegación al registro
  };

  const handleForgotPassword = (activeTab: string) => {
    setActiveTab(activeTab);
    if (activeTab === 'building') {
      setShowResetCodeModal(true);
    } else {
      setShowResetPasswordModal(true);
    }
  };

  const handleFaqsPress = () => {
    console.log('Abrir FAQs');
    setShowSupportModal(false);
    // Aquí iría la navegación a FAQs
  };

  const handleLegalPress = () => {
    console.log('Abrir Aviso Legal');
    setShowSupportModal(false);
    // Aquí iría la navegación a Aviso Legal
  };

  const handleTermsPress = () => {
    console.log('Abrir Condiciones');
    setShowSupportModal(false);
    // Aquí iría la navegación a Condiciones
  };

  const handleResetPassword = (nif: string) => {
    console.log('Restablecer contraseña para NIF:', nif);
    setShowResetPasswordModal(false);
    // Aquí iría la lógica para restablecer la contraseña
  };

  const handleCatebLinkPress = () => {
    console.log('Abrir enlace de Cateb');
    setShowResetPasswordModal(false);
    // Aquí iría la navegación al enlace de Cateb
  };

  const handleResetCode = (nif: string, buildingNumber: string) => {
    console.log('Restablecer código para NIF:', nif, 'Edificio:', buildingNumber);
    setShowResetCodeModal(false);
    // Aquí iría la lógica para restablecer el código
  };

  const handleBuildingAcceptance = () => {
    console.log('Aceptar condiciones del edificio');
    setShowBuildingAcceptanceModal(false);
    // Aquí iría la navegación a las tabs después de aceptar
    router.replace('/(tabs)');
  };

  const handleBuildingRejection = () => {
    console.log('Rechazar condiciones del edificio');
    setShowBuildingAcceptanceModal(false);
    // Aquí iría la lógica para manejar el rechazo
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      {/* Imagen de fondo que ocupa toda la pantalla */}
      <ImageBackground 
        source={require('../../assets/images/fondo.jpg')} 
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Overlay rojo que cubre toda la imagen */}
        <View style={styles.overlay} />
      </ImageBackground>
      
      {/* Capa blanca que cubre la parte inferior completamente */}
      <View style={styles.whiteBottom} />
      
      {/* Capa blanca diagonal */}
      <View style={styles.whiteOverlay} />
      
      {/* Contenido superpuesto (sin modificar posiciones) */}
      <View style={styles.content}>
        {/* Header */}
        <Header onLanguageChange={handleLanguageChange} />

        {/* Main Content */}
        <View style={styles.main}>
          {/* Title */}
          <Text style={styles.title}>Área de acceso</Text>

          {/* Login Card */}
          <LoginCard
            onLogin={handleLogin}
            onRegister={handleRegister}
            onForgotPassword={handleForgotPassword}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Cateb</Text>
          <TouchableOpacity onPress={() => setShowSupportModal(true)}>
            <Text style={styles.footerText}>{t('support', 'common')} ⌄</Text>
          </TouchableOpacity>
        </View>

        {/* Support Modal */}
        <SupportOptions
          visible={showSupportModal}
          onClose={() => setShowSupportModal(false)}
          onFaqsPress={handleFaqsPress}
          onLegalPress={handleLegalPress}
          onTermsPress={handleTermsPress}
        />

        {/* Reset Password Modal */}
        <ResetPasswordModal
          visible={showResetPasswordModal}
          activeTab={activeTab}
          onClose={() => setShowResetPasswordModal(false)}
          onResetPassword={handleResetPassword}
          onCatebLinkPress={handleCatebLinkPress}
        />

        {/* Reset Code Modal */}
        <ResetCodeModal
          visible={showResetCodeModal}
          onClose={() => setShowResetCodeModal(false)}
          onResetCode={handleResetCode}
        />

        {/* Building Acceptance Modal */}
        <BuildingAcceptanceModal
          visible={showBuildingAcceptanceModal}
          onClose={() => setShowBuildingAcceptanceModal(false)}
          onAccept={handleBuildingAcceptance}
          onReject={handleBuildingRejection}
        />
      </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
