import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
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
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Asunto */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('detail.subject', 'notifications')}:</Text>
                  <Text style={styles.value}>{notification.subject}</Text>
                </View>

                <View style={styles.divider} />

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

                {/* Botón Marcar como leída - Solo para edificios y actividades */}
                {showMarkAsReadButton && (
                  <TouchableOpacity style={styles.markAsReadButton} onPress={handleMarkAsRead}>
                    <Text style={styles.markAsReadButtonText}>Marcar como leída</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

