import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NotificationDetailModal, NotificationItem } from '../components/notifications';
import { NotificationDetailData } from '../components/notifications/NotificationDetailModal.types';
import { NotificationData } from '../components/notifications/NotificationItem.types';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { buildingService, NotificationsData } from '../services/buildingService';
import { styles } from './NotificationsScreen.styles';

type TabType = 'communications' | 'buildings' | 'homes' | 'activities';

export const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('communications');
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
        console.log('✅ Notificaciones cargadas:', response.data);
        setNotificationsData(response.data);
      } else {
        console.error('❌ Error al cargar notificaciones:', response.message);
      }
    } catch (error) {
      console.error('❌ Error de red al cargar notificaciones:', error);
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
          title: `${doc.nom} - ${doc.tipus}`,  // ← Nombre + Tipo
          date: doc.data_validesa || doc.data_caducitat,
          isRead: true,
          buildingName: doc.edifici_nom || undefined,
        }))
    : [];

  // Mapear viviendas (documentos caducados de inmuebles)
  const homes: NotificationData[] = Array.isArray(notificationsData?.documentos_inmueble_caducados.documentos)
    ? notificationsData.documentos_inmueble_caducados.documentos.map((doc: any) => ({
        id: String(doc.id),
        title: `${doc.nom} - ${doc.tipus}`,  // ← Nombre + Tipo
        date: doc.data_validesa || doc.data_caducitat,
        isRead: true,
        buildingName: doc.edifici_nom || undefined,
      }))
    : notificationsData?.documentos_inmueble_caducados.documentos
    ? Object.values(notificationsData.documentos_inmueble_caducados.documentos)
        .flat()
        .map((doc: any) => ({
          id: String(doc.id),
          title: `${doc.nom} - ${doc.tipus}`,  // ← Nombre + Tipo
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
        console.log('🔍 Obteniendo detalle de comunicación:', id);
        
        const response = await buildingService.getComunicacionDetail(parseInt(id));
        
        if (response.status && 'data' in response) {
          const comunicacion = response.data;
          
          // Mapear a formato del modal
          const notificationDetail: NotificationDetailData = {
            id: String(comunicacion.id),
            subject: comunicacion.assumpte,
            dateSent: comunicacion.data_enviament || null,
            sender: comunicacion.emisor || null,
            message: comunicacion.cos,
          };
          
          setSelectedNotification(notificationDetail);
          setCurrentNotificationId(String(comunicacion.id));
          setShowMarkAsReadButton(false); // Comunicaciones no tienen botón
          setIsModalVisible(true);
          
          // Marcar como leída cuando se abre el modal
          if (!comunicacion.leido) {
            console.log('📝 Marcando comunicación como leída');
            await buildingService.markComunicacionAsRead(comunicacion.id, true);
          }
        } else {
          console.error('❌ Error al obtener detalle:', response.message);
        }
      } else if (activeTab === 'activities') {
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
      } else if (activeTab === 'buildings' || activeTab === 'homes') {
        // Documentos: Buscar en los datos cargados
        const documentSource = activeTab === 'buildings' 
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
            <p><strong>Tipo:</strong> ${document.tipus}</p>
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
    } catch (error) {
      console.error('❌ Error al abrir notificación:', error);
    }
  };

  const handleMarkAsRead = async () => {
    if (!currentNotificationId) return;
    
    try {
      if (activeTab === 'activities') {
        // Ocultar notificación de actividad
        console.log('📝 Ocultando notificación de actividad:', currentNotificationId);
        await buildingService.hideActivityNotification(parseInt(currentNotificationId));
      } else if (activeTab === 'buildings' || activeTab === 'homes') {
        // Ocultar notificación de documento
        console.log('📝 Ocultando notificación de documento:', currentNotificationId);
        await buildingService.hideDocumentNotification(parseInt(currentNotificationId));
      }
      
      // Recargar notificaciones para actualizar badges
      await loadNotifications();
    } catch (error) {
      console.error('❌ Error al marcar como leída:', error);
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
        {/* Cards de notificaciones - Diseño moderno */}
        <View style={styles.cardsContainer}>
          {/* Fila 1: Comunicaciones | Edificios */}
          <View style={styles.cardsRow}>
            <TouchableOpacity
              style={[styles.notificationCard, activeTab === 'communications' && styles.notificationCardActive]}
              onPress={() => setActiveTab('communications')}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons 
                  name="mail-outline" 
                  size={18} 
                  color={activeTab === 'communications' ? colors.white : colors.primary} 
                />
              </View>
              <Text style={[styles.cardTitle, activeTab === 'communications' && styles.cardTitleActive]}>
                {t('communications', 'notifications')}
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{communications.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.notificationCard, activeTab === 'buildings' && styles.notificationCardActive]}
              onPress={() => setActiveTab('buildings')}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons 
                  name="business-outline" 
                  size={18} 
                  color={activeTab === 'buildings' ? colors.white : colors.primary} 
                />
              </View>
              <Text style={[styles.cardTitle, activeTab === 'buildings' && styles.cardTitleActive]}>
                {t('buildings', 'notifications')}
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{buildings.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Fila 2: Viviendas | Actividades */}
          <View style={styles.cardsRow}>
            <TouchableOpacity
              style={[styles.notificationCard, activeTab === 'homes' && styles.notificationCardActive]}
              onPress={() => setActiveTab('homes')}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons 
                  name="home-outline" 
                  size={18} 
                  color={activeTab === 'homes' ? colors.white : colors.primary} 
                />
              </View>
              <Text style={[styles.cardTitle, activeTab === 'homes' && styles.cardTitleActive]}>
                {t('homes', 'notifications')}
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{homes.length}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.notificationCard, activeTab === 'activities' && styles.notificationCardActive]}
              onPress={() => setActiveTab('activities')}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons 
                  name="calendar-outline" 
                  size={18} 
                  color={activeTab === 'activities' ? colors.white : colors.primary} 
                />
              </View>
              <Text style={[styles.cardTitle, activeTab === 'activities' && styles.cardTitleActive]}>
                {t('activities', 'notifications')}
              </Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{activities.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

        {/* Sección Edificios */}
        {activeTab === 'buildings' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('buildings', 'notifications')} ({buildings.length})
              </Text>
            </View>

            <View style={styles.notificationsList}>
              {getCurrentBuildings().map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onPress={handleNotificationPress}
                />
              ))}
            </View>
          </View>
        )}

        {/* Sección Viviendas */}
        {activeTab === 'homes' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('homes', 'notifications')} ({homes.length})
              </Text>
            </View>

            <View style={styles.notificationsList}>
              {getCurrentHomes().map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onPress={handleNotificationPress}
                />
              ))}
            </View>
          </View>
        )}

        {/* Sección Actividades */}
        {activeTab === 'activities' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('activities', 'notifications')} ({activities.length})
              </Text>
            </View>

            <View style={styles.notificationsList}>
              {getCurrentActivities().map((notification) => (
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

      {/* Paginación fija abajo - Edificios */}
      {activeTab === 'buildings' && buildings.length > 0 && (
        <View style={styles.paginationFixed}>
          <Text style={styles.totalText}>
            {t('total', 'notifications')}: {buildings.length} {t('elements', 'notifications')}
          </Text>
          <View style={styles.paginationButtons}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                buildingsPage === 1 && styles.pageButtonDisabled,
              ]}
              onPress={() => setBuildingsPage((prev) => Math.max(1, prev - 1))}
              disabled={buildingsPage === 1}
            >
              <Text style={styles.pageButtonText}>{'<'}</Text>
            </TouchableOpacity>

            {Array.from({ length: buildingsTotalPages }, (_, i) => i + 1).map((page) => (
              <TouchableOpacity
                key={page}
                style={[
                  styles.pageButton,
                  buildingsPage === page && styles.pageButtonActive,
                ]}
                onPress={() => setBuildingsPage(page)}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    buildingsPage === page && styles.pageButtonTextActive,
                  ]}
                >
                  {page}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.pageButton,
                buildingsPage === buildingsTotalPages && styles.pageButtonDisabled,
              ]}
              onPress={() =>
                setBuildingsPage((prev) => Math.min(buildingsTotalPages, prev + 1))
              }
              disabled={buildingsPage === buildingsTotalPages}
            >
              <Text style={styles.pageButtonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Paginación fija abajo - Viviendas */}
      {activeTab === 'homes' && homes.length > 0 && (
        <View style={styles.paginationFixed}>
          <Text style={styles.totalText}>
            {t('total', 'notifications')}: {homes.length} {t('elements', 'notifications')}
          </Text>
          <View style={styles.paginationButtons}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                homesPage === 1 && styles.pageButtonDisabled,
              ]}
              onPress={() => setHomesPage((prev) => Math.max(1, prev - 1))}
              disabled={homesPage === 1}
            >
              <Text style={styles.pageButtonText}>{'<'}</Text>
            </TouchableOpacity>

            {Array.from({ length: homesTotalPages }, (_, i) => i + 1).map((page) => (
              <TouchableOpacity
                key={page}
                style={[
                  styles.pageButton,
                  homesPage === page && styles.pageButtonActive,
                ]}
                onPress={() => setHomesPage(page)}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    homesPage === page && styles.pageButtonTextActive,
                  ]}
                >
                  {page}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.pageButton,
                homesPage === homesTotalPages && styles.pageButtonDisabled,
              ]}
              onPress={() =>
                setHomesPage((prev) => Math.min(homesTotalPages, prev + 1))
              }
              disabled={homesPage === homesTotalPages}
            >
              <Text style={styles.pageButtonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Paginación fija abajo - Actividades */}
      {activeTab === 'activities' && activities.length > 0 && (
        <View style={styles.paginationFixed}>
          <Text style={styles.totalText}>
            {t('total', 'notifications')}: {activities.length} {t('elements', 'notifications')}
          </Text>
          <View style={styles.paginationButtons}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                activitiesPage === 1 && styles.pageButtonDisabled,
              ]}
              onPress={() => setActivitiesPage((prev) => Math.max(1, prev - 1))}
              disabled={activitiesPage === 1}
            >
              <Text style={styles.pageButtonText}>{'<'}</Text>
            </TouchableOpacity>

            {Array.from({ length: activitiesTotalPages }, (_, i) => i + 1).map((page) => (
              <TouchableOpacity
                key={page}
                style={[
                  styles.pageButton,
                  activitiesPage === page && styles.pageButtonActive,
                ]}
                onPress={() => setActivitiesPage(page)}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    activitiesPage === page && styles.pageButtonTextActive,
                  ]}
                >
                  {page}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.pageButton,
                activitiesPage === activitiesTotalPages && styles.pageButtonDisabled,
              ]}
              onPress={() =>
                setActivitiesPage((prev) => Math.min(activitiesTotalPages, prev + 1))
              }
              disabled={activitiesPage === activitiesTotalPages}
            >
              <Text style={styles.pageButtonText}>{'>'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </View>

      {/* Modal de detalles */}
      <NotificationDetailModal
        visible={isModalVisible}
        notification={selectedNotification}
        onClose={handleCloseModal}
        onMarkAsRead={handleMarkAsRead}
        showMarkAsReadButton={showMarkAsReadButton}
      />
    </View>
  );
};

