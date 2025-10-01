import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, Text, View } from 'react-native';
import { styles } from './Toast.styles';
import { ToastProps } from './Toast.types';

export const Toast: React.FC<ToastProps> = ({ message, type, visible, onHide }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Aparecer
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Desaparecer después de 1 segundo
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />;
      case 'error':
        return <Ionicons name="close-circle" size={24} color="#FFFFFF" />;
      case 'warning':
        return <Ionicons name="warning" size={24} color="#FFFFFF" />;
      default:
        return <Ionicons name="information-circle" size={24} color="#FFFFFF" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        type === 'success' && styles.success,
        type === 'error' && styles.error,
        type === 'warning' && styles.warning,
        { opacity: fadeAnim },
      ]}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
};

