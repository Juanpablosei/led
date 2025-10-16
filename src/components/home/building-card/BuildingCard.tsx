import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { styles } from './BuildingCard.styles';
import { BuildingCardProps } from './BuildingCard.types';

// Imagen por defecto para edificios sin imagen
const DEFAULT_IMAGE = require('../../../../assets/images/sinImagen.jpeg');

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  onMaintenancePress,
  onBuildingPress,
}) => {
  const { t } = useTranslation();
  
  const handleMaintenancePress = () => {
    onMaintenancePress?.(building.id);
  };

  const handleBuildingPress = () => {
    onBuildingPress?.(building.id);
  };

  // Función para determinar qué texto mostrar en el título
  const getTitleText = () => {
    if (building.versio_estesa) {
      return building.title; // Texto actual
    } else if (building.estado === 'estado_activo') {
      return t('ledLibroEdificio', 'common'); // "Led libro edificio"
    } else {
      return ''; // No mostrar nada
    }
  };

  const titleText = getTitleText();

  return (
    <TouchableOpacity style={styles.container} onPress={handleBuildingPress}>
      {/* Imagen del edificio */}
      <View style={styles.imageContainer}>
        {building.imageUrl ? (
          <Image
            source={{ uri: building.imageUrl }}
            style={styles.buildingImage}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={DEFAULT_IMAGE}
            style={styles.buildingImage}
            resizeMode="contain"
          />
        )}
      </View>

      {/* Contenido del edificio */}
      <View style={styles.contentContainer}>
        <View>
          {/* Título y tag solo se muestran si hay texto */}
          {titleText ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{titleText}</Text>
              <Ionicons name="pricetag" size={16} color="#E95460" style={styles.titleTag} />
            </View>
          ) : null}
          <Text style={styles.type}>{building.type.replace(' (EXISTENTE)', '')}</Text>
          <Text style={styles.status}>(EXISTENTE)</Text>
          <Text style={styles.id}>
            <Text style={styles.label}>ID Edificio: </Text>
            <Text style={styles.value}>{building.buildingId}</Text>
          </Text>
          <Text style={styles.cadastralRef}>
            <Text style={styles.label}>Ref. Catastral: </Text>
            <Text style={styles.value}>{building.cadastralReference}</Text>
          </Text>
        </View>

        {/* Enlace a gestión de mantenimiento */}
        <TouchableOpacity
          style={styles.maintenanceLink}
          onPress={handleMaintenancePress}
        >
          <Ionicons name="arrow-forward-outline" size={16} color="#E95460" style={styles.maintenanceIcon} />
          <Text style={styles.maintenanceText}>
            {t('ledMaintenance', 'navigation')}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
