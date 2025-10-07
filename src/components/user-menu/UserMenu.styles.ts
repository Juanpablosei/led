import { Platform, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: Platform.OS === 'android' ? -10 : 40,
    left: 0,
    right:-10,
    bottom: 0,
    zIndex: 9999,
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 200,
    overflow: 'hidden',
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
    color: colors.primary,
    fontWeight: 'bold',
  },
});

