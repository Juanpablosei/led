import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { styles } from './BuildingDetailScreen.styles';

// Datos de ejemplo para desarrollo (mismo que en BuildingsScreen)
const mockBuildings: BuildingData[] = [
  {
    id: '1',
    title: 'TEST: Edifici fictici per presentacions',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8862',
    cadastralReference: '8931613DF2883B',
    imageUrl: undefined,
  },
  {
    id: '2',
    title: 'Edificio Residencial Plaza Mayor',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8863',
    cadastralReference: '8931613DF2883C',
    imageUrl: undefined,
  },
  {
    id: '3',
    title: 'Complejo Residencial Los Pinos',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8864',
    cadastralReference: '8931613DF2883D',
    imageUrl: undefined,
  },
  {
    id: '4',
    title: 'Torre Residencial Central',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8865',
    cadastralReference: '8931613DF2883E',
    imageUrl: undefined,
  },
  {
    id: '5',
    title: 'Complejo Habitacional Norte',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8866',
    cadastralReference: '8931613DF2883F',
    imageUrl: undefined,
  },
  {
    id: '6',
    title: 'Residencia Los Laureles',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8867',
    cadastralReference: '8931613DF2883G',
    imageUrl: undefined,
  },
  {
    id: '7',
    title: 'Edificio Residencial Sur',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8868',
    cadastralReference: '8931613DF2883H',
    imageUrl: undefined,
  },
  {
    id: '8',
    title: 'Complejo Residencial Este',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8869',
    cadastralReference: '8931613DF2883I',
    imageUrl: undefined,
  },
  {
    id: '9',
    title: 'Torre Habitacional Oeste',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8870',
    cadastralReference: '8931613DF2883J',
    imageUrl: undefined,
  },
  {
    id: '10',
    title: 'Residencia Los Olivos',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8871',
    cadastralReference: '8931613DF2883K',
    imageUrl: undefined,
  },
  {
    id: '11',
    title: 'Edificio Residencial Centro',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8872',
    cadastralReference: '8931613DF2883L',
    imageUrl: undefined,
  },
  {
    id: '12',
    title: 'Complejo Habitacional Vista',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8873',
    cadastralReference: '8931613DF2883M',
    imageUrl: undefined,
  },
];

export const BuildingDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  
  // Buscar el edificio por ID
  const building = mockBuildings.find(b => b.id === buildingId);

  if (!building) {
    return null;
  }

  const handleMaintenancePress = () => {
    // Aquí puedes implementar la navegación a la gestión de mantenimiento
    console.log('Acceder a gestión de mantenimiento del edificio:', building.id);
  };

  return (
    <BuildingLayout building={building}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título "Identificación" FUERA de la card */}
        <Text style={styles.identificationTitle}>{t('identification', 'navigation')}</Text>
        
        {/* Card principal con TODO el contenido */}
        <View style={styles.mainCard}>
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

          {/* Imagen del edificio DENTRO de la card */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/edificio.png')}
              style={styles.buildingImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
    </BuildingLayout>
  );
};
