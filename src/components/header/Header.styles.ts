import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export { colors };

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
};

export const spacing = {
  md: 16,
  xl: 32,
  sm: 8,
};

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    // paddingTop se aplicará dinámicamente desde el componente
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  logoText: {
    ...typography.title,
    fontSize: 26,
    fontWeight: 'bold' as const,
  },
  logoImage: {
    width: 60,
    height: 30,
  },
  logoAccent: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 20,
    color: colors.lightGray,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  body: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600' as const,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 16,
    // paddingTop se aplicará dinámicamente desde el componente
  },
  languageDropdownContainer: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: 16,
  },
  languageDropdown: {
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingVertical: 6,
    width: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  languageOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  languageOptionActive: {
    
  },
  languageOptionText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  languageOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
