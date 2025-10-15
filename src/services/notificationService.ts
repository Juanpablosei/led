import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar cómo se manejan las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  deviceId: string;
  type: 'expo' | 'fcm' | 'apns';
}

export const notificationService = {
  /**
   * Obtener el ID único del dispositivo
   */
  getDeviceId(): string {
    // Usar el installationId de Expo que es único por instalación
    return Constants.sessionId || Constants.installationId || Device.osBuildId || 'unknown-device';
  },
  /**
   * Solicitar permisos de notificaciones al usuario
   */
  async requestPermissions(): Promise<boolean> {
    try {
      // Verificar si es un dispositivo físico
      if (!Device.isDevice) {
        return false;
      }

      // Verificar permisos actuales
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Si no están concedidos, solicitarlos
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Obtener el token de notificaciones push del dispositivo
   */
  async getPushToken(): Promise<PushNotificationToken | null> {
    try {
      // Primero verificar/solicitar permisos
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Configuración del canal de notificaciones para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#E95460',
        });
      }

      // Obtener el token de Expo Push Notifications
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'da21058d-d19b-4eab-85da-39bb32e96140', // Tu project ID de app.json
      });

      const deviceId = this.getDeviceId();

      return {
        token: tokenData.data,
        deviceId: deviceId,
        type: 'expo',
      };
    } catch {
      // Error al obtener token de notificaciones
      return null;
    }
  },

  /**
   * Configurar listener para notificaciones recibidas
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  },

  /**
   * Configurar listener para cuando el usuario toca una notificación
   */
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },

  /**
   * Limpiar badge de notificaciones
   */
  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch {
      // Error al limpiar badge
    }
  },
};

