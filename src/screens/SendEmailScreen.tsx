import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { EmailForm, StepIndicator, UserSelectItem } from '../components/email';
import { EmailFormData } from '../components/email/EmailForm.types';
import { UserSelectData } from '../components/email/UserSelectItem.types';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { Toast, ToastType } from '../components/ui';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { BuildingDetailData, buildingService } from '../services/buildingService';
import { styles } from './SendEmailScreen.styles';

const mockUsers: UserSelectData[] = Array.from({ length: 12 }, (_, index) => ({
  id: `${index + 1}`,
  name: 'Nombre',
  surname: 'Apellidos Completos',
  isSelected: false,
}));

export const SendEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const [buildingDetail, setBuildingDetail] = useState<BuildingDetailData | null>(null);
  const [isLoadingBuilding, setIsLoadingBuilding] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [users, setUsers] = useState<UserSelectData[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const itemsPerPage = 8;
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Cargar edificio desde el API
  useEffect(() => {
    loadBuilding();
  }, [buildingId]);

  const loadBuilding = async () => {
    if (!buildingId) return;
    
    setIsLoadingBuilding(true);
    try {
      const response = await buildingService.getBuildingById(Number(buildingId));
      
      if (response.status && response.data) {
        console.log('✅ Edificio cargado para enviar email:', response.data.nom);
        setBuildingDetail(response.data);
      } else {
        console.error('❌ Error al cargar edificio:', response.message);
      }
    } catch (error) {
      console.error('❌ Error al cargar edificio:', error);
    } finally {
      setIsLoadingBuilding(false);
    }
  };

  // Mostrar loading mientras carga el edificio
  if (isLoadingBuilding || !buildingDetail) {
    return (
      <BuildingLayout building={null}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={{ marginTop: 12, fontSize: 16, color: '#666' }}>
            Cargando edificio...
          </Text>
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

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  const handleToggleUser = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isSelected: !user.isSelected } : user
      )
    );
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleContinue = () => {
    const selectedUsers = users.filter(u => u.isSelected);
    if (selectedUsers.length === 0) {
      showToast(t('errors.noUsersSelected', 'email'), 'error');
      return;
    }
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSendEmail = (emailData: EmailFormData) => {
    const selectedUsers = users.filter(u => u.isSelected);
    console.log('Enviar email a:', selectedUsers);
    console.log('Datos del email:', emailData);
    
    // Mostrar toast de éxito
    const successMessage = t('success.emailSent', 'email').replace('{{count}}', selectedUsers.length.toString());
    showToast(successMessage, 'success');
    
    // Regresar después de 1.5 segundos (tiempo suficiente para ver el toast)
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  return (
    <BuildingLayout building={building}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('title', 'email')}</Text>
        </View>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={2} />

        {/* Content based on step */}
        {currentStep === 1 ? (
          <>
            {/* Step 1: Seleccione los usuarios */}
            <Text style={styles.sectionTitle}>{t('selectUsers', 'email')}</Text>

            {/* Header con "Nombres" */}
            <View style={styles.headerSection}>
              <Text style={styles.headerLabel}>{t('names', 'email')}</Text>
            </View>

            {/* Lista de usuarios */}
            <View style={styles.usersListContainer}>
              {getCurrentPageUsers().map(item => (
                <UserSelectItem key={item.id} user={item} onToggle={handleToggleUser} />
              ))}
            </View>

            {/* Paginación */}
            <View style={styles.paginationContainer}>
              <Text style={styles.totalText}>
                {t('total', 'email')}: {users.length} {t('elements', 'email')}
              </Text>
              <View style={styles.paginationButtons}>
                <TouchableOpacity
                  style={styles.pageButton}
                  onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.pageButtonText}>{'<'}</Text>
                </TouchableOpacity>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <TouchableOpacity
                    key={page}
                    style={[
                      styles.pageButton,
                      currentPage === page && styles.pageButtonActive,
                    ]}
                    onPress={() => setCurrentPage(page)}
                  >
                    <Text
                      style={[
                        styles.pageButtonText,
                        currentPage === page && styles.pageButtonTextActive,
                      ]}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.pageButton}
                  onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <Text style={styles.pageButtonText}>{'>'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Step 2: Complete los campos */}
            <Text style={styles.sectionTitle}>{t('completeFields', 'email')}</Text>
            
            {/* Email Form - ahora con ref para acceder al submit */}
            <EmailForm onSubmit={handleSendEmail} />
            
            {/* Buttons - movidos aquí para estar dentro del EmailForm context */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={20} color="#333333" />
                <Text style={styles.backButtonText}>{t('back', 'email')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Continue Button - solo en step 1 */}
        {currentStep === 1 && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>{t('continue', 'email')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Toast notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </BuildingLayout>
  );
};
