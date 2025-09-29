import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../buttons/Button';
import { styles } from './RegistrationSection.styles';
import { RegistrationSectionProps } from './RegistrationSection.types';

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onRegister,
}) => {
  const handleRegister = () => {
    onRegister();
  };

  return (
    <View style={styles.registrationContainer}>
      <Text style={styles.description}>
        Si no dispones de un nombre de usuario y contraseña debes registrarte para acceder
      </Text>

      <Button
        title="REGISTRATE"
        onPress={handleRegister}
        variant="secondary"
      />
    </View>
  );
};
