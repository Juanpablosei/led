import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E95460',
  white: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const typography = {
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    textTransform: 'uppercase' as const,
  },
};

export const spacing = {
  md: 16,
};

export const borderRadius = {
  md: 8,
};

export const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    ...typography.button,
    color: colors.white,
  },
  buttonTextSecondary: {
    ...typography.button,
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
