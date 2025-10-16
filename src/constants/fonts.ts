export const fonts = {
  // Fuentes del sistema (fallback)
  regular: 'System',
  bold: 'System',
  light: 'System',
  
  // Fuentes personalizadas Aeonik
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
