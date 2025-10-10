import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { authService, Building } from '../../../services/authService';
import { styles } from './ResetCodeModal.styles';
import { ResetCodeModalProps } from './ResetCodeModal.types';

export const ResetCodeModal: React.FC<ResetCodeModalProps> = ({
  visible,
  onClose,
  onResetCode,
}) => {
  const { t } = useTranslation();
  const [nif, setNif] = useState('');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [buildingsError, setBuildingsError] = useState('');

  // Detectar cuando el NIF tiene 8+ caracteres y hacer la petición automática
  useEffect(() => {
    const fetchBuildings = async () => {
      if (nif.length >= 8) {
        setIsLoadingBuildings(true);
        setBuildingsError('');
        setBuildings([]);
        setSelectedBuildingId(null);

        try {
          const response = await authService.forgotCode({ nif: nif.trim() });
          
          if ('success' in response && response.success && response.data) {
            setBuildings(response.data);
            setBuildingsError('');
          } else {
            setBuildingsError(response.message || 'No se encontraron edificios');
            setBuildings([]);
          }
        } catch (error) {
          setBuildingsError('Error al buscar edificios');
          setBuildings([]);
        } finally {
          setIsLoadingBuildings(false);
        }
      } else {
        setBuildings([]);
        setSelectedBuildingId(null);
        setBuildingsError('');
      }
    };

    // Debounce de 500ms para evitar demasiadas peticiones
    const timeoutId = setTimeout(fetchBuildings, 500);
    return () => clearTimeout(timeoutId);
  }, [nif]);

  const handleResetCode = () => {
    if (nif.trim() && selectedBuildingId !== null) {
      onResetCode(selectedBuildingId);
      handleClose();
    }
  };

  const handleClose = () => {
    setNif('');
    setBuildings([]);
    setSelectedBuildingId(null);
    setBuildingsError('');
    onClose();
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
            <Text style={styles.modalTitle}>{t('resetCodeTitle', 'auth')}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.modalContent}>
            <Text style={styles.descriptionText}>
              {t('resetCodeDescription', 'auth')}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('nifLabel', 'auth')} *</Text>
              <TextInput
                style={styles.textInput}
                value={nif}
                onChangeText={setNif}
                placeholder={t('nifPlaceholder', 'auth')}
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('buildingNumber', 'auth')} *</Text>
              
              {isLoadingBuildings && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#E53E3E" />
                  <Text style={styles.loadingText}>Buscando edificios...</Text>
                </View>
              )}

              {buildingsError && !isLoadingBuildings && (
                <Text style={styles.errorText}>{buildingsError}</Text>
              )}

              {buildings.length > 0 && !isLoadingBuildings && (
                <View style={styles.buildingsListContainer}>
                  <Text style={styles.buildingsCountText}>
                    {buildings.length} {buildings.length === 1 ? 'edificio encontrado' : 'edificios encontrados'}
                  </Text>
                  <ScrollView 
                    style={styles.buildingsList}
                    nestedScrollEnabled={true}
                  >
                    {buildings.map((building) => (
                      <TouchableOpacity
                        key={building.id}
                        style={[
                          styles.buildingItem,
                          selectedBuildingId === building.id && styles.buildingItemSelected
                        ]}
                        onPress={() => setSelectedBuildingId(building.id)}
                      >
                        <View style={styles.radioCircle}>
                          {selectedBuildingId === building.id && (
                            <View style={styles.radioCircleInner} />
                          )}
                        </View>
                        <View style={styles.buildingInfo}>
                          <Text style={styles.buildingName}>{building.nom}</Text>
                          <Text style={styles.buildingRef}>{building.ref_cadastral}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {nif.length > 0 && nif.length < 8 && (
                <Text style={styles.hintText}>
                  Ingrese al menos 8 caracteres del NIF
                </Text>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.resetButton, 
                (selectedBuildingId === null || !nif.trim()) && styles.resetButtonDisabled
              ]}
              onPress={handleResetCode}
              disabled={selectedBuildingId === null || !nif.trim()}
            >
              <Text style={styles.resetButtonText}>
                {t('resetCodeButton', 'auth')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
