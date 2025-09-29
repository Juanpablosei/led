import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E95460',
  white: '#FFFFFF',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const typography = {
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: '#333333',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    color: '#666666',
  },
};

export const spacing = {
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  lg: 12,
  sm: 4,
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent', // Sin fondo, los componentes internos tienen su propio fondo
    width: '100%',
    maxWidth: 560,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
});