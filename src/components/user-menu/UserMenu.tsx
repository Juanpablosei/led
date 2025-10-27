import { router } from 'expo-router';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { storageService } from '../../services/storageService';
import { styles } from './UserMenu.styles';
import { UserMenuProps } from './UserMenu.types';

export const UserMenu: React.FC<UserMenuProps> = ({
  visible,
  onClose,
  onOptionPress,
  position = { top: 60, right: 10 },
}) => {
  const { t } = useTranslation();

  const handleOptionPress = (option: 'myData' | 'myBuildings' | 'alerts' | 'logout') => {
    onOptionPress(option);
    // No cerrar automáticamente para logout, que se cierre desde el componente padre
    if (option !== 'logout') {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.menu, { top: position.top, right: position.right }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleOptionPress('myBuildings')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('menu.myBuildings', 'user')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleOptionPress('myData')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('menu.myData', 'user')}</Text>
            </TouchableOpacity>

            {/* Temporarily hidden
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleOptionPress('alerts')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('menu.alerts', 'user')}</Text>
            </TouchableOpacity>
            */}


            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={async () => {
                try {
                  // Cerrar el menú primero
                  onClose();
                  // Limpiar datos de autenticación
                  await storageService.clearAuthData();
                  // Navegar al login
                  router.replace('/login');
                } catch (error) {
                  console.error('Error al hacer logout:', error);
                  router.replace('/login');
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.menuItemText, styles.logoutText]}>{t('menu.logout', 'user')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

