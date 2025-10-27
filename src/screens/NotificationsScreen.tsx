import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  AlertCategory,
  AlertsSideMenu,
  NotificationDetailModal,
  NotificationItem,
  NotificationTabs,
  TabType
} from '../components/notifications';
import { NotificationDetailData } from '../components/notifications/NotificationDetailModal.types';
import { NotificationData } from '../components/notifications/NotificationItem.types';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { buildingService, NotificationsData } from '../services/buildingService';
import { styles } from './NotificationsScreen.styles';

export const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('communications');
  const [activeAlertCategory, setActiveAlertCategory] = useState<AlertCategory>('buildings');
  const [isAlertsMenuVisible, setIsAlertsMenuVisible] = useState(false);
  const [communicationsPage, setCommunicationsPage] = useState(1);
  const [buildingsPage, setBuildingsPage] = useState(1);
  const [homesPage, setHomesPage] = useState(1);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetailData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationsData, setNotificationsData] = useState<NotificationsData | null>(null);
  const [currentNotificationId, setCurrentNotificationId] = useState<string | null>(null);
  const [showMarkAsReadButton, setShowMarkAsReadButton] = useState(false);

  const itemsPerPage = 10;

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await buildingService.getNotifications(100, true);
      
      if (response.status && 'data' in response) {
        setNotificationsData(response.data);
      } else {
      }
    } catch (error) {
      console.error(' Error de red al cargar notificaciones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mapear comunicaciones
  const communications: NotificationData[] = notificationsData?.comunicaciones_no_leidas.comunicaciones.map((com) => ({
    id: String(com.id),
    title: com.assumpte,
    date: '', // No viene fecha en la respuesta
    isRead: com.leido !== null,
    buildingName: com.edifici_nom || undefined,
  })) || [];

  // Mapear edificios (documentos caducados del edificio)
  const buildings: NotificationData[] = notificationsData?.documentos_edificio_caducados.documentos 
    ? Object.values(notificationsData.documentos_edificio_caducados.documentos)
        .flat()
        .map((doc: any) => ({
          id: String(doc.id),
          title: `${doc.nom} - ${doc.texto || doc.tipus || doc.tipus_document}`,  // ← Nombre + texto (descripción)
          date: doc.data_validesa || doc.data_caducitat,
          isRead: true,
          buildingName: doc.edifici_nom || undefined,
        }))
    : [];

  // Mapear viviendas (documentos caducados de inmuebles)
  const homes: NotificationData[] = Array.isArray(notificationsData?.documentos_inmueble_caducados.documentos)
    ? notificationsData.documentos_inmueble_caducados.documentos.map((doc: any) => ({
        id: String(doc.id),
        title: `${doc.nom} - ${doc.texto || doc.tipus_document}`,  // ← Nombre + texto (descripción del tipo)
        date: doc.data_validesa || doc.data_caducitat,
        isRead: true,
        buildingName: doc.edifici_nom || undefined,
      }))
    : notificationsData?.documentos_inmueble_caducados.documentos
    ? Object.values(notificationsData.documentos_inmueble_caducados.documentos)
        .flat()
        .map((doc: any) => ({
          id: String(doc.id),
          title: `${doc.nom} - ${doc.texto || doc.tipus_document}`,  // ← Nombre + texto (descripción del tipo)
          date: doc.data_validesa || doc.data_caducitat,
          isRead: true,
          buildingName: doc.edifici_nom || undefined,
        }))
    : [];

  // Mapear actividades próximas
  const activities: NotificationData[] = notificationsData?.actividades_proximas.actividades
    ? Object.values(notificationsData.actividades_proximas.actividades)
        .flat()
        .map((act: any) => ({
          id: String(act.id),
          title: act.titol,  // ← Usar 'titol' en lugar de 'nom'
          date: act.data_inici_calculada,  // ← Usar 'data_inici_calculada'
          isRead: true,
          buildingName: act.edifici_nom || undefined,
        }))
    : [];

  // Paginación para comunicaciones
  const communicationsTotalPages = Math.ceil(communications.length / itemsPerPage);
  const getCurrentCommunications = () => {
    const startIndex = (communicationsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return communications.slice(startIndex, endIndex);
  };

  // Paginación para edificios
  const buildingsTotalPages = Math.ceil(buildings.length / itemsPerPage);
  const getCurrentBuildings = () => {
    const startIndex = (buildingsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return buildings.slice(startIndex, endIndex);
  };

  // Paginación para viviendas
  const homesTotalPages = Math.ceil(homes.length / itemsPerPage);
  const getCurrentHomes = () => {
    const startIndex = (homesPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return homes.slice(startIndex, endIndex);
  };

  // Paginación para actividades
  const activitiesTotalPages = Math.ceil(activities.length / itemsPerPage);
  const getCurrentActivities = () => {
    const startIndex = (activitiesPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return activities.slice(startIndex, endIndex);
  };

  const handleNotificationPress = async (id: string) => {
    try {
      if (activeTab === 'communications') {
        // Comunicaciones: GET del detalle
        
        const response = await buildingService.getComunicacionDetail(parseInt(id));
        
        if (response.status && 'data' in response) {
          const comunicacion = response.data;
          
          const notificationDetail: NotificationDetailData = {
            id: String(comunicacion.id),
            subject: comunicacion.assumpte,
            dateSent: comunicacion.data_enviada || null,
            sender: comunicacion.remitent_nom || null,
            message: comunicacion.message,
            edifici_id: comunicacion.edifici_id || null,
            edifici_nom: comunicacion.edifici_nom || comunicacion.nom || null,
            adjuntos: comunicacion.adjuntos || [],
          };
          
          setSelectedNotification(notificationDetail);
          setCurrentNotificationId(String(comunicacion.id));
          setShowMarkAsReadButton(false); // Comunicaciones no tienen botón
          setIsModalVisible(true);
          
          // Marcar como leída cuando se abre el modal
          if (!comunicacion.leido) {
            await buildingService.markComunicacionAsRead(comunicacion.id, true);
          }
        } else {
          console.error(' Error al obtener detalle:', response.message);
        }
      } else if (activeTab === 'alerts') {
        // Alertas: Manejar según la categoría activa
        if (activeAlertCategory === 'activities') {
          // Actividades: Buscar en los datos cargados
          const activity = Object.values(notificationsData?.actividades_proximas.actividades || {})
            .flat()
            .find((act: any) => String(act.id) === id);
          
          if (activity) {
            // Crear mensaje HTML con la información de la actividad
            const message = `
              <p><strong>Proyecto:</strong> ${activity.projecte_nom}</p>
              <p><strong>Tipo de Intervención:</strong> ${activity.tipus_intervencio}</p>
              <p><strong>Descripción:</strong> ${activity.descripcio}</p>
              <p><strong>Duración:</strong> ${activity.durada_mesos} meses</p>
              <p><strong>Estado del Proyecto:</strong> ${activity.projecte_estat}</p>
              ${activity.edifici_nom ? `<p><strong>Edificio:</strong> ${activity.edifici_nom}</p>` : ''}
            `;
            
            const notificationDetail: NotificationDetailData = {
              id: String(activity.id),
              subject: activity.titol,
              dateSent: activity.data_inici_calculada,
              sender: null,
              message: message,
            };
            
            setSelectedNotification(notificationDetail);
            setCurrentNotificationId(String(activity.id));
            setShowMarkAsReadButton(true); // Actividades SÍ tienen botón
            setIsModalVisible(true);
          }
        } else if (activeAlertCategory === 'buildings' || activeAlertCategory === 'homes') {
          // Documentos: Buscar en los datos cargados
          const documentSource = activeAlertCategory === 'buildings' 
            ? notificationsData?.documentos_edificio_caducados.documentos 
            : notificationsData?.documentos_inmueble_caducados.documentos;
          
          const document = documentSource
            ? Object.values(documentSource)
                .flat()
                .find((doc: any) => String(doc.id) === id)
            : null;
          
          if (document) {
            // Crear mensaje HTML con la información del documento
            const message = `
              <p><strong>Tipo:</strong> ${document.texto || document.tipus || document.tipus_document}</p>
              <p><strong>Fecha de Validez:</strong> ${document.data_validesa}</p>
              ${document.edifici_nom ? `<p><strong>Edificio:</strong> ${document.edifici_nom}</p>` : ''}
              ${document.ruta ? `<p><a href="${document.ruta}">Descargar documento</a></p>` : ''}
            `;
            
            const notificationDetail: NotificationDetailData = {
              id: String(document.id),
              subject: document.nom,
              dateSent: document.data_validesa,
              sender: null,
              message: message,
            };
            
            setSelectedNotification(notificationDetail);
            setCurrentNotificationId(String(document.id));
            setShowMarkAsReadButton(true); // Documentos SÍ tienen botón
            setIsModalVisible(true);
          }
        }
      }
    } catch (error) {
      console.error(' Error al abrir notificación:', error);
    }
  };

  const handleMarkAsRead = async () => {
    if (!currentNotificationId) return;
    
    try {
      if (activeTab === 'alerts') {
        if (activeAlertCategory === 'activities') {
          // Ocultar notificación de actividad
          await buildingService.hideActivityNotification(parseInt(currentNotificationId));
        } else if (activeAlertCategory === 'buildings') {
          // Ocultar notificación de documento de edificio
          await buildingService.hideDocumentNotification(parseInt(currentNotificationId), 'building');
        } else if (activeAlertCategory === 'homes') {
          // Ocultar notificación de documento de vivienda
          await buildingService.hideDocumentNotification(parseInt(currentNotificationId), 'home');
        }
      }
      
      // Recargar notificaciones para actualizar badges
      await loadNotifications();
    } catch (error) {
      console.error(' Error al marcar como leída:', error);
    }
  };

  const handleCloseModal = async () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
    setCurrentNotificationId(null);
    setShowMarkAsReadButton(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'alerts') {
      setIsAlertsMenuVisible(true);
    }
  };

  const handleAlertCategorySelect = (category: AlertCategory) => {
    setActiveAlertCategory(category);
    setActiveTab('alerts');
  };

  const handleCloseAlertsMenu = () => {
    setIsAlertsMenuVisible(false);
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.title}>{t('title', 'notifications')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 12, color: colors.text }}>Cargando notificaciones...</Text>
        </View>
      </View>
    );
  }

  // Calcular total de alertas
  const totalAlerts = buildings.length + homes.length + activities.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('title', 'notifications')}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Pestañas de Comunicaciones/Alertas */}
        <NotificationTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          communicationsCount={communications.length}
          alertsCount={totalAlerts}
        />

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Sección Comunicaciones */}
          {activeTab === 'communications' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {t('communications', 'notifications')} ({communications.length})
                </Text>
              </View>

              <View style={styles.notificationsList}>
                {getCurrentCommunications().map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onPress={handleNotificationPress}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Sección Alertas - Mostrar categoría seleccionada */}
          {activeTab === 'alerts' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {t(`alertsMenu.${activeAlertCategory}`, 'notifications')} (
                    {activeAlertCategory === 'buildings' ? buildings.length :
                     activeAlertCategory === 'homes' ? homes.length :
                     activities.length}
                  )
                </Text>
              </View>

              <View style={styles.notificationsList}>
                {(activeAlertCategory === 'buildings' ? getCurrentBuildings() :
                  activeAlertCategory === 'homes' ? getCurrentHomes() :
                  getCurrentActivities()).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onPress={handleNotificationPress}
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Paginación fija abajo - Comunicaciones */}
        {activeTab === 'communications' && communications.length > 0 && (
          <View style={styles.paginationFixed}>
            <Text style={styles.totalText}>
              {t('total', 'notifications')}: {communications.length} {t('elements', 'notifications')}
            </Text>
            <View style={styles.paginationButtons}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  communicationsPage === 1 && styles.pageButtonDisabled,
                ]}
                onPress={() => setCommunicationsPage((prev) => Math.max(1, prev - 1))}
                disabled={communicationsPage === 1}
              >
                <Text style={styles.pageButtonText}>{'<'}</Text>
              </TouchableOpacity>

              {Array.from({ length: communicationsTotalPages }, (_, i) => i + 1).map((page) => (
                <TouchableOpacity
                  key={page}
                  style={[
                    styles.pageButton,
                    communicationsPage === page && styles.pageButtonActive,
                  ]}
                  onPress={() => setCommunicationsPage(page)}
                >
                  <Text
                    style={[
                      styles.pageButtonText,
                      communicationsPage === page && styles.pageButtonTextActive,
                    ]}
                  >
                    {page}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  communicationsPage === communicationsTotalPages && styles.pageButtonDisabled,
                ]}
                onPress={() =>
                  setCommunicationsPage((prev) => Math.min(communicationsTotalPages, prev + 1))
                }
                disabled={communicationsPage === communicationsTotalPages}
              >
                <Text style={styles.pageButtonText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Paginación fija abajo - Alertas */}
        {activeTab === 'alerts' && (() => {
          const currentData = activeAlertCategory === 'buildings' ? buildings :
                             activeAlertCategory === 'homes' ? homes : activities;
          const currentPage = activeAlertCategory === 'buildings' ? buildingsPage :
                             activeAlertCategory === 'homes' ? homesPage : activitiesPage;
          const totalPages = activeAlertCategory === 'buildings' ? buildingsTotalPages :
                            activeAlertCategory === 'homes' ? homesTotalPages : activitiesTotalPages;
          const setCurrentPage = activeAlertCategory === 'buildings' ? setBuildingsPage :
                                activeAlertCategory === 'homes' ? setHomesPage : setActivitiesPage;

          return currentData.length > 0 && (
            <View style={styles.paginationFixed}>
              <Text style={styles.totalText}>
                {t('total', 'notifications')}: {currentData.length} {t('elements', 'notifications')}
              </Text>
              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.pageButtonDisabled,
                  ]}
                  onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.pageButtonText}>{'<'}</Text>
                </TouchableOpacity>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <TouchableOpacity
                    key={page}
                    style={[
                      styles.pageButton,
                      currentPage === page && styles.pageButtonActive,
                    ]}
                    onPress={() => setCurrentPage(page)}
                  >
                    <Text
                      style={[
                        styles.pageButtonText,
                        currentPage === page && styles.pageButtonTextActive,
                      ]}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[
                    styles.pageButton,
                    currentPage === totalPages && styles.pageButtonDisabled,
                  ]}
                  onPress={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.pageButtonText}>{'>'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })()}
      </View>

      {/* Modal de detalles */}
      <NotificationDetailModal
        visible={isModalVisible}
        notification={selectedNotification}
        onClose={handleCloseModal}
        onMarkAsRead={handleMarkAsRead}
        showMarkAsReadButton={showMarkAsReadButton}
      />

      {/* Menú lateral de alertas */}
      <AlertsSideMenu
        visible={isAlertsMenuVisible}
        onClose={handleCloseAlertsMenu}
        onCategorySelect={handleAlertCategorySelect}
        buildingsCount={buildings.length}
        homesCount={homes.length}
        activitiesCount={activities.length}
      />
    </View>
  );
};

