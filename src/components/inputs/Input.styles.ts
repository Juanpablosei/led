import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#E95460',
  textPrimary: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

export const typography = {
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    color: '#333333',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  lg: 24,
};

export const styles = StyleSheet.create({
  inputContainer: {
    width: '100%', // Asegurar que el contenedor ocupe todo el ancho
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  input: {
    flex: 1, // Hacer que el input ocupe todo el ancho disponible
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderBottomColor: colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Asegurar que la fila ocupe todo el ancho
  },
  inputIcon: {
    position: 'absolute',
    right: 0,
    padding: spacing.sm,
  },
});
