import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  textPrimary: '#333333',
};

export const typography = {
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: '#333333',
  },
};

export const spacing = {
  lg: 24,
  xl: 32,
};

export const styles = StyleSheet.create({
  registrationContainer: {
    backgroundColor: colors.white,
    padding: spacing.xl,
   
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    color: colors.textPrimary,
  },
});
