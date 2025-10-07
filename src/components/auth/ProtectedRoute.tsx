import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.primary 
      }}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={{ 
          color: colors.white, 
          marginTop: 16, 
          fontSize: 16 
        }}>
          Verificando autenticación...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Se redirigirá automáticamente al login
  }

  return <>{children}</>;
};
