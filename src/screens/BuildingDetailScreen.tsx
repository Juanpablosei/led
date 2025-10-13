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
          console.log('🚫 Bloqueando botón de atrás para usuario de edificio');
          backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            console.log('🚫 Intento de volver atrás bloqueado');
            return true; // Bloquear
          });
        }
      };
      
      setupBackHandler();
      
      // Cleanup cuando la pantalla pierde el foco
      return () => {
        if (backHandler) {
          console.log('✅ Desbloqueando botón de atrás');
          backHandler.remove();
        }
      };
    }, [])
  );

  // Cargar detalles del edificio desde el API
  useEffect(() => {
    loadBuildingDetail();
  }, [buildingId]);

  const loadBuildingDetail = async () => {
    if (!buildingId) {
      console.log('❌ No hay buildingId en los parámetros');
      return;
    }
    
    console.log('🏢 Cargando edificio con ID:', buildingId);
    setIsLoading(true);
    try {
      const response = await buildingService.getBuildingById(Number(buildingId));
      
      if (response.status && response.data) {
        console.log('✅ Detalle de edificio cargado:', response.data.nom);
        console.log('📊 ID del edificio:', response.data.id);
        setBuildingDetail(response.data);
      } else {
        console.error('❌ Error al cargar detalle:', response.message);
        Alert.alert('', response.message || 'Error al cargar el edificio');
      }
    } catch (error) {
      console.error('❌ Error al cargar detalle del edificio:', error);
      Alert.alert('', 'Error de conexión al cargar el edificio');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras carga
  if (isLoading) {
    return (
      <BuildingLayout building={null}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={styles.loadingText}>Cargando edificio...</Text>
        </View>
      </BuildingLayout>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!buildingDetail) {
    return (
      <BuildingLayout building={null}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el edificio</Text>
        </View>
      </BuildingLayout>
    );
  }

  // Transformar a formato BuildingData para el Layout
  const building: BuildingData = {
    id: String(buildingDetail.id),
    title: buildingDetail.nom,
    type: buildingDetail.tipus_edifici,
    buildingId: String(buildingDetail.id),
    cadastralReference: buildingDetail.ref_cadastral,
    imageUrl: buildingDetail.imagen || undefined,
  };

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
          <Text style={styles.buildingName}>{buildingDetail.nom}</Text>
          
          <View style={styles.buildingDetails}>
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID Edificio: </Text>
              <Text style={styles.detailValue}>{buildingDetail.id}</Text>
            </Text>
            
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ref. Catastral: </Text>
              <Text style={styles.detailValue}>{buildingDetail.ref_cadastral}</Text>
            </Text>
            
            <Text style={styles.buildingType}>{buildingDetail.tipus_edifici}</Text>
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
            {buildingDetail.imagen ? (
              <Image
                source={{ uri: buildingDetail.imagen }}
                style={styles.buildingImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={DEFAULT_IMAGE}
                style={styles.buildingImage}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </BuildingLayout>
  );
};
