import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Linking, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './NotificationDetailModal.styles';
import { NotificationDetailModalProps } from './NotificationDetailModal.types';

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  visible,
  notification,
  onClose,
  onMarkAsRead,
  showMarkAsReadButton = false,
}) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  if (!notification) return null;

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead();
    }
    onClose();
  };

  const handleDownloadAttachment = async (rutaAdjunt: string, nombreAdjunt: string) => {
    try {
      const canOpen = await Linking.canOpenURL(rutaAdjunt);
      if (canOpen) {
        await Linking.openURL(rutaAdjunt);
      } else {
        Alert.alert('Error', 'No se puede abrir este tipo de archivo');
      }
    } catch (error) {
      console.error('Error al abrir el archivo adjunto:', error);
      Alert.alert('Error', 'No se pudo abrir el archivo adjunto');
    }
  };

  const handleBuildingPress = (edificiId: number) => {
    // TODO: Navegar al detalle del edificio
    console.log('Navegar al edificio:', edificiId);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {notification.subject}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={true} bounces={true} alwaysBounceVertical={false}>
                {/* Asunto */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('detail.subject', 'notifications')}:</Text>
                  <Text style={styles.value}>{notification.subject}</Text>
                </View>

                <View style={styles.divider} />

                {/* Fecha de envío */}
                {notification.dateSent && (
                  <>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>{t('detail.dateSent', 'notifications')}:</Text>
                      <Text style={styles.value}>{notification.dateSent}</Text>
                    </View>
                    <View style={styles.divider} />
                  </>
                )}

                {/* Remitente */}
                {notification.sender && (
                  <>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>{t('detail.sender', 'notifications')}:</Text>
                      <Text style={styles.value}>{notification.sender}</Text>
                    </View>
                    <View style={styles.divider} />
                  </>
                )}

                {/* Mensaje - Renderizar como HTML */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('detail.message', 'notifications')}:</Text>
                  <RenderHTML
                    contentWidth={width - 80}
                    source={{ html: notification.message }}
                    tagsStyles={{
                      body: { color: colors.text, fontSize: 14, lineHeight: 20 },
                      p: { marginTop: 0, marginBottom: 8 },
                      a: { color: colors.primary, textDecorationLine: 'underline' },
                    }}
                  />
                </View>

                {/* Adjuntos */}
                {notification.adjuntos && notification.adjuntos.length > 0 && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>{t('attachments', 'communications')}:</Text>
                      {notification.adjuntos.map((adjunto, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.attachmentItem}
                          onPress={() => handleDownloadAttachment(adjunto.ruta_adjunt, adjunto.nombre_adjunt)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
                          <Text style={styles.attachmentName}>{adjunto.nombre_adjunt}</Text>
                          <Ionicons name="download-outline" size={16} color={colors.primary} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {/* Link al edificio */}
                {notification.edifici_id && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>{t('building', 'communications')}:</Text>
                      <TouchableOpacity 
                        onPress={() => handleBuildingPress(notification.edifici_id!)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.buildingLink}>
                          {notification.edifici_nom || `Edificio ${notification.edifici_id}`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {/* Botón Marcar como leída - Solo para edificios y actividades */}
                {showMarkAsReadButton && (
                  <TouchableOpacity style={styles.markAsReadButton} onPress={handleMarkAsRead}>
                    <Text style={styles.markAsReadButtonText}>Marcar como leída</Text>
                  </TouchableOpacity>
                )}

                {/* Espaciado al final */}
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

