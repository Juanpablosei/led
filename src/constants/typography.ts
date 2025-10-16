import { getFontFamily } from './fonts';

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    fontFamily: getFontFamily('bold'),
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: getFontFamily('bold'),
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    fontFamily: getFontFamily('regular'),
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    fontFamily: getFontFamily('regular'),
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    fontFamily: getFontFamily('bold'),
    textTransform: 'uppercase' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    fontFamily: getFontFamily('light'),
  },
};
