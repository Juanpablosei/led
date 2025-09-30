import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { GlobalHeader } from '../components/global/GlobalHeader';
import { BuildingCard } from '../components/home/building-card/BuildingCard';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { Pagination } from '../components/home/pagination/Pagination';
import { SearchBar } from '../components/home/search-bar/SearchBar';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './BuildingsScreen.styles';

// Datos de ejemplo para desarrollo
const mockBuildings: BuildingData[] = [
  {
    id: '1',
    title: 'TEST: Edifici fictici per presentacions',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8862',
    cadastralReference: '8931613DF2883B',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '2',
    title: 'Edificio Residencial Plaza Mayor',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8863',
    cadastralReference: '8931613DF2884C',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '3',
    title: 'Complejo Residencial Los Pinos',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8864',
    cadastralReference: '8931613DF2885D',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '4',
    title: 'Torres del Mar',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8865',
    cadastralReference: '8931613DF2886E',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '5',
    title: 'Residencial San Juan',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8866',
    cadastralReference: '8931613DF2887F',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '6',
    title: 'Complejo Vista Hermosa',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8867',
    cadastralReference: '8931613DF2888G',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '7',
    title: 'Edificio Central Park',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8868',
    cadastralReference: '8931613DF2889H',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '8',
    title: 'Residencial Los Laureles',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8869',
    cadastralReference: '8931613DF2890I',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '9',
    title: 'Torre del Sol',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8870',
    cadastralReference: '8931613DF2891J',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '10',
    title: 'Complejo Las Flores',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8871',
    cadastralReference: '8931613DF2892K',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '11',
    title: 'Edificio Montecarlo',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8872',
    cadastralReference: '8931613DF2893L',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
  {
    id: '12',
    title: 'Residencial El Mirador',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8873',
    cadastralReference: '8931613DF2894M',
    imageUrl: 'https://via.placeholder.com/80x80',
  },
];

export const BuildingsScreen: React.FC = () => {
  const { t } = useTranslation();
  console.log('Mock buildings length:', mockBuildings.length);
  console.log('Mock buildings:', mockBuildings.map(b => b.id));
  const [buildings, setBuildings] = useState<BuildingData[]>(mockBuildings);
  const [filteredBuildings, setFilteredBuildings] = useState<BuildingData[]>(mockBuildings);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationCount] = useState(4);

  const itemsPerPage = 3;
  const totalItems = filteredBuildings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Debug logs
  console.log('Buildings state length:', buildings.length);
  console.log('Filtered buildings length:', filteredBuildings.length);
  console.log('Total items:', totalItems);
  console.log('Total pages:', totalPages);
  console.log('Current page:', currentPage);

  // Forzar actualización del estado con todos los edificios
  useEffect(() => {
    console.log('Setting buildings to mockBuildings');
    setBuildings(mockBuildings);
    setFilteredBuildings(mockBuildings);
  }, []);

  // Filtrar edificios basado en la búsqueda
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredBuildings(buildings);
    } else {
      const filtered = buildings.filter(building =>
        building.title.toLowerCase().includes(searchText.toLowerCase()) ||
        building.cadastralReference.toLowerCase().includes(searchText.toLowerCase()) ||
        building.buildingId.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredBuildings(filtered);
    }
    setCurrentPage(1); // Reset a la primera página cuando se busca
  }, [searchText, buildings]);

  // Obtener edificios para la página actual
  const getCurrentPageBuildings = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBuildings.slice(startIndex, endIndex);
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNotificationPress = () => {
    Alert.alert('Notificaciones', `Tienes ${notificationCount} notificaciones pendientes`);
  };

  const handleProfilePress = () => {
    Alert.alert('Perfil', 'Acceder a configuración de perfil');
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
        <FlatList
          style={styles.buildingsList}
          data={getCurrentPageBuildings()}
          renderItem={renderBuildingCard}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

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
    </View>
  );
};
