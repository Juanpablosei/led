import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { Pagination } from '../components/home/pagination/Pagination';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { BuildingDetailData, buildingService, Communication } from '../services/buildingService';
import { styles } from './CommunicationsScreen.styles';

export const CommunicationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const buildingId = params.buildingId as string;

  // Función para descargar archivos adjuntos
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
  
  const [buildingDetail, setBuildingDetail] = useState<BuildingDetailData | null>(null);
  const [isLoadingBuilding, setIsLoadingBuilding] = useState(true);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const { width } = useWindowDimensions();

  const loadBuilding = async () => {
    if (!buildingId) return;
    
    setIsLoadingBuilding(true);
    try {
      const response = await buildingService.getBuildingById(Number(buildingId));
      if (response.status && 'data' in response) {
        setBuildingDetail(response.data);
      }
    } catch (error) {
      console.error('Error al cargar edificio:', error);
    } finally {
      setIsLoadingBuilding(false);
    }
  };

  const loadCommunications = async () => {
    setIsLoading(true);
    try {
      const response = await buildingService.getBuildingCommunications(
        parseInt(buildingId),
        currentPage,
        15
      );

      if (response.status && 'data' in response) {
        setCommunications(response.data.data);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
      } else {
        console.error('Error al cargar comunicaciones');
      }
    } catch (error) {
      console.error('Error al cargar comunicaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBuilding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingId]);

  useEffect(() => {
    if (buildingId) {
      loadCommunications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingId, currentPage]);


  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };


  const handleViewDetails = (commId: number) => {
    const comm = communications.find(c => c.id === commId);
    if (comm) {
      setSelectedCommunication(comm);
      setShowDetailsModal(true);
    }
  };

  const handleViewRecipients = (commId: number) => {
    const comm = communications.find(c => c.id === commId);
    if (comm) {
      setSelectedCommunication(comm);
      setShowRecipientsModal(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (isLoadingBuilding || isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.text }}>
            {t('loading', 'common')}
          </Text>
        </View>
      );
    }

    if (communications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t('noCommunications', 'communications')}
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.listContainer}>
          {/* Lista de comunicaciones */}
          {communications.map((comm, index) => (
            <View
              key={comm.id}
              style={[
                styles.cardContainer,
                index % 2 === 1 && styles.cardContainerEven,
              ]}
            >

              {/* Contenido principal */}
              <View style={styles.cardContent}>
                {/* Fecha */}
                <View style={styles.cardDateRow}>
                  <Ionicons name="calendar-outline" size={16} color="#999" />
                  <Text style={styles.cardDateText}>{formatDate(comm.data_enviada)}</Text>
                </View>

                {/* Asunto */}
                <Text style={styles.cardSubjectText} numberOfLines={2}>
                  {comm.assumpte}
                </Text>
                
                {/* Info inferior */}
                <View style={styles.cardFooter}>
                  <View style={styles.cardFooterItem}>
                    <Ionicons name="person-outline" size={14} color="#666" />
                    <Text style={styles.cardFooterText}>{`${comm.first_name} ${comm.last_name}`}</Text>
                  </View>
                  <View style={styles.cardFooterItem}>
                    <Ionicons name="people-outline" size={14} color="#666" />
                    <Text style={styles.cardFooterText}>{comm.total_comunicacions} {t('recipients', 'communications').toLowerCase()}</Text>
                  </View>
                </View>

                {/* Botones de acción siempre visibles */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewDetails(comm.id)}
                  >
                    <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>{t('viewMessage', 'communications')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                    onPress={() => handleViewRecipients(comm.id)}
                  >
                    <Ionicons name="people-outline" size={18} color={colors.primary} />
                    <Text style={styles.actionButtonTextSecondary}>{t('recipients', 'communications')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

      </>
    );
  };

  return (
    <BuildingLayout
      building={
        buildingDetail
          ? {
              id: String(buildingDetail.id),
              title: buildingDetail.nom,
              type: buildingDetail.tipus_edifici || '',
              buildingId: String(buildingDetail.id),
              cadastralReference: buildingDetail.ref_cadastral || '',
              imageUrl: buildingDetail.imagen?.ruta || undefined,
            }
          : null
      }
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Paginación - Siempre en la parte inferior */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />

      {/* Modal de detalles del mensaje */}
      <Modal
        visible={showDetailsModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('messageDetails', 'communications')}</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedCommunication && (
                <>
                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>{t('subject', 'communications')}:</Text>
                    <Text style={styles.modalValue}>{selectedCommunication.assumpte}</Text>
                  </View>

                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>{t('sendDate', 'communications')}:</Text>
                    <Text style={styles.modalValue}>{formatDate(selectedCommunication.data_enviada)}</Text>
                  </View>

                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>{t('sentBy', 'communications')}:</Text>
                    <Text style={styles.modalValue}>
                      {`${selectedCommunication.first_name} ${selectedCommunication.last_name}`}
                    </Text>
                  </View>

                  <View style={styles.modalField}>
                    <Text style={styles.modalLabel}>{t('message', 'communications')}:</Text>
                    <RenderHTML
                      contentWidth={width - 80}
                      source={{ html: selectedCommunication.message }}
                      tagsStyles={{
                        body: { color: colors.text, fontSize: 14, lineHeight: 20 },
                        p: { marginTop: 0, marginBottom: 8 },
                        a: { color: colors.primary, textDecorationLine: 'underline' },
                      }}
                    />
                  </View>

                  {selectedCommunication.adjuntos && selectedCommunication.adjuntos.length > 0 && (
                    <View style={styles.modalField}>
                      <Text style={styles.modalLabel}>{t('attachments', 'communications')}:</Text>
                      {selectedCommunication.adjuntos.map((adjunto, index) => (
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
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de destinatarios */}
      <Modal
        visible={showRecipientsModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowRecipientsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('recipients', 'communications')} ({selectedCommunication?.total_comunicacions || 0})</Text>
              <TouchableOpacity onPress={() => setShowRecipientsModal(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedCommunication?.destinatarios && selectedCommunication.destinatarios.map((dest, index) => (
                <View key={dest.id} style={styles.recipientItem}>
                  <View style={styles.recipientIcon}>
                    <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
                  </View>
                  <View style={styles.recipientInfo}>
                    <Text style={styles.recipientEmail}>{dest.destinatari_email}</Text>
                    <View style={styles.recipientStatus}>
                      <Ionicons 
                        name={dest.estat === 'enviada' ? 'checkmark-circle' : 'alert-circle'} 
                        size={16} 
                        color={dest.estat === 'enviada' ? '#4CAF50' : '#FF9800'} 
                      />
                      <Text style={[
                        styles.recipientStatusText,
                        { color: dest.estat === 'enviada' ? '#4CAF50' : '#FF9800' }
                      ]}>
                        {dest.estat === 'enviada' ? 'Enviado' : dest.estat}
                      </Text>
                      {dest.leido && (
                        <>
                          <Ionicons name="eye" size={16} color="#2196F3" style={{ marginLeft: 8 }} />
                          <Text style={[styles.recipientStatusText, { color: '#2196F3' }]}>Leído</Text>
                        </>
                      )}
                    </View>
                    {dest.data_enviada && (
                      <Text style={styles.recipientDate}>{formatDate(dest.data_enviada)}</Text>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </BuildingLayout>
  );
};
