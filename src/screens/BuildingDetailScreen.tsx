import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './BuildingDetailScreen.styles';

// Datos de ejemplo para desarrollo (mismo que en BuildingsScreen)
const mockBuildings: BuildingData[] = [
  {
    id: '1',
    title: 'TEST: Edifici fictici per presentacions',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8862',
    cadastralReference: '8931613DF2883B',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+1',
  },
  {
    id: '2',
    title: 'Edificio Residencial Plaza Mayor',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8863',
    cadastralReference: '8931613DF2883C',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+2',
  },
  {
    id: '3',
    title: 'Complejo Residencial Los Pinos',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8864',
    cadastralReference: '8931613DF2883D',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+3',
  },
  {
    id: '4',
    title: 'Torre Residencial Central',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8865',
    cadastralReference: '8931613DF2883E',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+4',
  },
  {
    id: '5',
    title: 'Complejo Habitacional Norte',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8866',
    cadastralReference: '8931613DF2883F',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+5',
  },
  {
    id: '6',
    title: 'Residencia Los Laureles',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8867',
    cadastralReference: '8931613DF2883G',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+6',
  },
  {
    id: '7',
    title: 'Edificio Residencial Sur',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8868',
    cadastralReference: '8931613DF2883H',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+7',
  },
  {
    id: '8',
    title: 'Complejo Residencial Este',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8869',
    cadastralReference: '8931613DF2883I',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+8',
  },
  {
    id: '9',
    title: 'Torre Habitacional Oeste',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8870',
    cadastralReference: '8931613DF2883J',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+9',
  },
  {
    id: '10',
    title: 'Residencia Los Olivos',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8871',
    cadastralReference: '8931613DF2883K',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+10',
  },
  {
    id: '11',
    title: 'Edificio Residencial Centro',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8872',
    cadastralReference: '8931613DF2883L',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+11',
  },
  {
    id: '12',
    title: 'Complejo Habitacional Vista',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8873',
    cadastralReference: '8931613DF2883M',
    imageUrl: 'https://via.placeholder.com/400x300/cccccc/666666?text=Edificio+12',
  },
];

export const BuildingDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  
  // Buscar el edificio por ID
  const building = mockBuildings.find(b => b.id === buildingId);

  if (!building) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('myBuildings', 'navigation')}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Edificio no encontrado</Text>
        </View>
      </View>
    );
  }

  const handleMaintenancePress = () => {
    // Aquí puedes implementar la navegación a la gestión de mantenimiento
    console.log('Acceder a gestión de mantenimiento del edificio:', building.id);
  };

  return (
    <View style={styles.container}>
      {/* Header con navegación */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myBuildings', 'navigation')}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Título del edificio */}
      <View style={styles.titleSection}>
        <Text style={styles.buildingTitle}>{building.title}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección de identificación */}
        <View style={styles.identificationCard}>
          <Text style={styles.identificationTitle}>{t('identification', 'navigation')}</Text>
          
          <Text style={styles.buildingName}>{building.title}</Text>
          
          <View style={styles.buildingDetails}>
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID Edificio: </Text>
              <Text style={styles.detailValue}>{building.buildingId}</Text>
            </Text>
            
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ref. Catastral: </Text>
              <Text style={styles.detailValue}>{building.cadastralReference}</Text>
            </Text>
            
            <Text style={styles.buildingType}>{building.type}</Text>
          </View>

          {/* Enlace a gestión de mantenimiento */}
          <TouchableOpacity 
            style={styles.maintenanceLink}
            onPress={handleMaintenancePress}
          >
            <Ionicons name="diamond" size={16} color="#E95460" style={styles.maintenanceIcon} />
            <Text style={styles.maintenanceText}>
              {t('ledMaintenance', 'navigation')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Imagen del edificio */}
        <View style={styles.imageContainer}>
          {building.imageUrl ? (
            <Image
              source={{ uri: building.imageUrl }}
              style={styles.buildingImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Sin imagen disponible</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
