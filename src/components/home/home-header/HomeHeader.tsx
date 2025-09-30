import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './HomeHeader.styles';
import { HomeHeaderProps } from './HomeHeader.types';

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  notificationCount = 0,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Logo LED */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>LED</Text>
        <View style={styles.logoIcon}>
          {/* Icono de cursor o A estilizada */}
          <Text style={{ color: 'white', fontSize: 16 }}>⌄</Text>
        </View>
      </View>

      {/* Sección derecha: Notificaciones y Perfil */}
      <View style={styles.rightSection}>
        {/* Botón de notificaciones */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications" size={36} color="#FFFFFF" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Botón de perfil */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onProfilePress}
        >
          <Ionicons name="person" size={36} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
