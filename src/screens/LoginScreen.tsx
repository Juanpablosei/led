import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BuildingAcceptanceModal } from "../components/building-acceptance-modal/BuildingAcceptanceModal";
import { Header } from "../components/header/Header";
import { CreateAccountUnifiedModal } from "../components/login/create-account-modal/CreateAccountUnifiedModal";
import { CreateAccountCompleteData } from "../components/login/create-account-modal/CreateAccountUnifiedModal.types";
import { LoginCard } from "../components/login/login-card/LoginCard";
import { LoginFormData } from "../components/login/login-card/LoginCard.types";
import { ResetCodeModal } from "../components/login/reset-code-modal/ResetCodeModal";
import { ResetPasswordModal } from "../components/login/reset-password-modal/ResetPasswordModal";
import { SupportOptions } from "../components/support-options/SupportOptions";
import { colors } from "../constants/colors";
import { useTranslation } from "../hooks/useTranslation";
import { authService } from "../services/authService";
import { storageService } from "../services/storageService";
import { styles } from "./LoginScreen.styles";

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetCodeModal, setShowResetCodeModal] = useState(false);
  const [showBuildingAcceptanceModal, setShowBuildingAcceptanceModal] =
    useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [createAccountStep, setCreateAccountStep] = useState(1);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberedNif, setRememberedNif] = useState<string | null>(null);

  // Cargar NIF recordado al iniciar
  useEffect(() => {
    const loadRememberedNif = async () => {
      try {
        const nif = await storageService.getRememberedNif();
        setRememberedNif(nif);
      } catch (error) {
        console.error('Error loading remembered NIF:', error);
      }
    };
    
    loadRememberedNif();
  }, []);

  const handleLanguageChange = () => {
    // Language change is now handled by the Header component
  };

  const handleLogin = async (data: LoginFormData, activeTab: string) => {
    console.log("Iniciar sesión:", data, "Tab:", activeTab);
    setIsLoading(true);
    
    try {
      if (activeTab === "building") {
        // Login para acceso edificio
        const response = await authService.loginBuilding({
          nif: data.nif,
          code: data.code
        });
        
        if ('success' in response && response.success) {
          // Login exitoso
          console.log("Login exitoso:", response);
          
          // Almacenar datos del login
          if (response.token) {
            await storageService.setAuthToken(response.token);
          }
          
          if (response.edificio) {
            await storageService.setBuildingData(response.edificio);
          }
          
          if (response.roles) {
            await storageService.setUserRoles(response.roles);
          }
          
          // Guardar NIF si está marcado para recordar
          if (data.rememberNif && data.nif) {
            await storageService.setRememberedNif(data.nif);
            setRememberedNif(data.nif);
          }
          
          // Por ahora mostramos el modal de aceptación
          setShowBuildingAcceptanceModal(true);
        } else {
          // Error en el login - mostrar el mensaje exacto de la respuesta
          if ('errors' in response) {
            // Error de validación (422)
            const validationErrors = response.errors;
            let errorMessage = '';
            
            if (validationErrors.nif) {
              errorMessage += validationErrors.nif.join(', ');
            }
            if (validationErrors.code) {
              if (errorMessage) errorMessage += '\n';
              errorMessage += validationErrors.code.join(', ');
            }
            
            Alert.alert('', errorMessage.trim());
          } else {
            // Error de credenciales (401) u otros errores - mostrar mensaje exacto
            const errorMessage = 'message' in response ? response.message : 'Error desconocido';
            Alert.alert('', errorMessage);
          }
        }
      } else {
        // Login para acceso general
        const response = await authService.loginGeneral({
          nif: data.nif,
          password: data.password
        });
        
        if ('status' in response && response.status) {
          // Login exitoso
          console.log("Login general exitoso:", response);
          
          // Almacenar datos del login
          if ('token' in response && response.token) {
            await storageService.setAuthToken(response.token);
          }
          
          // Guardar NIF si está marcado para recordar
          if (data.rememberNif && data.nif) {
            await storageService.setRememberedNif(data.nif);
            setRememberedNif(data.nif);
          }
          
          // Navegar directamente para login general (sin modal de edificio)
          router.replace("/buildings");
        } else {
          // Error en el login - mostrar el mensaje exacto de la respuesta
          if ('errors' in response) {
            // Error de validación (422)
            const validationErrors = response.errors;
            let errorMessage = '';
            
            if (validationErrors.nif) {
              errorMessage += validationErrors.nif.join(', ');
            }
            if (validationErrors.password) {
              if (errorMessage) errorMessage += '\n';
              errorMessage += validationErrors.password.join(', ');
            }
            
            Alert.alert('', errorMessage.trim());
          } else {
            // Error de credenciales (401) u otros errores - mostrar mensaje exacto
            const errorMessage = 'message' in response ? response.message : 'Error desconocido';
            Alert.alert('', errorMessage);
          }
        }
      }
    } catch (error) {
      console.error("Error en login:", error);
      // Mostrar mensaje de error de conexión sin título
      Alert.alert('', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    setShowCreateAccountModal(true);
    setCreateAccountStep(1);
  };

  const handleForgotPassword = (activeTab: string) => {
    setActiveTab(activeTab);
    if (activeTab === "building") {
      setShowResetCodeModal(true);
    } else {
      setShowResetPasswordModal(true);
    }
  };

  const handleFaqsPress = () => {
    console.log("Abrir FAQs");
    setShowSupportModal(false);
    // Aquí iría la navegación a FAQs
  };

  const handleLegalPress = () => {
    console.log("Abrir Aviso Legal");
    setShowSupportModal(false);
    // Aquí iría la navegación a Aviso Legal
  };

  const handleTermsPress = () => {
    console.log("Abrir Condiciones");
    setShowSupportModal(false);
    // Aquí iría la navegación a Condiciones
  };

  const handleResetPassword = async (nif: string) => {
    console.log("Restablecer contraseña para NIF:", nif);
    setIsLoading(true);
    
    try {
      const response = await authService.forgotPassword({ nif });
      
      if ('status' in response && response.status) {
        // Éxito - mostrar mensaje del servidor
        Alert.alert('', response.message);
        setShowResetPasswordModal(false);
      } else {
        // Error - mostrar mensaje del servidor
        if ('errors' in response) {
          // Error de validación (422)
          const validationErrors = response.errors;
          let errorMessage = '';
          
          if (validationErrors.nif) {
            errorMessage += validationErrors.nif.join(', ');
          }
          
          Alert.alert('', errorMessage.trim());
        } else {
          // Error de credenciales u otros errores
          const errorMessage = 'message' in response ? response.message : 'Error desconocido';
          Alert.alert('', errorMessage);
        }
      }
    } catch (error) {
      console.error("Error en olvidé contraseña:", error);
      Alert.alert('', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCatebLinkPress = () => {
    console.log("Abrir enlace de Cateb");
    setShowResetPasswordModal(false);
    // Aquí iría la navegación al enlace de Cateb
  };

  const handleResetCode = (nif: string, buildingNumber: string) => {
    console.log(
      "Restablecer código para NIF:",
      nif,
      "Edificio:",
      buildingNumber
    );
    setShowResetCodeModal(false);
    // Aquí iría la lógica para restablecer el código
  };

  const handleBuildingAcceptance = () => {
    console.log("Aceptar condiciones del edificio");
    setShowBuildingAcceptanceModal(false);
    // Navegar a la pantalla de edificios después de aceptar
    router.replace("/buildings");
  };

  const handleBuildingRejection = () => {
    console.log("Rechazar condiciones del edificio");
    setShowBuildingAcceptanceModal(false);
    // Aquí iría la lógica para manejar el rechazo
  };

  const handleCreateAccountClose = () => {
    setShowCreateAccountModal(false);
    setCreateAccountStep(1);
  };

  const handleCreateAccountStepChange = (step: number) => {
    setCreateAccountStep(step);
  };

  const handleCreateAccountFinish = (data: CreateAccountCompleteData) => {
    console.log("Finalizar creación de cuenta con datos completos:", data);
    setShowCreateAccountModal(false);
    setCreateAccountStep(1);
    // Aquí iría la lógica para finalizar el registro
    // Por ahora volvemos al login
    // El usuario ya está en la pantalla de login, solo cerramos el modal
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Imagen de fondo que ocupa toda la pantalla */}
        <ImageBackground
          source={require("../../assets/images/fondo.jpg")}
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
              isLoading={isLoading}
              rememberedNif={rememberedNif}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Cateb</Text>
            <TouchableOpacity onPress={() => setShowSupportModal(true)}>
              <View style={styles.supportContainer}>
                <Text style={styles.footerText}>{t("support", "common")}</Text>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={colors.black}
                  style={styles.chevronIcon}
                />
              </View>
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

          {/* Create Account Modal - Unificado */}
          <CreateAccountUnifiedModal
            visible={showCreateAccountModal}
            currentStep={createAccountStep}
            onClose={handleCreateAccountClose}
            onStepChange={handleCreateAccountStepChange}
            onFinish={handleCreateAccountFinish}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
