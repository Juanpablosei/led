import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GlobalHeader } from '../components/global/GlobalHeader';
import { Sidebar } from '../components/sidebar/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './BuildingLayout.styles';
import { BuildingLayoutProps } from './BuildingLayout.types';

export const BuildingLayout: React.FC<BuildingLayoutProps> = ({ building, children }) => {
  const { t } = useTranslation();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleMenuPress = () => {
    setIsSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  const handleSidebarItemPress = (itemId: string) => {
    console.log('Sidebar item pressed:', itemId);
    setIsSidebarVisible(false);
    
    // Navegación según el item presionado
    switch (itemId) {
      case 'identificacion':
        // Ya estamos en la pantalla de identificación
        break;
      case 'listado-usuarios':
        router.push(`/users?buildingId=${building.id}`);
        break;
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

  return (
    <View style={styles.container}>
      {/* Header Global - SIEMPRE */}
      <GlobalHeader
        variant="navigation"
        title={t('myBuildings', 'navigation')}
        onBackPress={() => router.back()}
      />

      {/* Título + Menú - SIEMPRE */}
      <View style={styles.titleSection}>
        <Text style={styles.buildingTitle}>{building.title}</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={32} color="#333333" />
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
    </View>
  );
};
