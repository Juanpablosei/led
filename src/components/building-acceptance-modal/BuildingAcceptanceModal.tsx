import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { styles } from './BuildingAcceptanceModal.styles';
import { BuildingAcceptanceModalProps } from './BuildingAcceptanceModal.types';

export const BuildingAcceptanceModal: React.FC<BuildingAcceptanceModalProps> = ({
  visible,
  onClose,
  onAccept,
  onReject,
}) => {
  const { t } = useTranslation();
  const [contractAccepted, setContractAccepted] = useState(false);
  const [dataProtectionAccepted, setDataProtectionAccepted] = useState(false);

  const handleAccept = () => {
    if (contractAccepted && dataProtectionAccepted) {
      onAccept();
      // Reset checkboxes
      setContractAccepted(false);
      setDataProtectionAccepted(false);
    }
  };

  const handleReject = () => {
    onReject();
    // Reset checkboxes
    setContractAccepted(false);
    setDataProtectionAccepted(false);
  };

  const handleClose = () => {
    onClose();
    // Reset checkboxes
    setContractAccepted(false);
    setDataProtectionAccepted(false);
  };

  const handleContractLinkPress = () => {
    console.log('Abrir condiciones de contratación');
    // Aquí iría la navegación a las condiciones de contratación
  };

  const handleDataProtectionLinkPress = () => {
    console.log('Abrir protección de datos');
    // Aquí iría la navegación a la protección de datos
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('buildingAcceptanceTitle', 'auth')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.modalContent}>
            {/* Building Information */}
            <View style={styles.buildingInfo}>
              <Text style={styles.infoLabel}>{t('buildingName', 'auth')}</Text>
              <Text style={styles.infoValue}>{t('buildingNameValue', 'auth')}</Text>
              
              <Text style={styles.infoLabel}>{t('cadastralRef', 'auth')}</Text>
              <Text style={styles.infoValue}>{t('cadastralRefValue', 'auth')}</Text>
              
              <Text style={styles.infoLabel}>{t('creationDate', 'auth')}</Text>
              <Text style={styles.infoValue}>{t('creationDateValue', 'auth')}</Text>
            </View>

            {/* Assigned Profiles */}
            <View style={styles.profilesSection}>
              <Text style={styles.profilesTitle}>{t('assignedProfiles', 'auth')}</Text>
              <View style={styles.profilesList}>
                <Text style={styles.profileItem}>• {t('propertyAdministrator', 'auth')}</Text>
                <Text style={styles.profileItem}>• {t('maintenanceManager', 'auth')}</Text>
                <Text style={styles.profileItem}>• {t('communityBoard', 'auth')}</Text>
              </View>
            </View>

            {/* Legal Acceptance */}
            <View style={styles.legalSection}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setContractAccepted(!contractAccepted)}
              >
                <View style={[styles.checkbox, contractAccepted && styles.checkboxChecked]}>
                  {contractAccepted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>
                  {t('contractConditionsText', 'auth')}{' '}
                  <Text 
                    style={styles.linkText}
                    onPress={handleContractLinkPress}
                  >
                    {t('contractConditions', 'auth')}.
                  </Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setDataProtectionAccepted(!dataProtectionAccepted)}
              >
                <View style={[styles.checkbox, dataProtectionAccepted && styles.checkboxChecked]}>
                  {dataProtectionAccepted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxText}>
                  {t('dataProtectionText', 'auth')}{' '}
                  <Text 
                    style={styles.linkText}
                    onPress={handleDataProtectionLinkPress}
                  >
                    {t('dataProtection', 'auth')}.
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.rejectButton}
                onPress={handleReject}
              >
                <Text style={styles.rejectButtonText}>
                  {t('rejectButton', 'auth')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.acceptButton,
                  (!contractAccepted || !dataProtectionAccepted) && styles.acceptButtonDisabled
                ]}
                onPress={handleAccept}
                disabled={!contractAccepted || !dataProtectionAccepted}
              >
                <Text style={styles.acceptButtonText}>
                  {t('acceptButton', 'auth')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
