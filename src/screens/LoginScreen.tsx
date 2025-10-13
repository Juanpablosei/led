import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
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
import BuildingRejectedModal from "../components/modals/BuildingRejectedModal";
import ProfessionalDataModal from "../components/modals/ProfessionalDataModal";
import { ProfessionalDataFormData } from "../components/modals/ProfessionalDataModal.types";
import { SupportOptions } from "../components/support-options/SupportOptions";
import { colors } from "../constants/colors";
import { useTranslation } from "../hooks/useTranslation";
import { authService } from "../services/authService";
import { buildingService } from "../services/buildingService";
import { storageService } from "../services/storageService";
import { styles } from "./LoginScreen.styles";

const WEB_BASE_URL = 'https://desarrollo.arescoop.es/libro-edificio';

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetCodeModal, setShowResetCodeModal] = useState(false);
  const [showBuildingAcceptanceModal, setShowBuildingAcceptanceModal] =
    useState(false);
  const [showBuildingRejectedModal, setShowBuildingRejectedModal] = useState(false);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [createAccountStep, setCreateAccountStep] = useState(1);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberedNif, setRememberedNif] = useState<string | null>(null);
  const [showProfessionalDataModal, setShowProfessionalDataModal] = useState(false);

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
          
          // Almacenar tipo de login
          await storageService.setLoginType('building');
          
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
          
          // Verificar el campo activ para determinar el flujo
          if (response.activ === null) {
            // Mostrar modal de confirmación
            setShowBuildingAcceptanceModal(true);
          } else if (response.activ === true) {
            // Login de edificio: ir directo al detalle del edificio (no a la lista)
            if (response.edificio?.id) {
              router.replace(`/building-detail?buildingId=${response.edificio.id}`);
            } else {
              router.replace("/buildings");
            }
          } else if (response.activ === false) {
            // Mostrar modal de error
            setShowBuildingRejectedModal(true);
          }
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
          console.log("✅ ==================== LOGIN EXITOSO ====================");
          
          // Almacenar tipo de login
          await storageService.setLoginType('general');
          
          // Almacenar tokens primero
          if ('token' in response && response.token) {
            await storageService.setAuthToken(response.token);
            console.log("🔑 Token guardado");
          }
          
          if ('token_user_notification' in response && response.token_user_notification) {
            await storageService.setNotificationToken(response.token_user_notification);
            console.log("🔔 Token de notificaciones guardado");
          }
          
          // Guardar NIF si está marcado para recordar
          if (data.rememberNif && data.nif) {
            await storageService.setRememberedNif(data.nif);
            setRememberedNif(data.nif);
          }
          
          // Obtener datos completos del usuario desde /mis-datos
          try {
            const myDataResponse = await authService.getMyData();
            
            if (myDataResponse.status && myDataResponse.data) {
              const userData = myDataResponse.data;
              
              console.log("👤 ==================== DATOS DEL USUARIO ====================");
              console.log("📦 RESPUESTA COMPLETA DE /mis-datos:");
              console.log(JSON.stringify(myDataResponse, null, 2));
              console.log("============================================================");
              console.log("Nombre:", userData.first_name || 'N/A');
              console.log("Apellido:", userData.last_name || 'N/A');
              console.log("NIF:", userData.nif || 'N/A');
              console.log("Email:", userData.email || 'N/A');
              console.log("Teléfono:", userData.telefon || 'N/A');
              console.log("Tipo Usuario:", userData.tipo_usuario || 'N/A');
              console.log("Profesión:", userData.professio || 'N/A');
              console.log("Otra Profesión:", userData.otra_profesion || 'N/A');
              console.log("Comunidad Autónoma:", userData.comunitat_autonoma || 'N/A');
              console.log("Número Colegiado:", userData.colegiado_externo_num_colegiado || 'N/A');
              console.log("Colegio Profesional:", userData.collegi_professional || 'N/A');
              console.log("Entidad Convenio:", userData.entidad_convenio || 'N/A');
              console.log("============================================================");
              
              // Guardar TODOS los datos del usuario en storage
              await storageService.setUserData(userData);
              
              console.log("💾 ==================== DATOS GUARDADOS EN STORAGE ====================");
              console.log(JSON.stringify(userData, null, 2));
              console.log("====================================================================");
            } else {
              console.warn("⚠️ No se pudieron obtener los datos del usuario desde /mis-datos");
            }
          } catch (error) {
            console.error("❌ Error al obtener datos del usuario:", error);
          }
          
          // Verificar si necesita completar datos profesionales
          if ('datos_profesionales' in response && response.datos_profesionales === false) {
            setShowProfessionalDataModal(true);
          } else {
            // Cargar edificios antes de navegar
            try {
              const buildingsResponse = await buildingService.getBuildings(1);
              
              if (buildingsResponse.status && buildingsResponse.data) {
                console.log('Edificios cargados:', buildingsResponse.data.total);
                console.log('Página actual:', buildingsResponse.data.current_page);
                console.log('Total páginas:', buildingsResponse.data.last_page);
                
                // Aquí puedes guardar los edificios en el estado si lo necesitas
                // O simplemente navegar y que la pantalla de buildings los cargue
              }
            } catch (error) {
              console.error('Error al cargar edificios:', error);
            }
            
            // Navegar a la pantalla de edificios
            router.replace("/buildings");
          }
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

  const handleFaqsPress = async () => {
    console.log("Abrir FAQs");
    setShowSupportModal(false);
    try {
      await WebBrowser.openBrowserAsync(`${WEB_BASE_URL}/faqs`);
    } catch (error) {
      console.error('Error al abrir FAQs:', error);
    }
  };

  const handleLegalPress = async () => {
    console.log("Abrir Aviso Legal");
    setShowSupportModal(false);
    try {
      await WebBrowser.openBrowserAsync(`${WEB_BASE_URL}/aviso-legal`);
    } catch (error) {
      console.error('Error al abrir Aviso Legal:', error);
    }
  };

  const handleTermsPress = async () => {
    console.log("Abrir Condiciones");
    setShowSupportModal(false);
    try {
      await WebBrowser.openBrowserAsync(`${WEB_BASE_URL}/condiciones-contratacion`);
    } catch (error) {
      console.error('Error al abrir Condiciones:', error);
    }
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

  const handleResetCode = async (edificioId: number) => {
    console.log("Enviar código para edificio ID:", edificioId);
    setIsLoading(true);
    
    try {
      const response = await authService.sendCodeToBuilding(edificioId);
      
      if ('success' in response && response.success) {
        Alert.alert('', response.message || 'Código enviado exitosamente');
        setShowResetCodeModal(false);
      } else {
        Alert.alert('', response.message || 'Error al enviar el código');
      }
    } catch (error) {
      console.error("Error al enviar código:", error);
      Alert.alert('', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildingAcceptance = async () => {
    console.log("Aceptar condiciones del edificio");
    setIsLoading(true);
    
    try {
      // Obtener edificio_id (el token se agrega automáticamente por el interceptor)
      const buildingData = await storageService.getBuildingData();
      
      if (buildingData?.id) {
        const response = await authService.approveBuilding(buildingData.id);
        
        if ('success' in response && response.success) {
          console.log("Edificio aprobado exitosamente");
          setShowBuildingAcceptanceModal(false);
          // Login de edificio: ir directo al detalle del edificio (no a la lista)
          router.replace(`/building-detail?buildingId=${buildingData.id}`);
        } else {
          console.error("Error al aprobar edificio:", response.message);
          Alert.alert('', response.message || 'Error al aprobar el edificio');
        }
      } else {
        console.error("edificio_id no disponible");
        Alert.alert('', 'Error: datos de autenticación no disponibles');
      }
    } catch (error) {
      console.error("Error en aprobación de edificio:", error);
      Alert.alert('', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildingRejection = async () => {
    console.log("Rechazar condiciones del edificio");
    setIsLoading(true);
    
    try {
      // Obtener edificio_id (el token se agrega automáticamente por el interceptor)
      const buildingData = await storageService.getBuildingData();
      
      if (buildingData?.id) {
        const response = await authService.rejectBuilding(buildingData.id);
        
        if ('success' in response && response.success) {
          console.log("Edificio rechazado exitosamente");
          setShowBuildingAcceptanceModal(false);
          // Limpiar datos de autenticación y volver al login
          await storageService.clearAuthData();
        } else {
          console.error("Error al rechazar edificio:", response.message);
          Alert.alert('', response.message || 'Error al rechazar el edificio');
        }
      } else {
        console.error("edificio_id no disponible");
        Alert.alert('', 'Error: datos de autenticación no disponibles');
      }
    } catch (error) {
      console.error("Error en rechazo de edificio:", error);
      Alert.alert('', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildingRejectedClose = () => {
    setShowBuildingRejectedModal(false);
    // No navegar, el usuario debe volver al login
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

  const handleProfessionalDataClose = () => {
    setShowProfessionalDataModal(false);
    // Navegar a buildings al cerrar el modal
    router.replace("/buildings");
  };

  const handleProfessionalDataFinish = (data: ProfessionalDataFormData) => {
    console.log("Finalizar datos profesionales:", data);
    setShowProfessionalDataModal(false);
    // Aquí iría la lógica para guardar los datos profesionales
    // Por ahora navegamos a buildings
    router.replace("/buildings");
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

          {/* Building Rejected Modal */}
          <BuildingRejectedModal
            visible={showBuildingRejectedModal}
            onClose={handleBuildingRejectedClose}
          />

          {/* Create Account Modal - Unificado */}
          <CreateAccountUnifiedModal
            visible={showCreateAccountModal}
            currentStep={createAccountStep}
            onClose={handleCreateAccountClose}
            onStepChange={handleCreateAccountStepChange}
            onFinish={handleCreateAccountFinish}
          />

          {/* Professional Data Modal */}
          <ProfessionalDataModal
            visible={showProfessionalDataModal}
            onClose={handleProfessionalDataClose}
            onFinish={handleProfessionalDataFinish}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
