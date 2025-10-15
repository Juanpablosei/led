import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './Sidebar.styles';
import { SidebarItem, SidebarProps } from './Sidebar.types';

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onItemPress, currentRoute, buildingData }) => {
  const { t } = useTranslation();
  
  // Función para determinar qué sección debe estar expandida basándose en la ruta
  const getExpandedSection = (route: string): string => {
    const routeMap: { [key: string]: string } = {
      '/building-detail': 'edificio',
      '/send-email': 'usuarios',
      '/users': 'usuarios',
      '/documents': 'documentacion',
      '/communications': 'comunicacion',
    };
    
    return routeMap[route] || 'edificio'; // Por defecto 'edificio'
  };
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([getExpandedSection(currentRoute || '')])
  );

  // Actualizar las secciones expandidas cuando cambie la ruta
  useEffect(() => {
    if (currentRoute) {
      const sectionToExpand = getExpandedSection(currentRoute);
      setExpandedSections(new Set([sectionToExpand]));
    }
  }, [currentRoute]);

  // Función para verificar si el usuario tiene permisos de gestión de usuarios
  const hasUserManagementPermissions = (): boolean => {
    if (!buildingData?.perfil_llibre) return false;
    
    // Solo pueden ver usuarios y comunicación si tienen perfil_llibre con IDs 1, 3, o 4
    const allowedIds = [1, 3, 4];
    return buildingData.perfil_llibre.some((perfil: any) => 
      allowedIds.includes(perfil.id)
    );
  };

  const allSidebarItems: SidebarItem[] = [
    {
      id: 'edificio',
      title: t('building', 'sidebar'),
      icon: 'business-outline',
      isExpanded: true,
      children: [
        { id: 'identificacion', title: t('identification', 'sidebar'), icon: 'information-circle-outline' },
      ],
    },
    {
      id: 'usuarios',
      title: t('users', 'sidebar'),
      icon: 'people-outline',
      children: [
        // Temporarily hidden
        // { id: 'listado-usuarios', title: t('userList', 'sidebar'), icon: 'list-outline' },
        { id: 'enviar-email', title: t('sendEmail', 'sidebar'), icon: 'mail-outline' },
      ],
    },
    {
      id: 'documentacion',
      title: t('documentation', 'sidebar'),
      icon: 'document-text-outline',
      children: [
        { id: 'biblioteca', title: t('documentLibrary', 'sidebar'), icon: 'library-outline' },
      ],
    },
    {
      id: 'comunicacion',
      title: t('communication', 'sidebar'),
      icon: 'mail-outline',
      children: [
        { id: 'listado-comunicaciones', title: t('communicationList', 'sidebar'), icon: 'chatbubbles-outline' },
      ],
    },
  ];

  // Filtrar elementos del sidebar basándose en los permisos del usuario
  const sidebarItems = allSidebarItems.filter((item) => {
    // Siempre mostrar 'edificio' y 'documentacion'
    if (item.id === 'edificio' || item.id === 'documentacion') {
      return true;
    }
    
    // Solo mostrar 'usuarios' y 'comunicacion' si el usuario tiene permisos
    if (item.id === 'usuarios' || item.id === 'comunicacion') {
      return hasUserManagementPermissions();
    }
    
    return true;
  });

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isItemActive = (itemId: string): boolean => {
    if (!currentRoute) return false;
    
    // Mapear las rutas a los IDs del sidebar
    const routeMap: { [key: string]: string } = {
      '/building-detail': 'identificacion',
      '/send-email': 'enviar-email',
      '/documents': 'biblioteca',
      '/communications': 'listado-comunicaciones',
      '/users': 'listado-usuarios',
    };
    
    return routeMap[currentRoute] === itemId;
  };

  const handleItemPress = (itemId: string) => {
    console.log('Sidebar item pressed:', itemId);
    onItemPress?.(itemId);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarContent}>
              {sidebarItems.map((section) => (
                <View key={section.id} style={styles.section}>
                  <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.id)}
                  >
                    <Ionicons
                      name={section.icon as any}
                      size={20}
                      color={colors.text}
                      style={styles.sectionIcon}
                    />
                    <View style={styles.sectionTitle}>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    <Ionicons
                      name={expandedSections.has(section.id) ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.text}
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>

                  {expandedSections.has(section.id) && section.children && (
                    <View style={styles.sectionContent}>
                      {section.children.map((child) => (
                        <TouchableOpacity
                          key={child.id}
                          style={[
                            styles.sectionItem,
                            isItemActive(child.id) && styles.sectionItemActive,
                          ]}
                          onPress={() => handleItemPress(child.id)}
                        >
                          <Ionicons
                            name={child.icon as any}
                            size={16}
                            color={isItemActive(child.id) ? colors.white : colors.text}
                          />
                          <Text
                            style={[
                              styles.sectionItemText,
                              isItemActive(child.id) && styles.sectionItemTextActive,
                            ]}
                          >
                            {child.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
