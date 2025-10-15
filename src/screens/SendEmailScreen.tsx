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

export const SendEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const [buildingDetail, setBuildingDetail] = useState<BuildingDetailData | null>(null);
  const [isLoadingBuilding, setIsLoadingBuilding] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [users, setUsers] = useState<UserSelectData[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const itemsPerPage = 15;

  // Cargar edificio desde el API
  useEffect(() => {
    loadBuilding();
  }, [buildingId]);

  // Cargar usuarios cuando cambia la página
  useEffect(() => {
    if (buildingId) {
      loadUsers(currentPage);
    }
  }, [buildingId, currentPage]);

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

  const loadUsers = async (page: number) => {
    if (!buildingId) return;
    
    setIsLoadingUsers(true);
    try {
      const response = await buildingService.getBuildingUsers(Number(buildingId), page, itemsPerPage);
      
      if (response.status && 'data' in response) {
        console.log('✅ Usuarios cargados:', response.data.total);
        
        // Mapear usuarios del API al formato UserSelectData
        // Mantener selecciones previas si el usuario ya estaba seleccionado
        const usersData: UserSelectData[] = response.data.data.map((user) => ({
          id: String(user.user_id),  // ← Usar user_id en lugar de id
          name: user.first_name,
          surname: user.last_name,
          isSelected: selectedUserIds.has(String(user.user_id)),
        }));
        
        setUsers(usersData);
        setTotalPages(response.data.last_page);
        setTotalUsers(response.data.total);
      } else {
        console.error('❌ Error al cargar usuarios:', response.message);
      }
    } catch (error) {
      console.error('❌ Error de red al cargar usuarios:', error);
    } finally {
      setIsLoadingUsers(false);
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
    // La paginación la maneja el API, solo devolvemos los usuarios actuales
    return users;
  };

  const handleToggleUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Actualizar el estado local de usuarios
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u.id === userId ? { ...u, isSelected: !u.isSelected } : u
      )
    );
    
    // Actualizar el Set de IDs seleccionados para mantener selecciones entre páginas
    setSelectedUserIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(userId)) {
        newIds.delete(userId);
      } else {
        newIds.add(userId);
      }
      return newIds;
    });
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleContinue = () => {
    if (selectedUserIds.size === 0) {
      showToast(t('errors.noUsersSelected', 'email'), 'error');
      return;
    }
    console.log('✅ Usuarios seleccionados:', selectedUserIds.size);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSendEmail = async (emailData: EmailFormData) => {
    if (selectedUserIds.size === 0) {
      showToast(t('errors.noUsersSelected', 'email'), 'error');
      return;
    }

    try {
      setIsLoadingUsers(true);
      
      // Preparar datos para el API (no incluir adjuntos si está vacío)
      const sendEmailData: any = {
        assumpte: emailData.subject,  // ← Asunto como texto normal
        message: emailData.message,
        plantilles_email_id: 0,
        edifici_id: buildingId || '',
        lista_ids: Array.from(selectedUserIds),
      };
      
      // Solo agregar adjuntos si hay archivos (ya vienen con base64 desde el form)
      if (emailData.attachments && emailData.attachments.length > 0) {
        sendEmailData.adjuntos = emailData.attachments;
      }

      console.log('📧 Enviando email...');
      console.log('Usuarios seleccionados:', selectedUserIds.size);
      console.log('Lista IDs:', Array.from(selectedUserIds));
      console.log('Adjuntos:', emailData.attachments.length);

      const response = await buildingService.sendBuildingEmail(sendEmailData);

      if (response.status) {
        // Mostrar toast de éxito
        const successMessage = t('success.emailSent', 'email').replace('{{count}}', selectedUserIds.size.toString());
        showToast(successMessage, 'success');
        
        // Regresar después de 1.5 segundos
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        showToast(response.message || 'Error al enviar el email', 'error');
      }
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      showToast('Error de conexión al enviar el email', 'error');
    } finally {
      setIsLoadingUsers(false);
    }
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
              <ScrollView 
                style={styles.usersScrollContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {isLoadingUsers ? (
                  <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#E53E3E" />
                    <Text style={{ marginTop: 12, color: '#666' }}>Cargando usuarios...</Text>
                  </View>
                ) : (
                  getCurrentPageUsers().map(item => (
                    <UserSelectItem key={item.id} user={item} onToggle={handleToggleUser} />
                  ))
                )}
              </ScrollView>
            </View>

            {/* Paginación */}
            <View style={styles.paginationContainer}>
              <Text style={styles.totalText}>
                {t('total', 'email')}: {totalUsers} {t('elements', 'email')}
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
