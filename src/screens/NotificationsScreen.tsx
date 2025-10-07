import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { NotificationDetailModal, NotificationItem } from '../components/notifications';
import { NotificationDetailData } from '../components/notifications/NotificationDetailModal.types';
import { NotificationData } from '../components/notifications/NotificationItem.types';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './NotificationsScreen.styles';

// Datos de ejemplo
const mockCommunications: NotificationData[] = Array.from({ length: 15 }, (_, i) => ({
  id: `communication-${i + 1}`,
  title: 'Actualització de Dades de Facturació de l\'Edifici',
  date: '20/03/2026',
  isRead: i >= 5,
}));

const mockBuildings: NotificationData[] = Array.from({ length: 25 }, (_, i) => ({
  id: `building-${i + 1}`,
  title: 'Actualització de Dades de Facturació de l\'Edifici',
  date: '20/03/2026',
  isRead: i >= 8,
}));

const mockHomes: NotificationData[] = Array.from({ length: 18 }, (_, i) => ({
  id: `home-${i + 1}`,
  title: 'Notificació de Caducitat de Documentació de la Vivienda',
  date: '18/03/2026',
  isRead: i >= 6,
}));

const mockActivities: NotificationData[] = Array.from({ length: 12 }, (_, i) => ({
  id: `activity-${i + 1}`,
  title: 'Recordatori d\'Activitat Programada',
  date: '22/03/2026',
  isRead: i >= 3,
}));

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

  const itemsPerPage = 10;

  // Paginación para comunicaciones
  const communicationsTotalPages = Math.ceil(mockCommunications.length / itemsPerPage);
  const getCurrentCommunications = () => {
    const startIndex = (communicationsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockCommunications.slice(startIndex, endIndex);
  };

  // Paginación para edificios
  const buildingsTotalPages = Math.ceil(mockBuildings.length / itemsPerPage);
  const getCurrentBuildings = () => {
    const startIndex = (buildingsPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockBuildings.slice(startIndex, endIndex);
  };

  // Paginación para viviendas
  const homesTotalPages = Math.ceil(mockHomes.length / itemsPerPage);
  const getCurrentHomes = () => {
    const startIndex = (homesPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockHomes.slice(startIndex, endIndex);
  };

  // Paginación para actividades
  const activitiesTotalPages = Math.ceil(mockActivities.length / itemsPerPage);
  const getCurrentActivities = () => {
    const startIndex = (activitiesPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockActivities.slice(startIndex, endIndex);
  };

  const handleNotificationPress = (id: string) => {
    // Crear datos de ejemplo para el modal
    const notificationDetail: NotificationDetailData = {
      id: id,
      subject: 'Actualització de Dades de Facturació de l\'Edifici',
      dateSent: '10/09/2024',
      sender: 'Núria Vilaplana Hortensi',
      message: `Actualització de Dades de Facturació de l'Edifici
Informació de Facturació:

Número d'Entitats Jurídiques:
2

Preu Unitari:
6

Total Facturació:
12

Règim Jurídic:
propietat_vertical

Tipus Identificació:
NIF

Identificació:
46577521Z

Raó Social:
Núria Vilaplana Hortensi

Tipus Vía:
carrer`,
    };
    
    setSelectedNotification(notificationDetail);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const handleBack = () => {
    router.back();
  };

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
                <Text style={styles.cardBadgeText}>{mockCommunications.length}</Text>
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
                <Text style={styles.cardBadgeText}>{mockBuildings.length}</Text>
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
                <Text style={styles.cardBadgeText}>{mockHomes.length}</Text>
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
                <Text style={styles.cardBadgeText}>{mockActivities.length}</Text>
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
                {t('communications', 'notifications')} ({mockCommunications.length})
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
                {t('buildings', 'notifications')} ({mockBuildings.length})
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
                {t('homes', 'notifications')} ({mockHomes.length})
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
                {t('activities', 'notifications')} ({mockActivities.length})
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
      {activeTab === 'communications' && mockCommunications.length > 0 && (
        <View style={styles.paginationFixed}>
          <Text style={styles.totalText}>
            {t('total', 'notifications')}: {mockCommunications.length} {t('elements', 'notifications')}
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
      {activeTab === 'buildings' && mockBuildings.length > 0 && (
        <View style={styles.paginationFixed}>
          <Text style={styles.totalText}>
            {t('total', 'notifications')}: {mockBuildings.length} {t('elements', 'notifications')}
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
      {activeTab === 'homes' && mockHomes.length > 0 && (
        <View style={styles.paginationFixed}>
          <Text style={styles.totalText}>
            {t('total', 'notifications')}: {mockHomes.length} {t('elements', 'notifications')}
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
      {activeTab === 'activities' && mockActivities.length > 0 && (
        <View style={styles.paginationFixed}>
          <Text style={styles.totalText}>
            {t('total', 'notifications')}: {mockActivities.length} {t('elements', 'notifications')}
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
      />
    </View>
  );
};

