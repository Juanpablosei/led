import { StyleSheet } from 'react-native';
import { fonts, getFontFamily } from './fonts';

// Estilos globales que se aplicarán a toda la aplicación
export const globalStyles = StyleSheet.create({
  // Estilos base para Text
  text: {
    fontFamily: fonts.regular,
  },
  textBold: {
    fontFamily: fonts.bold,
  },
  textLight: {
    fontFamily: fonts.light,
  },
  textItalic: {
    fontFamily: getFontFamily('regular', true),
  },
  textBoldItalic: {
    fontFamily: getFontFamily('bold', true),
  },
  textLightItalic: {
    fontFamily: getFontFamily('light', true),
  },
});

// Configuración global de fuentes para React Native
export const globalFontConfig = {
  // Configuración por defecto para todos los textos
  defaultFontFamily: fonts.regular,
  
  // Configuración para diferentes pesos
  fontWeights: {
    normal: fonts.regular,
    bold: fonts.bold,
    light: fonts.light,
  },
  
  // Configuración para estilos
  fontStyles: {
    normal: fonts.regular,
    italic: getFontFamily('regular', true),
  },
};
