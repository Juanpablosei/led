import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  AppState,
  ImageBackground,
  Keyboard,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { BuildingAcceptanceModal } from "../components/building-acceptance-modal/BuildingAcceptanceModal";
import { Header } from "../components/header/Header";
import { CreateAccountUnifiedModal } from "../components/login/create-account-modal/CreateAccountUnifiedModal";
import { CreateAccountCompleteData } from "../components/login/create-account-modal/CreateAccountUnifiedModal.types";
import { LoginCard } from "../components/login/login-card/LoginCard";
import { LoginFormData } from "../components/login/login-card/LoginCard.types";
import { ResetCodeModal } from "../components/login/reset-code-modal/ResetCodeModal";
import { ResetPasswordModal } from "../components/login/reset-password-modal/ResetPasswordModal";
import { BiometricSetupModal } from "../components/modals/BiometricSetupModal";
import BuildingRejectedModal from "../components/modals/BuildingRejectedModal";
import ProfessionalDataModal from "../components/modals/ProfessionalDataModal";
import { ProfessionalDataFormData } from "../components/modals/ProfessionalDataModal.types";
import { TermsAndConditionsModal } from "../components/modals/TermsAndConditionsModal";
import { SupportOptions } from "../components/support-options/SupportOptions";
import { config } from "../config/environment";
import { colors } from "../constants/colors";
import { useBiometricAuth } from "../hooks/useBiometricAuth";
import { useTranslation } from "../hooks/useTranslation";
import { authService } from "../services/authService";
import { buildingService } from "../services/buildingService";
import { notificationService } from "../services/notificationService";
import { storageService } from "../services/storageService";
import { styles } from "./LoginScreen.styles";

export const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isAvailable: isBiometricAvailable, getBiometricLabel } =
    useBiometricAuth();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetCodeModal, setShowResetCodeModal] = useState(false);
  const [showBuildingAcceptanceModal, setShowBuildingAcceptanceModal] =
    useState(false);
  const [showBuildingRejectedModal, setShowBuildingRejectedModal] =
    useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [buildingData, setBuildingData] = useState<any>(null);
  const [rolesData, setRolesData] = useState<any[]>([]);
  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [createAccountStep, setCreateAccountStep] = useState(1);
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingCode, setIsResettingCode] = useState(false);
  const [rememberedNif, setRememberedNif] = useState<string | null>(null);
  const [showProfessionalDataModal, setShowProfessionalDataModal] =
    useState(false);
  const [showBiometricSetupModal, setShowBiometricSetupModal] = useState(false);
  const [currentLoginNif, setCurrentLoginNif] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<{
    route: string;
    params?: any;
  } | null>(null);
  const [isUpdatingProfessionalData, setIsUpdatingProfessionalData] = useState(false);

  // Cargar NIF recordado al iniciar
  useEffect(() => {
    const loadRememberedNif = async () => {
      try {
        const nif = await storageService.getRememberedNif();
        setRememberedNif(nif);
      } catch (error) {
        // Error loading remembered NIF
        Alert.alert("", `${t('auth.errorLoadingSavedData', 'alerts')}: ${error}`);
      }
    };

    loadRememberedNif();
  }, [t]);

  // Detectar cuando la aplicación vuelve del navegador para resetear estado
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        // Resetear estado cuando la aplicación vuelve a estar activa
        setIsLoading(false);
        setShowSupportModal(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  const setupPushNotifications = async () => {
    try {
      // Solicitar permisos y obtener token
      const pushToken = await notificationService.getPushToken();

      if (pushToken) {
        // Registrar el dispositivo en el backend
        const response = await authService.registerDevice({
          device_id: pushToken.deviceId,
          expoPushToken: pushToken.token,
        });

        if (response.status) {
        } else {
        }
      } else {
      }
    } catch (error) {
      // Error configuring notifications
      Alert.alert("", `${t('auth.errorSettingUpNotifications', 'alerts')}: ${error}`);
    }
  };

  const handleLogin = async (data: LoginFormData, activeTab: string) => {
    setIsLoading(true);

    try {
      if (activeTab === "building") {
        // Login para acceso edificio
        const response = await authService.loginBuilding({
          nif: data.nif,
          code: data.code,
        });

        if ("success" in response && response.success) {
          // Login exitoso

          // Almacenar tipo de login
          await storageService.setLoginType("building");

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

          // Guardar NIF y credenciales si está marcado para recordar
          if (data.rememberNif && data.nif) {
            await storageService.setRememberedNif(data.nif);
            setRememberedNif(data.nif);

            // Guardar credenciales para Face ID
            if (data.password) {
              await storageService.setRememberedPassword(data.password);
            }
            if (data.code) {
              await storageService.setRememberedCode(data.code);
            }
          }

          // Configurar notificaciones push
          await setupPushNotifications();

          // Verificar el campo activ para determinar el flujo
          if (response.activ === null) {
            // Almacenar datos del edificio y roles
            setBuildingData(response.edificio);
            setRolesData(response.roles || []);
            // Mostrar modal de confirmación
            setShowBuildingAcceptanceModal(true);
          } else if (response.activ === true) {
            // Verificar si debe mostrar modal de Face ID (solo para login normal, no biométrico)
            if (data.nif && !data.password && !data.code) {
              // Login biométrico, no mostrar modal
              if (response.edificio?.id) {
                router.replace(
                  `/building-detail?buildingId=${response.edificio.id}`
                );
              } else {
                router.replace("/buildings");
              }
            } else {
              // Login normal, verificar si mostrar modal de Face ID
              const navigationTarget = response.edificio?.id
                ? {
                    route: "/building-detail",
                    params: { buildingId: response.edificio.id.toString() },
                  }
                : { route: "/buildings" };
              await checkAndShowBiometricSetup(data.nif, navigationTarget);
            }
          } else if (response.activ === false) {
            // Mostrar modal de error
            setShowBuildingRejectedModal(true);
          }
        } else {
          // Error en el login - mostrar el mensaje exacto de la respuesta
          if ("errors" in response) {
            // Error de validación (422)
            const validationErrors = response.errors;
            let errorMessage = "";

            if (validationErrors.nif) {
              errorMessage += validationErrors.nif.join(", ");
            }
            if (validationErrors.code) {
              if (errorMessage) errorMessage += "\n";
              errorMessage += validationErrors.code.join(", ");
            }

            Alert.alert("", errorMessage.trim());
          } else {
            // Error de credenciales (401) u otros errores - mostrar mensaje exacto
            const errorMessage =
              "message" in response ? response.message : t('unknownError', 'common');
            Alert.alert("", errorMessage);
          }
        }
      } else {
        // Login para acceso general
        const response = await authService.loginGeneral({
          nif: data.nif,
          password: data.password,
        });

        if ("status" in response && response.status) {
          // Login exitoso

          // Almacenar tipo de login
          await storageService.setLoginType("general");

          // Almacenar tokens primero
          if ("token" in response && response.token) {
            await storageService.setAuthToken(response.token);
          }

          if (
            "token_user_notification" in response &&
            response.token_user_notification
          ) {
            await storageService.setNotificationToken(
              response.token_user_notification
            );
          }

          // Guardar NIF y credenciales si está marcado para recordar
          if (data.rememberNif && data.nif) {
            await storageService.setRememberedNif(data.nif);
            setRememberedNif(data.nif);

            // Guardar credenciales para Face ID
            if (data.password) {
              await storageService.setRememberedPassword(data.password);
            }
            if (data.code) {
              await storageService.setRememberedCode(data.code);
            }
          }

          // Configurar notificaciones push
          await setupPushNotifications();

          // Obtener datos completos del usuario desde /mis-datos
          try {
            const myDataResponse = await authService.getMyData();

            if (myDataResponse.status && myDataResponse.data) {
              const userData = myDataResponse.data;

              // Guardar TODOS los datos del usuario en storage
              await storageService.setUserData(userData);
            } else {
            }
          } catch (error) {
            // Error obtaining user data
            Alert.alert("", `${t('auth.errorGettingUserData', 'alerts')}: ${error}`);
          }

          // Verificar si necesita completar datos profesionales
          if (
            "datos_profesionales" in response &&
            response.datos_profesionales === false
          ) {
            setShowProfessionalDataModal(true);
          } else {
            // Cargar edificios antes de navegar
            try {
              const buildingsResponse = await buildingService.getBuildings(1);

              if (buildingsResponse.status && buildingsResponse.data) {
                // Aquí puedes guardar los edificios en el estado si lo necesitas
                // O simplemente navegar y que la pantalla de buildings los cargue
              }
            } catch (error) {
              // Error loading buildings
              Alert.alert("", `${t('auth.errorLoadingBuildings', 'alerts')}: ${error}`);
            }

            // Verificar si debe mostrar modal de Face ID (solo para login normal, no biométrico)
            if (data.nif && !data.password && !data.code) {
              // Login biométrico, no mostrar modal
              router.replace("/buildings");
            } else {
              // Login normal, verificar si mostrar modal de Face ID
              await checkAndShowBiometricSetup(data.nif, {
                route: "/buildings",
              });
            }
          }
        } else {
          // Error en el login - mostrar el mensaje exacto de la respuesta
          if ("errors" in response) {
            // Error de validación (422)
            const validationErrors = response.errors;
            let errorMessage = "";

            if (validationErrors.nif) {
              errorMessage += validationErrors.nif.join(", ");
            }
            if (validationErrors.password) {
              if (errorMessage) errorMessage += "\n";
              errorMessage += validationErrors.password.join(", ");
            }

            Alert.alert("", errorMessage.trim());
          } else {
            // Error de credenciales (401) u otros errores - mostrar mensaje exacto
            const errorMessage =
              "message" in response ? response.message : t('unknownError', 'common');
            Alert.alert("", errorMessage);
          }
        }
      }
    } catch (error) {
      // Error in login
      // Mostrar mensaje de error de conexión sin título
      Alert.alert("", `${t('auth.connectionError', 'alerts')}: ${error}`);
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
    try {
      setShowSupportModal(false);
      
      const supported = await Linking.canOpenURL(`${config.WEB_BASE_URL}/faqs`);
      
      if (supported) {
        await Linking.openURL(`${config.WEB_BASE_URL}/faqs`);
      } else {
        Alert.alert(t('auth.error', 'alerts'), t('auth.cannotOpenFaqs', 'alerts'));
      }
      
      setIsLoading(false);
    } catch {
      setShowSupportModal(false);
      setIsLoading(false);
      Alert.alert(t('auth.error', 'alerts'), t('auth.couldNotOpenFaqs', 'alerts'));
    }
  };

  const handleLegalPress = async () => {
    try {
      setShowSupportModal(false);
      
      const supported = await Linking.canOpenURL(`${config.WEB_BASE_URL}/aviso-legal`);
      
      if (supported) {
        await Linking.openURL(`${config.WEB_BASE_URL}/aviso-legal`);
      } else {
        Alert.alert(t('auth.error', 'alerts'), t('auth.cannotOpenLegalNotice', 'alerts'));
      }
      
      setIsLoading(false);
    } catch {
      setShowSupportModal(false);
      setIsLoading(false);
      Alert.alert(t('auth.error', 'alerts'), t('auth.couldNotOpenLegalNotice', 'alerts'));
    }
  };

  const handleTermsPress = async () => {
    try {
      setShowSupportModal(false);
      
      const supported = await Linking.canOpenURL(`${config.WEB_BASE_URL}/condiciones-contratacion`);
      
      if (supported) {
        await Linking.openURL(`${config.WEB_BASE_URL}/condiciones-contratacion`);
      } else {
        Alert.alert(t('auth.error', 'alerts'), t('auth.cannotOpenTerms', 'alerts'));
      }
      
      setIsLoading(false);
    } catch {
      setShowSupportModal(false);
      setIsLoading(false);
      Alert.alert(t('auth.error', 'alerts'), t('auth.couldNotOpenTerms', 'alerts'));
    }
  };

  const handleResetPassword = async (nif: string) => {
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword({ nif });

      if ("status" in response && response.status) {
        // Éxito - mostrar mensaje del servidor
        Alert.alert("", response.message);
        setShowResetPasswordModal(false);
      } else {
        // Error - mostrar mensaje del servidor
        if ("errors" in response) {
          // Error de validación (422)
          const validationErrors = response.errors;
          let errorMessage = "";

          if (validationErrors.nif) {
            errorMessage += validationErrors.nif.join(", ");
          }

          Alert.alert("", errorMessage.trim());
        } else {
          // Error de credenciales u otros errores
          const errorMessage =
            "message" in response ? response.message : "Error desconocido";
          Alert.alert("", errorMessage);
        }
      }
      } catch (error) {
        // Error in forgot password
        Alert.alert("", `${t('auth.connectionError', 'alerts')}: ${error}`);
      } finally {
      setIsLoading(false);
    }
  };

  const handleCatebLinkPress = () => {
    Linking.openURL(config.CATEB_RESET_PASSWORD_URL);
    setShowResetPasswordModal(false);
  };

  const handleResetCode = async (edificioId: number) => {
    setIsResettingCode(true);

    try {
      const response = await authService.sendCodeToBuilding(edificioId);

      if ("success" in response && response.success) {
        Alert.alert("", response.message || t('auth.codeSentSuccessfully', 'alerts'));
        setShowResetCodeModal(false);
      } else {
        Alert.alert("", response.message || t('auth.errorSendingCode', 'alerts'));
      }
      } catch (error) {
        // Error sending code
        Alert.alert("", `${t('auth.connectionError', 'alerts')}: ${error}`);
      } finally {
      setIsResettingCode(false);
    }
  };

  const handleBuildingAcceptance = async () => {
    setIsLoading(true);

    try {
      // Obtener edificio_id (el token se agrega automáticamente por el interceptor)
      const buildingData = await storageService.getBuildingData();

      if (buildingData?.id) {
        const response = await authService.approveBuilding(buildingData.id);

        console.log('Response from approveBuilding:', response);
        
        if ("success" in response && response.success) {
          setShowBuildingAcceptanceModal(false);
          // Login de edificio: ir directo al detalle del edificio (no a la lista)
          router.replace(`/building-detail?buildingId=${buildingData.id}`);
        } else {
          // Mostrar el mensaje de la respuesta pero continuar si es exitoso
          if (response.message && response.message.includes('actualizados correctamente')) {
            setShowBuildingAcceptanceModal(false);
            router.replace(`/building-detail?buildingId=${buildingData.id}`);
          } else {
            Alert.alert("", response.message || t('auth.errorApprovingBuilding', 'alerts'));
          }
        }
      } else {
        Alert.alert("", t('auth.authDataNotAvailable', 'alerts'));
      }
      } catch (error) {
        // Error in building approval
        Alert.alert("", `${t('auth.connectionError', 'alerts')}: ${error}`);
      } finally {
      setIsLoading(false);
    }
  };

  const handleBuildingRejection = async () => {
    setIsLoading(true);

    try {
      // Obtener edificio_id (el token se agrega automáticamente por el interceptor)
      const buildingData = await storageService.getBuildingData();

      if (buildingData?.id) {
        const response = await authService.rejectBuilding(buildingData.id);

        if ("success" in response && response.success) {
          setShowBuildingAcceptanceModal(false);
          // Limpiar datos de autenticación y volver al login
          await storageService.clearAuthData();
        } else {
          Alert.alert("", response.message || t('auth.errorRejectingBuilding', 'alerts'));
        }
      } else {
        Alert.alert("", t('auth.authDataNotAvailable', 'alerts'));
      }
      } catch (error) {
        // Error in building rejection
        Alert.alert("", `${t('auth.connectionError', 'alerts')}: ${error}`);
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
    setIsLoading(false); // Reset loading state when closing registration modal
    setActiveTab("general"); // Reset to default tab
    // Reset any pending navigation state
    setPendingNavigation(null);
    setCurrentLoginNif(null);
  };

  const handleCreateAccountStepChange = (step: number) => {
    setCreateAccountStep(step);
  };

  const handleCreateAccountFinish = (data: CreateAccountCompleteData) => {
    setShowCreateAccountModal(false);
    setCreateAccountStep(1);
    setIsLoading(false); // Reset loading state when finishing registration
    setActiveTab("general"); // Reset to default tab
    // Reset any pending navigation state
    setPendingNavigation(null);
    setCurrentLoginNif(null);
  };

  const handleProfessionalDataClose = () => {
    setShowProfessionalDataModal(false);
    // Navegar a buildings al cerrar el modal
    router.replace("/buildings");
  };

  const handleProfessionalDataFinish = async (data: ProfessionalDataFormData) => {
    setIsUpdatingProfessionalData(true);
    
    try {
      // Crear objeto con datos para enviar al API
      const dataToUpdate = {
        professio: data.profession,
        colegiado_externo_num_colegiado: data.collegiateNumber,
        collegi_professional: data.professionalCollege,
        role_altres: '',
        comunitat_autonoma: data.autonomousCommunity,
        tipo_usuario: data.userType,
        idioma_preferencia_comunicacion: 'es', // Por defecto español
        politica_privacitat_acceptada_en: data.acceptDataProtection,
      };

      // Llamar a la API para actualizar los datos profesionales
      const response = await authService.updateProfessionalData(dataToUpdate);
      
      if (response.success) {
        setShowProfessionalDataModal(false);
        router.replace("/buildings");
      } else {
        console.error('Error al actualizar datos profesionales:', response.message);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error al actualizar datos profesionales:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsUpdatingProfessionalData(false);
    }
  };

  // Funciones para manejar la configuración de Face ID/Touch ID
  const handleBiometricSetupAccept = async () => {
    if (currentLoginNif) {
      await storageService.setBiometricEnabled(currentLoginNif, true);
    }
    setShowBiometricSetupModal(false);
    setCurrentLoginNif(null);

    // Navegar después de cerrar el modal
    if (pendingNavigation) {
      if (pendingNavigation.params) {
        const params = new URLSearchParams(pendingNavigation.params).toString();
        router.replace(`${pendingNavigation.route}?${params}` as any);
      } else {
        router.replace(pendingNavigation.route as any);
      }
      setPendingNavigation(null);
    }
  };

  const handleBiometricSetupReject = async () => {
    if (currentLoginNif) {
      await storageService.setBiometricEnabled(currentLoginNif, false);
    }
    setShowBiometricSetupModal(false);
    setCurrentLoginNif(null);

    // Navegar después de cerrar el modal
    if (pendingNavigation) {
      if (pendingNavigation.params) {
        const params = new URLSearchParams(pendingNavigation.params).toString();
        router.replace(`${pendingNavigation.route}?${params}` as any);
      } else {
        router.replace(pendingNavigation.route as any);
      }
      setPendingNavigation(null);
    }
  };

  const checkAndShowBiometricSetup = async (
    nif: string,
    navigationTarget: { route: string; params?: any }
  ) => {
    // Solo mostrar el modal si:
    // 1. La biometría está disponible
    // 2. Es la primera vez que se loguea (no tiene preferencia guardada)
    // 3. No es un login con Face ID (para evitar loops)

    try {
      const biometricEnabled = await storageService.isBiometricEnabled(nif);

      if (isBiometricAvailable && !biometricEnabled) {
        setCurrentLoginNif(nif);
        setPendingNavigation(navigationTarget);
        setShowBiometricSetupModal(true);
      } else {
        // Navegar directamente si no se muestra el modal
        if (navigationTarget.params) {
          const params = new URLSearchParams(
            navigationTarget.params
          ).toString();
          router.replace(`${navigationTarget.route}?${params}` as any);
        } else {
          router.replace(navigationTarget.route as any);
        }
      }
    } catch (error) {
      // Error checking biometric setup
      Alert.alert("", `${t('auth.errorSettingUpBiometric', 'alerts')}: ${error}`);
      // En caso de error, navegar directamente
      if (navigationTarget.params) {
        const params = new URLSearchParams(navigationTarget.params).toString();
        router.replace(`${navigationTarget.route}?${params}` as any);
      } else {
        router.replace(navigationTarget.route as any);
      }
    }
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
          <Header />

          {/* ScrollView para contenido scrolleable */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Main Content */}
            <View style={styles.main}>
              {/* Title */}
              <Text style={styles.title}>{t("accessArea", "common")}</Text>

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
                  <Text style={styles.footerText}>
                    {t("support", "common")}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.black}
                    style={styles.chevronIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Support Modal */}
          <SupportOptions
            visible={showSupportModal}
            onClose={() => {
              setShowSupportModal(false);
              // Resetear cualquier estado que pueda estar bloqueando
              setIsLoading(false);
            }}
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
            isLoading={isResettingCode}
          />

          {/* Building Acceptance Modal */}
          <BuildingAcceptanceModal
            visible={showBuildingAcceptanceModal}
            onClose={() => setShowBuildingAcceptanceModal(false)}
            onAccept={handleBuildingAcceptance}
            onReject={handleBuildingRejection}
            building={buildingData}
            roles={rolesData}
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
            isLoading={isUpdatingProfessionalData}
          />

          {/* Biometric Setup Modal */}
          <BiometricSetupModal
            visible={showBiometricSetupModal}
            biometricType={getBiometricLabel()}
            onAccept={handleBiometricSetupAccept}
            onReject={handleBiometricSetupReject}
          />

          {/* Terms and Conditions Modal */}
          <TermsAndConditionsModal
            visible={showTermsModal}
            onClose={() => setShowTermsModal(false)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
