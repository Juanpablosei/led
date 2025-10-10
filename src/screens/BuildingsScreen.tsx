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
import { styles } from './BuildingsScreen.styles';

export const BuildingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [notificationCount] = useState(4);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);

  // Cargar edificios desde el API
  useEffect(() => {
    loadBuildings(1, '');
  }, []);

  const loadBuildings = async (page: number, search: string = '') => {
    setIsLoadingBuildings(true);
    try {
      const response = await buildingService.getBuildings(page, search);
      
      if (response.status && response.data) {
        console.log('Edificios cargados:', response.data.total);
        console.log('Búsqueda:', search || 'sin filtro');
        console.log('Página:', response.data.current_page, 'de', response.data.last_page);
        
        // Transformar los datos del API al formato BuildingData
        const buildingsData: BuildingData[] = response.data.data.map((building) => ({
          id: String(building.id),
          title: building.nom,
          type: building.tipus_edifici,
          buildingId: String(building.id),
          cadastralReference: building.ref_cadastral,
          imageUrl: building.imagen || 'https://via.placeholder.com/80x80',
        }));
        
        setBuildings(buildingsData);
        setFilteredBuildings(buildingsData);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
        setTotalItems(response.data.total);
      } else {
        console.error('Error al cargar edificios:', response.message);
        setBuildings([]);
        setFilteredBuildings([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error('Error al cargar edificios:', error);
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

  const handleUserMenuOptionPress = (option: UserMenuOption) => {
    switch (option) {
      case 'myData':
        router.push('/my-data');
        break;
      case 'userType':
        router.push('/user-type');
        break;
      case 'alerts':
        router.push('/alerts');
        break;
      case 'changePassword':
        router.push('/change-password');
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
