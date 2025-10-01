import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './NotificationDetailModal.styles';
import { NotificationDetailModalProps } from './NotificationDetailModal.types';

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  visible,
  notification,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!notification) return null;

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

                {/* Fecha enviado */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('detail.dateSent', 'notifications')}:</Text>
                  <Text style={styles.value}>{notification.dateSent}</Text>
                </View>

                {/* Remitente */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('detail.sender', 'notifications')}:</Text>
                  <Text style={styles.value}>{notification.sender}</Text>
                </View>

                <View style={styles.divider} />

                {/* Mensaje */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>{t('detail.message', 'notifications')}:</Text>
                  <Text style={styles.messageValue}>{notification.message}</Text>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

