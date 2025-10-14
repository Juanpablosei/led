import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isBuildingLogin, setIsBuildingLogin] = useState(false);

  // Verificar tipo de login
  useEffect(() => {
    checkLoginType();
  }, []);

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
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const handleMenuPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  const handleSidebarItemPress = (itemId: string) => {
    console.log('Sidebar item pressed:', itemId);
    setIsSidebarVisible(false);
    
    if (!building) {
      console.log('No hay building disponible');
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
      case 'myData':
        router.push('/my-data');
        break;
      // Temporarily hidden
      // case 'alerts':
      //   router.push('/alerts');
      //   break;
      case 'changePassword':
        router.push('/change-password');
        break;
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
    } catch (error) {
      console.error('Error al hacer logout:', error);
      // Navegar al login aunque haya error
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Global - SIEMPRE */}
      <GlobalHeader
        variant="navigation"
        title={t('myBuildings', 'navigation')}
        onBackPress={() => router.back()}
        notificationCount={notificationCount}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
        hideBackButton={isBuildingLogin}
      />

      {/* Título + Menú - SIEMPRE */}
      <View style={styles.titleSection}>
        <Text style={styles.buildingTitle}>{building?.title || 'Cargando...'}</Text>
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
