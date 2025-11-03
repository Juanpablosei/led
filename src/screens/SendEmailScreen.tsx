import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const itemsPerPage = 15;

  const loadBuilding = useCallback(async () => {
    if (!buildingId) return;
    
    setIsLoadingBuilding(true);
    try {
      const response = await buildingService.getBuildingById(Number(buildingId));
      
      if (response.status && response.data) {
        setBuildingDetail(response.data);
      } else {
        // Error al cargar edificio
      }
    } catch {
      // Error al cargar edificio
    } finally {
      setIsLoadingBuilding(false);
    }
  }, [buildingId]);

  const loadUsers = useCallback(async (page: number) => {
    if (!buildingId) return;
    
    setIsLoadingUsers(true);
    try {
      const response = await buildingService.getBuildingUsers(Number(buildingId), page, itemsPerPage);
      
      if (response.status && 'data' in response) {
        // Mapear usuarios del API al formato UserSelectData
        // NO incluir isSelected aquí para evitar recargas innecesarias
        const usersData: UserSelectData[] = response.data.data.map((user) => ({
          id: String(user.user_id),  // ← Usar user_id en lugar de id
          name: user.first_name,
          surname: user.last_name,
          isSelected: false, // Se establecerá correctamente en handleToggleUser
        }));
        
        setUsers(usersData);
        setTotalPages(response.data.last_page);
        setTotalUsers(response.data.total);
      } else {
        // Error al cargar usuarios
      }
    } catch {
      // Error de red al cargar usuarios
    } finally {
      setIsLoadingUsers(false);
    }
  }, [buildingId, itemsPerPage]);

  // Cargar edificio desde el API
  useEffect(() => {
    loadBuilding();
  }, [buildingId, loadBuilding]);

  // Cargar usuarios cuando cambia la página
  useEffect(() => {
    if (buildingId) {
      loadUsers(currentPage);
    }
  }, [buildingId, currentPage, loadUsers]);

  // Mostrar loading mientras carga el edificio
  if (isLoadingBuilding || !buildingDetail) {
    return (
      <BuildingLayout building={null}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={{ marginTop: 12, fontSize: 16, color: '#666' }}>
            {t('loadingBuilding', 'common')}
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
    // La paginación la maneja el API, pero necesitamos actualizar el estado de selección
    return users.map(user => ({
      ...user,
      isSelected: selectedUserIds.has(user.id)
    }));
  };

  const handleToggleUser = (userId: string) => {
    // Solo actualizar el Set de IDs seleccionados
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

    setIsSendingEmail(true);
    try {
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
    } catch {
      // Error al enviar email
      showToast('Error de conexión al enviar el email', 'error');
    } finally {
      setIsSendingEmail(false);
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
            <EmailForm onSubmit={handleSendEmail} isLoading={isSendingEmail} />
            
            {/* Buttons - movidos aquí para estar dentro del EmailForm context */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.backButton, isSendingEmail && styles.backButtonDisabled]} 
                onPress={handleBack}
                disabled={isSendingEmail}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={20} 
                  color={isSendingEmail ? "#999999" : "#333333"} 
                />
                <Text style={[styles.backButtonText, isSendingEmail && styles.backButtonTextDisabled]}>
                  {t('back', 'email')}
                </Text>
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
