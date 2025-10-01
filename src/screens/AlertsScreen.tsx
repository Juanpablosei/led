import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Toast, ToastType } from '../components/ui';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { styles } from './AlertsScreen.styles';

export const AlertsScreen: React.FC = () => {
  const { t } = useTranslation();
  const [buildingsDays, setBuildingsDays] = useState(12);
  const [homesDays, setHomesDays] = useState(2);
  const [activitiesDays, setActivitiesDays] = useState(2);
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    console.log('Guardar alertas:', { buildingsDays, homesDays, activitiesDays });
    
    // Mostrar toast de éxito
    setToastMessage(t('alerts.successMessage', 'user'));
    setToastType('success');
    setToastVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{t('alerts.title', 'user')}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Edificios */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('alerts.buildings', 'user')}</Text>
            <Text style={styles.sectionDescription}>
              {t('alerts.buildingsDescription', 'user')}
            </Text>
            <Text style={styles.daysLabel}>{t('alerts.days', 'user')}</Text>
            
            <View style={styles.sliderContainer}>
              <View style={styles.sliderValueContainer}>
                <Text style={styles.sliderValue}>{buildingsDays}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={buildingsDays}
                onValueChange={setBuildingsDays}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="#DDDDDD"
                thumbTintColor={colors.primary}
              />
            </View>
          </View>

          {/* Viviendas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('alerts.homes', 'user')}</Text>
            <Text style={styles.sectionDescription}>
              {t('alerts.homesDescription', 'user')}
            </Text>
            <Text style={styles.daysLabel}>{t('alerts.days', 'user')}</Text>
            
            <View style={styles.sliderContainer}>
              <View style={styles.sliderValueContainer}>
                <Text style={styles.sliderValue}>{homesDays}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={homesDays}
                onValueChange={setHomesDays}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="#DDDDDD"
                thumbTintColor={colors.primary}
              />
            </View>
          </View>

          {/* Actividades */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('alerts.activities', 'user')}</Text>
            <Text style={styles.sectionDescription}>
              {t('alerts.activitiesDescription', 'user')}
            </Text>
            <Text style={styles.daysLabel}>{t('alerts.days', 'user')}</Text>
            
            <View style={styles.sliderContainer}>
              <View style={styles.sliderValueContainer}>
                <Text style={styles.sliderValue}>{activitiesDays}</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={activitiesDays}
                onValueChange={setActivitiesDays}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="#DDDDDD"
                thumbTintColor={colors.primary}
              />
            </View>
          </View>

          {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('alerts.save', 'user')}</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>

      {/* Toast notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
};

