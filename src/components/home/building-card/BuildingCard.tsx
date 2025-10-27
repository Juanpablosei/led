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

  // Función para determinar qué texto mostrar en el link
  const getLinkText = () => {
    if (building.versio_estesa) {
      return t('ledMaintenance', 'navigation'); // "LED Gestión del mantenimiento"
    } else if (building.estado === 'estado_activo') {
      return t('ledLibroDiario', 'common'); // "LED libro edificio"
    } else {
      return ''; // No mostrar nada
    }
  };

  const linkText = getLinkText();

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
        <View style={styles.buildingInfo}>
          <Text style={styles.buildingName}>{building.title}</Text>
          <Text style={styles.type}>{building.type.replace(' (EXISTENTE)', '')}</Text>
          <Text style={styles.status}>(EXISTENTE)</Text>
          <Text style={styles.id}>
            <Text style={styles.label}>{t('buildingId', 'common')} </Text>
            <Text style={styles.value}>{building.buildingId}</Text>
          </Text>
          <Text style={styles.cadastralRef}>
            <Text style={styles.label}>{t('cadastralRef', 'common')} </Text>
            <Text style={styles.value}>{building.cadastralReference}</Text>
          </Text>
        </View>

        {/* Enlace a gestión de mantenimiento */}
        {linkText && (
          <TouchableOpacity
            style={styles.maintenanceLink}
            onPress={handleMaintenancePress}
          >
            <Ionicons name="pricetag" size={16} color="#E95460" style={styles.maintenanceIcon} />
            <Text style={styles.maintenanceText}>
              {linkText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
