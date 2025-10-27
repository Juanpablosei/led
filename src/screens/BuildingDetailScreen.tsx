import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { BuildingDetailData, buildingService } from '../services/buildingService';
import { storageService } from '../services/storageService';
import { styles } from './BuildingDetailScreen.styles';

// Imagen por defecto para edificios sin imagen
const DEFAULT_IMAGE = require('../../assets/images/sinImagen.jpeg');

export const BuildingDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const [buildingDetail, setBuildingDetail] = useState<BuildingDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Bloquear botón de atrás del hardware SOLO cuando esta pantalla está en foco
  useFocusEffect(
    useCallback(() => {
      let backHandler: any = null;
      
      const setupBackHandler = async () => {
        const isBuildingUser = await storageService.isBuildingLogin();
        
        if (isBuildingUser) {
          backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true; // Bloquear
          });
        }
      };
      
      setupBackHandler();
      
      // Cleanup cuando la pantalla pierde el foco
      return () => {
        if (backHandler) {
          backHandler.remove();
        }
      };
    }, [])
  );

  const loadBuildingDetail = useCallback(async () => {
    if (!buildingId) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await buildingService.getBuildingById(Number(buildingId));
      
      if (response.status && response.data) {
        setBuildingDetail(response.data);
      } else {
        // Error al cargar detalle
        Alert.alert('', response.message || 'Error al cargar el edificio');
      }
    } catch {
      // Error al cargar detalle del edificio
      Alert.alert('', 'Error de conexión al cargar el edificio');
    } finally {
      setIsLoading(false);
    }
  }, [buildingId]);

  // Cargar detalles del edificio desde el API
  useEffect(() => {
    loadBuildingDetail();
  }, [loadBuildingDetail]);

  // Mostrar loading mientras carga
  if (isLoading) {
    return (
      <BuildingLayout building={null}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={styles.loadingText}>{t('loadingBuilding', 'common')}</Text>
        </View>
      </BuildingLayout>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!buildingDetail) {
    return (
      <BuildingLayout building={null}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('errorLoadingBuilding', 'common')}</Text>
        </View>
      </BuildingLayout>
    );
  }

  // Función para determinar qué texto mostrar en el título
  const getTitleText = () => {
    // Siempre mostrar el nombre del edificio como título principal
    return buildingDetail.nom;
  };

  // Función para determinar qué texto mostrar en el link (misma lógica que BuildingCard)
  const getLinkText = () => {
    if (buildingDetail.versio_estesa) {
      return t('ledMaintenance', 'navigation'); // "LED Gestión del mantenimiento"
    } else if (buildingDetail.estado === 'estado_activo') {
      return t('ledLibroDiario', 'common'); // "LED libro edificio"
    } else {
      return ''; // No mostrar nada
    }
  };

  const linkText = getLinkText();

  // Transformar a formato BuildingData para el Layout
  const building: BuildingData = {
    id: String(buildingDetail.id),
    title: getTitleText(),
    type: buildingDetail.tipus_edifici,
    buildingId: String(buildingDetail.id),
    cadastralReference: buildingDetail.ref_cadastral,
    imageUrl: buildingDetail.imagen?.ruta || undefined,
    versio_estesa: buildingDetail.versio_estesa,
    estado: buildingDetail.estado,
  };

  const handleMaintenancePress = () => {
    // Navegar a la gestión de mantenimiento (puede ser la misma pantalla o una específica)
    // Por ahora mantenemos en la misma pantalla pero se puede cambiar
  };

  return (
    <BuildingLayout building={building}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título "Identificación" FUERA de la card */}
        <Text style={styles.identificationTitle}>{t('identification', 'navigation')}</Text>
        
        {/* Card principal con TODO el contenido */}
        <View style={styles.mainCard}>
          <Text style={styles.buildingName}>{buildingDetail.nom}</Text>
          
          <View style={styles.buildingDetails}>
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('buildingId', 'common')} </Text>
              <Text style={styles.detailValue}>{buildingDetail.id}</Text>
            </Text>
            
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('cadastralRef', 'common')} </Text>
              <Text style={styles.detailValue}>{buildingDetail.ref_cadastral}</Text>
            </Text>
            
            <Text style={styles.buildingType}>{buildingDetail.tipus_edifici}</Text>
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

          {/* Imagen del edificio DENTRO de la card */}
          <View style={styles.imageContainer}>
          {buildingDetail.imagen?.ruta ? (
            <Image
              source={{ uri: buildingDetail.imagen.ruta }}
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
        </View>
      </ScrollView>
    </BuildingLayout>
  );
};
