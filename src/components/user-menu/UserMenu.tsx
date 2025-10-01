import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './UserMenu.styles';
import { UserMenuProps } from './UserMenu.types';

export const UserMenu: React.FC<UserMenuProps> = ({
  visible,
  onClose,
  onOptionPress,
  position = { top: 60, right: 10 },
}) => {
  const { t } = useTranslation();

  const handleOptionPress = (option: 'myData' | 'userType' | 'alerts' | 'changePassword') => {
    onOptionPress(option);
    onClose();
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
              onPress={() => handleOptionPress('myData')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('menu.myData', 'user')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleOptionPress('userType')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('menu.userType', 'user')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleOptionPress('alerts')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('menu.alerts', 'user')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={() => handleOptionPress('changePassword')}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemText}>{t('menu.changePassword', 'user')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

