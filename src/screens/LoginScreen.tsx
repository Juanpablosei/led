import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Header } from '../components/header/Header';
import { LoginCard } from '../components/login-card/LoginCard';
import { LoginFormData } from '../components/login-card/LoginCard.types';
import { styles } from './LoginScreen.styles';

export const LoginScreen: React.FC = () => {
  const handleLanguageChange = () => {
    // Language change is now handled by the Header component
  };

  const handleLogin = (data: LoginFormData) => {
    console.log('Iniciar sesión:', data);
    // Aquí iría la lógica de autenticación
    // Por ahora navegamos directamente a las tabs
    router.replace('/(tabs)');
  };

  const handleRegister = () => {
    console.log('Ir a registro');
    // Aquí iría la navegación al registro
  };

  const handleForgotPassword = () => {
    console.log('Recuperar contraseña');
    // Aquí iría la navegación a recuperar contraseña
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
          <Text style={styles.footerText}>Soporte ⌄</Text>
        </View>
      </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
