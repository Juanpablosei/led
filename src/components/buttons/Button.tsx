import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from './Button.styles';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
    ...(disabled ? [styles.buttonDisabled] : []),
  ];

  const textStyle: TextStyle[] = [
    styles.buttonText,
    ...(variant === 'secondary' ? [styles.buttonTextSecondary] : []),
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
