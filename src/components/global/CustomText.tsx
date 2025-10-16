import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { fonts } from '../../constants/fonts';

interface CustomTextProps extends RNTextProps {
  fontFamily?: string;
}

export const CustomText: React.FC<CustomTextProps> = ({ 
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

// Exportar como Text por defecto
export const Text = CustomText;