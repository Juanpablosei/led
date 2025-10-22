import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { TermsAndConditionsModal } from '../modals/TermsAndConditionsModal';
import { styles } from './BuildingAcceptanceModal.styles';
import { BuildingAcceptanceModalProps } from './BuildingAcceptanceModal.types';

export const BuildingAcceptanceModal: React.FC<BuildingAcceptanceModalProps> = ({
  visible,
  onClose,
  onAccept,
  onReject,
  building,
  roles = [],
}) => {
  const { t } = useTranslation();
  const [contractAccepted, setContractAccepted] = useState(false);
  const [dataProtectionAccepted, setDataProtectionAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentTermsType, setCurrentTermsType] = useState<'contract' | 'dataProtection' | null>(null);

  const handleAccept = () => {
    if (contractAccepted && dataProtectionAccepted) {
      onAccept();
      // No resetear checkboxes aquí, se hará cuando se cierre el modal
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
    setCurrentTermsType('contract');
    setShowTermsModal(true);
  };

  const handleDataProtectionLinkPress = () => {
    setCurrentTermsType('dataProtection');
    setShowTermsModal(true);
  };

  const handleTermsAccept = () => {
    if (currentTermsType === 'contract') {
      setContractAccepted(true);
    } else if (currentTermsType === 'dataProtection') {
      setDataProtectionAccepted(true);
    }
    setShowTermsModal(false);
    setCurrentTermsType(null);
  };

  const handleTermsReject = () => {
    setShowTermsModal(false);
    setCurrentTermsType(null);
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
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Building Information */}
            <View style={styles.buildingInfo}>
              <Text style={styles.infoLabel}>{t('buildingName', 'auth')}</Text>
              <Text style={styles.infoValue}>{building?.nom || '-'}</Text>
              
              <Text style={styles.infoLabel}>{t('cadastralRef', 'auth')}</Text>
              <Text style={styles.infoValue}>{building?.ref_cadastral || '-'}</Text>
              
              <Text style={styles.infoLabel}>{t('creationDate', 'auth')}</Text>
              <Text style={styles.infoValue}>
                {building?.created_at ? new Date(building.created_at).toLocaleDateString() : '-'}
              </Text>
            </View>

            {/* Assigned Profiles */}
            <View style={styles.profilesSection}>
              <Text style={styles.profilesTitle}>{t('assignedProfiles', 'auth')}</Text>
              <View style={styles.profilesList}>
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <Text key={index} style={styles.profileItem}>
                      • {role.role_idioma.nom}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.profileItem}>• {t('noProfilesAssigned', 'auth')}</Text>
                )}
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
          </ScrollView>

          {/* Action Buttons - Fixed at bottom */}
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

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        visible={showTermsModal}
        onClose={handleTermsReject}
        onAccept={handleTermsAccept}
        onReject={handleTermsReject}
      />
    </Modal>
  );
};
