export const fonts = {
  // Fuentes personalizadas Aeonik (por defecto)
  regular: 'Aeonik-Regular',
  bold: 'Aeonik-Bold',
  light: 'Aeonik-Light',
  
  // Fuentes del sistema (fallback)
  system: {
    regular: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Fuentes personalizadas Aeonik (todas las variantes)
  custom: {
    regular: 'Aeonik-Regular',
    bold: 'Aeonik-Bold', 
    light: 'Aeonik-Light',
    regularItalic: 'Aeonik-RegularItalic',
    boldItalic: 'Aeonik-BoldItalic',
    lightItalic: 'Aeonik-LightItalic',
  }
};

// Función para obtener la fuente según el peso y estilo
export const getFontFamily = (
  weight: 'regular' | 'bold' | 'light' = 'regular',
  italic: boolean = false
) => {
  const baseWeight = weight;
  const fontKey = italic ? `${baseWeight}Italic` : baseWeight;
  return fonts.custom[fontKey] || fonts.custom[baseWeight] || fonts[baseWeight];
};

// Función para obtener fuente del sistema (fallback)
export const getSystemFontFamily = (
  weight: 'regular' | 'bold' | 'light' = 'regular'
) => {
  return fonts.system[weight];
};
