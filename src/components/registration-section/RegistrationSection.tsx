import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../buttons/Button';
import { styles } from './RegistrationSection.styles';
import { RegistrationSectionProps } from './RegistrationSection.types';

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  onRegister,
}) => {
  const { t } = useTranslation();

  const handleRegister = () => {
    onRegister();
  };

  return (
    <View style={styles.registrationContainer}>
      <Text style={styles.description}>
        {t('registrationDescription', 'auth')}
      </Text>

      <Button
        title={t('registerButton', 'auth')}
        onPress={handleRegister}
        variant="secondary"
      />
    </View>
  );
};
