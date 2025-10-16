import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { getFontFamily } from '../../constants/fonts';

interface CustomTextProps extends TextProps {
  weight?: 'regular' | 'bold' | 'light';
  italic?: boolean;
}

export const CustomText: React.FC<CustomTextProps> = ({
  weight = 'regular',
  italic = false,
  style,
  children,
  ...props
}) => {
  const fontFamily = getFontFamily(weight, italic);
  
  return (
    <Text
      style={[
        styles.baseText,
        { fontFamily },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    // Estilos base que se aplicarán a todos los textos
  },
});
