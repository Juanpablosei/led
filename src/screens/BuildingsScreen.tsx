import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { GlobalHeader } from '../components/global/GlobalHeader';
import { BuildingCard } from '../components/home/building-card/BuildingCard';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { Pagination } from '../components/home/pagination/Pagination';
import { SearchBar } from '../components/home/search-bar/SearchBar';
import { UserMenu, UserMenuOption } from '../components/user-menu';
import { useTranslation } from '../hooks/useTranslation';
import { buildingService } from '../services/buildingService';
import { storageService } from '../services/storageService';
import { styles } from './BuildingsScreen.styles';

export const BuildingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

  // Cargar edificios desde el API
  useEffect(() => {
    loadBuildings(1, '');
  }, []);

  // Cargar notificaciones para actualizar el badge
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await buildingService.getNotifications(100, true);
      
      if (response.status && 'data' in response) {
        // Calcular total de notificaciones
        const total = 
          response.data.comunicaciones_no_leidas.cantidad +
          response.data.documentos_edificio_caducados.cantidad +
          response.data.documentos_inmueble_caducados.cantidad +
          response.data.actividades_proximas.cantidad;
        
        setNotificationCount(total);
      }
    } catch {
      // Error al cargar notificaciones
    }
  };

  const loadBuildings = async (page: number, search: string = '') => {
    setIsLoadingBuildings(true);
    try {
      const response = await buildingService.getBuildings(page, search);
      
      if (response.status && response.data) {
        // Transformar los datos del API al formato BuildingData
        const buildingsData: BuildingData[] = response.data.data.map((building) => ({
          id: String(building.id),
          title: building.nom,
          type: building.tipus_edifici,
          buildingId: String(building.id),
          cadastralReference: building.ref_cadastral,
          imageUrl: building.imagen || undefined,
          versio_estesa: building.versio_estesa,
          estado: building.estado,
        }));
        
        setFilteredBuildings(buildingsData);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
      } else {
        // Error al cargar edificios
        setFilteredBuildings([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch {
      // Error al cargar edificios
      Alert.alert('', 'Error de conexión al cargar edificios');
    } finally {
      setIsLoadingBuildings(false);
    }
  };

  // Buscar en el servidor con debounce
  useEffect(() => {
    // Debounce de 500ms para evitar demasiadas peticiones
    const timeoutId = setTimeout(() => {
      if (searchText !== undefined) {
        loadBuildings(1, searchText);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handlePageChange = (page: number) => {
    // Cargar edificios de la página seleccionada con el texto de búsqueda actual
    loadBuildings(page, searchText);
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  const handleProfilePress = () => {
    setIsUserMenuVisible(true);
  };

  const handleLogout = async () => {
    setIsUserMenuVisible(false);
    try {
      await storageService.clearAuthData();
      router.replace('/login');
    } catch {
      // Error al hacer logout
      router.replace('/login');
    }
  };

  const handleUserMenuOptionPress = (option: UserMenuOption) => {
    switch (option) {
      case 'myData':
        router.push('/my-data');
        break;
     
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handleMaintenancePress = (buildingId: string) => {
    Alert.alert('Gestión de Mantenimiento', `Acceder a mantenimiento del edificio ${buildingId}`);
  };

  const handleBuildingPress = (buildingId: string) => {
    // Navegar a la pantalla de detalle del edificio
    router.push(`/building-detail?buildingId=${buildingId}`);
  };

  const renderBuildingCard = ({ item }: { item: BuildingData }) => (
    <BuildingCard
      building={item}
      onMaintenancePress={handleMaintenancePress}
      onBuildingPress={handleBuildingPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchText ? 'No se encontraron edificios con ese criterio de búsqueda' : 'No hay edificios disponibles'}
      </Text>
    </View>
  );

  return (
    <ProtectedRoute>
      <View style={styles.container}>
              {/* Header fijo */}
              <GlobalHeader
                variant="logo"
                notificationCount={notificationCount}
                onNotificationPress={handleNotificationPress}
                onProfilePress={handleProfilePress}
              />

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>{t('myBuildings', 'navigation')}</Text>

        {/* Barra de búsqueda */}
        <SearchBar
          placeholder={t('searchPlaceholder', 'navigation')}
          value={searchText}
          onChangeText={handleSearch}
        />

        {/* Lista de edificios */}
        {isLoadingBuildings ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E53E3E" />
            <Text style={styles.loadingText}>Cargando edificios...</Text>
          </View>
        ) : (
          <FlatList
            style={styles.buildingsList}
            data={filteredBuildings}
            renderItem={renderBuildingCard}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </View>

      {/* Menú de usuario */}
      <UserMenu
        visible={isUserMenuVisible}
        onClose={() => setIsUserMenuVisible(false)}
        onOptionPress={handleUserMenuOptionPress}
      />
      </View>
    </ProtectedRoute>
  );
};
