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

type TabType = 'communications' | 'buildings';

export const NotificationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('communications');
  const [communicationsPage, setCommunicationsPage] = useState(1);
  const [buildingsPage, setBuildingsPage] = useState(1);
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
        {/* Tabs */}
        <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'communications' && styles.tabActive]}
          onPress={() => setActiveTab('communications')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'communications' && styles.tabTextActive,
            ]}
          >
            {t('communications', 'notifications')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buildings' && styles.tabActive]}
          onPress={() => setActiveTab('buildings')}
        >
          <Text
            style={[styles.tabText, activeTab === 'buildings' && styles.tabTextActive]}
          >
            {t('buildings', 'notifications')}
          </Text>
        </TouchableOpacity>
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

