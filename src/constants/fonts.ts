// Constantes de fuentes - ahora se cargan automáticamente con useFonts
export const fonts = {
  // Fuentes Aeonik
  aeonik: {
    regular: 'Aeonik-Regular',
    bold: 'Aeonik-Bold',
    light: 'Aeonik-Light',
    regularItalic: 'Aeonik-RegularItalic',
    boldItalic: 'Aeonik-BoldItalic',
    lightItalic: 'Aeonik-LightItalic',
  },
  
  // Fuente Frijole
  frijole: 'Frijole-Regular',
  
  // Fuentes del sistema (fallback)
  system: {
    regular: 'System',
    bold: 'System',
    light: 'System',
  }
};

// Función simplificada para obtener fuentes
export const getFontFamily = (fontName: string) => {
  return fontName;
};
