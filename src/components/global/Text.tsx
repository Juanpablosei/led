import React from 'react';
import { Platform, Text as RNText, TextProps as RNTextProps } from 'react-native';
import { fonts } from '../../constants/fonts';

interface TextProps extends RNTextProps {
  fontFamily?: string;
}

export const Text: React.FC<TextProps> = ({ 
  style, 
  fontFamily = fonts.aeonik.regular, // Aeonik por defecto
  ...props 
}) => {
  // Log para detectar la fuente que se está usando
  React.useEffect(() => {
    console.log('🔤 Font Debug Info:');
    console.log('  - Platform:', Platform.OS);
    console.log('  - Android Version:', Platform.Version);
    console.log('  - Requested Font:', fontFamily);
    console.log('  - Default Font:', fonts.aeonik.regular);
    console.log('  - Available Fonts:', Object.keys(fonts));
    console.log('  - Final Style:', { fontFamily });
    console.log('  - Is Aeonik Regular?', fontFamily === 'Aeonik-Regular');
  }, [fontFamily]);

  return (
    <RNText 
      style={[
        { fontFamily }, // Aplicar fuente por defecto
        style
      ]} 
      {...props} 
    />
  );
};
