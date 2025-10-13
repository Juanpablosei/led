import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Text, TextInput, View } from 'react-native';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { UserCard } from '../components/users';
import { UserData } from '../components/users/UserCard.types';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { styles } from './UsersScreen.styles';

// Datos de ejemplo para desarrollo
const mockBuildings: BuildingData[] = [
  {
    id: '1',
    title: 'TEST: Edifici fictici per presentacions',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8862',
    cadastralReference: '8931613DF2883B',
    imageUrl: undefined,
  },
];

const mockUsers: UserData[] = [
  {
    id: '1',
    name: 'María',
    surname: 'García López',
    profiles: ['Propietario', 'Edificio', 'Curtida'],
    isVerified: true,
  },
  {
    id: '2',
    name: 'Juan',
    surname: 'Pérez Martín',
    profiles: ['Propietario', 'Edificio'],
    isVerified: false,
  },
  {
    id: '3',
    name: 'Ana',
    surname: 'Rodríguez Silva',
    profiles: ['Propietario'],
    isVerified: true,
  },
  {
    id: '4',
    name: 'Carlos',
    surname: 'Fernández Ruiz',
    profiles: ['Propietario', 'Edificio', 'Curtida'],
    isVerified: true,
  },
  {
    id: '5',
    name: 'Laura',
    surname: 'Martínez Díaz',
    profiles: ['Propietario', 'Edificio'],
    isVerified: false,
  },
];

export const UsersScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const [searchText, setSearchText] = useState('');

  // Buscar el edificio por ID
  const building = mockBuildings.find(b => b.id === buildingId);

  if (!building) {
    return null;
  }

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchText === '' || 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchText.toLowerCase()) ||
      user.profiles.some(profile => profile.toLowerCase().includes(searchText.toLowerCase()));
    return matchesSearch;
  });

  const handleUserPress = (userId: string) => {
    console.log('User pressed:', userId);
  };

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
    Alert.alert('Editar usuario', `Editar usuario con ID: ${userId}`);
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Eliminar usuario',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            console.log('Delete user:', userId);
          }
        }
      ]
    );
  };

  const handleAddUser = () => {
    console.log('Add new user');
    Alert.alert(t('addUser', 'navigation'), 'Funcionalidad de agregar usuario');
  };

  const renderUserCard = ({ item }: { item: UserData }) => (
    <UserCard
      user={item}
      onPress={handleUserPress}
      onEdit={handleEditUser}
      onDelete={handleDeleteUser}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchText ? 'No se encontraron usuarios con ese criterio de búsqueda' : 'No hay usuarios disponibles'}
      </Text>
    </View>
  );

  return (
    <BuildingLayout building={building}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('userList', 'navigation')}</Text>
          
          {/* Búsqueda */}
          <View style={styles.searchContainer}>
            <Ionicons 
              name="search-outline" 
              size={20} 
              color="#666666" 
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchUsers', 'navigation')}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Lista de usuarios */}
        <FlatList
          style={styles.usersList}
          data={filteredUsers}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BuildingLayout>
  );
};
