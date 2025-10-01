import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './Sidebar.styles';
import { SidebarItem, SidebarProps } from './Sidebar.types';

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onItemPress }) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['edificio']));

  const sidebarItems: SidebarItem[] = [
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
        { id: 'listado-usuarios', title: t('userList', 'sidebar'), icon: 'list-outline' },
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

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
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
                            child.id === 'identificacion' && styles.sectionItemActive,
                          ]}
                          onPress={() => handleItemPress(child.id)}
                        >
                          <Ionicons
                            name={child.icon as any}
                            size={16}
                            color={child.id === 'identificacion' ? colors.white : colors.text}
                          />
                          <Text
                            style={[
                              styles.sectionItemText,
                              child.id === 'identificacion' && styles.sectionItemTextActive,
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
