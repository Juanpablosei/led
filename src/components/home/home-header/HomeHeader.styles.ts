import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop:30,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
  },
  logoIcon: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.white,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 20,
    padding: 8,
  },
  notificationIcon: {
    // Icono manejado por Ionicons
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 2,
    paddingHorizontal: 4,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 8,
  },
  profileIcon: {
    // Icono manejado por Ionicons
  },
});
