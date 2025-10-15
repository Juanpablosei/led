import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 60, // Aumentado para evitar superposición con botones de navegación en Android
  },
  totalText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  pageNumber: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  pageNumberActive: {
    backgroundColor: colors.lightGray,
  },
  pageNumberText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  pageNumberTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
