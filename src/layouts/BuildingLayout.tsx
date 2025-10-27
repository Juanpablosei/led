import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GlobalHeader } from '../components/global/GlobalHeader';
import { Sidebar } from '../components/sidebar/Sidebar';
import { UserMenu, UserMenuOption } from '../components/user-menu';
import { useTranslation } from '../hooks/useTranslation';
import { buildingService } from '../services/buildingService';
import { storageService } from '../services/storageService';
import { styles } from './BuildingLayout.styles';
import { BuildingLayoutProps } from './BuildingLayout.types';

export const BuildingLayout: React.FC<BuildingLayoutProps> = ({ building, children }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isBuildingLogin, setIsBuildingLogin] = useState(false);
  const [buildingDetailData, setBuildingDetailData] = useState<any>(null);

  // Función para obtener el título dinámico del header
  const getHeaderTitle = () => {
    if (isBuildingLogin) {
      // Login con código de acceso: siempre mostrar "Edificio"
      return t('building', 'navigation');
    } else {
      // Login normal: mostrar "Mis edificios" en detalle, "Edificio" en otras pantallas
      if (pathname === '/building-detail') {
        return t('myBuildings', 'navigation'); // "Mis Edificios" (solo en detalle del edificio)
      } else {
        return t('building', 'navigation'); // "Edificio" (en todas las demás pantallas)
      }
    }
  };

  // Función para manejar la navegación del botón atrás
  const handleBackPress = () => {
    if (pathname === '/building-detail') {
      // Desde detalle del edificio, ir al listado de edificios
      router.push('/buildings');
    } else {
      // Desde otras pantallas, ir al detalle del edificio
      if (building?.id) {
        router.push(`/building-detail?buildingId=${building.id}`);
      } else {
        router.back();
      }
    }
  };

  // Verificar tipo de login
  const loadBuildingDetail = useCallback(async () => {
    if (!building?.id) return;
    
    try {
      const response = await buildingService.getBuildingById(Number(building.id));
      
      if (response.status && response.data) {
        setBuildingDetailData(response.data);
      }
    } catch {
      // Error al cargar datos del edificio
    }
  }, [building?.id]);

  useEffect(() => {
    checkLoginType();
  }, []);

  // Actualizar título cuando cambie el tipo de login
  useEffect(() => {
    // El título se actualizará automáticamente cuando isBuildingLogin cambie
  }, [isBuildingLogin, pathname]);

  // Cargar datos completos del edificio cuando cambie
  useEffect(() => {
    if (building?.id) {
      loadBuildingDetail();
    }
  }, [building?.id, loadBuildingDetail]);

  const checkLoginType = async () => {
    const isBuildingUser = await storageService.isBuildingLogin();
    setIsBuildingLogin(isBuildingUser);
  };

  // Cargar notificaciones para actualizar el badge
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await buildingService.getNotifications(100, true);
      
      if (response.status && 'data' in response) {
        // Calcular total de notificaciones
        const total = 
          response.data.comunicaciones_no_leidas.cantidad +
          response.data.documentos_edificio_caducados.cantidad +
          response.data.documentos_inmueble_caducados.cantidad +
          response.data.actividades_proximas.cantidad;
        
        setNotificationCount(total);
      }
    } catch {
      // Error al cargar notificaciones
    }
  };

  const handleMenuPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  const handleSidebarItemPress = (itemId: string) => {
    setIsSidebarVisible(false);
    
    if (!building) {
      return;
    }
    
    // Navegación según el item presionado
    switch (itemId) {
      case 'identificacion':
        // Navegar al detalle del edificio
        if (building?.id) {
          router.push(`/building-detail?buildingId=${building.id}`);
        }
        break;
      // Temporarily hidden
      // case 'listado-usuarios':
      //   router.push(`/users?buildingId=${building.id}`);
      //   break;
      case 'enviar-email':
        router.push(`/send-email?buildingId=${building.id}`);
        break;
      case 'biblioteca':
        router.push(`/documents?buildingId=${building.id}`);
        break;
      case 'listado-comunicaciones':
        router.push(`/communications?buildingId=${building.id}`);
        break;
      case 'mis-edificios':
        router.push('/buildings');
        break;
      default:
        break;
    }
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleProfilePress = () => {
    setIsUserMenuVisible(true);
  };

  const handleUserMenuOptionPress = (option: UserMenuOption) => {
    switch (option) {
      case 'myBuildings':
        router.push('/buildings');
        break;
      case 'myData':
        router.push('/my-data');
        break;
      // Temporarily hidden
      // case 'alerts':
      //   router.push('/alerts');
      //   break;
      // case 'changePassword':
      //   router.push('/change-password');
      //   break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handleLogout = async () => {
    // Cerrar el menú primero
    setIsUserMenuVisible(false);
    try {
      // Limpiar todos los datos de autenticación
      await storageService.clearAuthData();
      // Navegar al login
      router.replace('/login');
    } catch {
      // Error al hacer logout - navegar al login aunque haya error
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Global - SIEMPRE */}
      <GlobalHeader
        variant="navigation"
        title={getHeaderTitle()}
        onBackPress={handleBackPress}
        notificationCount={notificationCount}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
        hideBackButton={isBuildingLogin}
      />

      {/* Título + Menú - SIEMPRE */}
      <View style={styles.titleSection}>
        <Text style={styles.buildingTitle}>{building?.title || t('loading', 'common')}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress} disabled={!building}>
          <Ionicons name="menu" size={32} color={building ? "#333333" : "#CCCCCC"} />
        </TouchableOpacity>
      </View>

      {/* Contenido que CAMBIA */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Sidebar - SIEMPRE */}
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={handleSidebarClose}
        onItemPress={handleSidebarItemPress}
        currentRoute={pathname}
        buildingData={buildingDetailData}
      />

      {/* Menú de usuario */}
      <UserMenu
        visible={isUserMenuVisible}
        onClose={() => setIsUserMenuVisible(false)}
        onOptionPress={handleUserMenuOptionPress}
      />
    </View>
  );
};
