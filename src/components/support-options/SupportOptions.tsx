import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './SupportOptions.styles';
import { SupportOptionsProps } from './SupportOptions.types';

export const SupportOptions: React.FC<SupportOptionsProps> = ({
  visible,
  onClose,
  onFaqsPress,
  onLegalPress,
  onTermsPress,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.supportModal}>
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={onFaqsPress}
          >
            <Text style={styles.supportOptionText}>{t('faqs', 'common')}</Text>
            <Text style={styles.supportIcon}>↗</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={onLegalPress}
          >
            <Text style={styles.supportOptionText}>{t('legalNotice', 'common')}</Text>
            <Text style={styles.supportIcon}>↗</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={onTermsPress}
          >
            <Text style={styles.supportOptionText}>{t('terms', 'common')}</Text>
            <Text style={styles.supportIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
