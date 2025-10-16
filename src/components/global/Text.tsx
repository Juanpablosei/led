import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { fonts } from '../../constants/fonts';

interface TextProps extends RNTextProps {
  fontFamily?: string;
}

export const Text: React.FC<TextProps> = ({ 
  style, 
  fontFamily = fonts.aeonik.regular, // Aeonik por defecto
  ...props 
}) => {

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
