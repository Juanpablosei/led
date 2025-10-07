import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './GlobalHeader.styles';
import { GlobalHeaderProps } from './GlobalHeader.types';

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  variant,
  title,
  onBackPress,
  notificationCount = 0,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Sección izquierda */}
      <View style={styles.leftSection}>
        {variant === 'logo' ? (
          // Variante con logo LED
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ) : (
          // Variante con navegación
          <>
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            {title && <Text style={styles.title}>{title}</Text>}
          </>
        )}
      </View>

      {/* Sección derecha: Notificaciones y Perfil */}
      <View style={styles.rightSection}>
        {/* Botón de notificaciones */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onNotificationPress}
        >
          <Ionicons name="notifications" size={32} color="#FFFFFF" />
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
          <Ionicons name="person" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
