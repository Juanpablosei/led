import { StyleSheet } from 'react-native';

export const colors = {
  background: '#E95460',
  white: '#FFFFFF',
  black: '#000000',
  textSecondary: '#666666',
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
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
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageBackground: {
    flex: 1, // Ocupa toda la pantalla
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(194, 34, 37, 0.8)', // Semi-transparent overlay
  },
  whiteOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%', // Altura base para el efecto diagonal más intenso
    width: '110%',
    backgroundColor: colors.white,
    zIndex: 2, // Por encima de la imagen
    // Crear el efecto diagonal más intenso
    transform: [{ skewY: '-9deg' }], // Inclinación diagonal más pronunciada
    transformOrigin: 'bottom left',
    overflow: 'hidden',
  },
  whiteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%', // Cubre la parte inferior completamente
    width: '100%',
    backgroundColor: colors.white,
    zIndex: 1, // Por encima de la imagen pero debajo del diagonal
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3, // Por encima de todo
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    
  },
  footerText: {
    fontSize: 16,
    marginBottom:16,
    marginHorizontal:4, 
    fontWeight: 500,
    color: colors.black,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  supportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    color: colors.black,
    paddingBottom: 10,
  },
});
