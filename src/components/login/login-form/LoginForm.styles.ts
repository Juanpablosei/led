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
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  lg: 12,
  sm: 4,
};

export const styles = StyleSheet.create({
  formWrapper: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
  },
  formContainer: {
    padding: spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  link: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  biometricButtonText: {
    ...typography.body,
    color: colors.primary,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
});
