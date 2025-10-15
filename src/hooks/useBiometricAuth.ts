import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export const useBiometricAuth = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (compatible && enrolled) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setIsAvailable(true);
        setBiometricType(types);
      } else {
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const authenticateWithBiometric = async (): Promise<BiometricAuthResult> => {
    if (!isAvailable) {
      return {
        success: false,
        error: 'Autenticación biométrica no disponible'
      };
    }

    setIsLoading(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación requerida',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        let errorMessage = 'Autenticación cancelada';
        
        // Verificar si el resultado tiene la propiedad error
        if ('error' in result && result.error) {
          if (result.error === 'user_cancel') {
            errorMessage = 'Autenticación cancelada por el usuario';
          } else if (result.error === 'system_cancel') {
            errorMessage = 'Autenticación cancelada por el sistema';
          } else if (result.error === 'not_available') {
            errorMessage = 'Autenticación biométrica no disponible';
          }
        }

        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Error en la autenticación biométrica'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometricIcon = (): string => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'scan-outline';
    } else if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'finger-print-outline';
    } else if (biometricType.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'scan-outline';
    }
    return 'shield-checkmark-outline';
  };

  const getBiometricLabel = (): string => {
    if (biometricType.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    } else if (biometricType.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID';
    } else if (biometricType.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    }
    return 'Biometría';
  };

  return {
    isAvailable,
    biometricType,
    isLoading,
    authenticateWithBiometric,
    getBiometricIcon,
    getBiometricLabel,
    checkBiometricAvailability
  };
};
