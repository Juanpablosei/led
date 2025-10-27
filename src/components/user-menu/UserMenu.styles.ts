import { Platform, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? -34 : 40,
    left: 0,
    right:-10,
    bottom: 0,
    zIndex: 9999,
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 15,
    minWidth: 200,
    overflow: 'visible',
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  logoutText: {
    color: colors.text,
  },
});

