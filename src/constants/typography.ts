import { fonts } from './fonts';

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    fontFamily: fonts.aeonik.bold, // Aeonik Bold para títulos
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: fonts.aeonik.bold, // Aeonik Bold para subtítulos
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    fontFamily: fonts.aeonik.regular, // Aeonik Regular por defecto
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    fontFamily: fonts.aeonik.regular, // Aeonik Regular por defecto
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    fontFamily: fonts.aeonik.bold, // Aeonik Bold para botones
    textTransform: 'uppercase' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    fontFamily: fonts.aeonik.light, // Aeonik Light para texto pequeño
  },
};
