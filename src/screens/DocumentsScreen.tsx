import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DocumentCard, EditDocumentModal, NewDocumentModal } from '../components/documents';
import { EditDocumentData } from '../components/documents/EditDocumentModal.types';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { Pagination } from '../components/home/pagination/Pagination';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { BuildingDetailData, buildingService } from '../services/buildingService';
import { styles } from './DocumentsScreen.styles';

const mockDocuments = [
  {
    id: '1',
    title: 'Identificación del edificio',
    type: 'Inspección Técnica de Edificios',
    validUntil: '15/05/2027',
    isExpired: false,
    isIncludedInBook: true,
  },
  {
    id: '2',
    title: 'Operaciones de Mantenimiento',
    type: 'Inspección Técnica de Edificios',
    validUntil: '15/05/2024',
    isExpired: true,
    isIncludedInBook: false,
  },
  {
    id: '3',
    title: 'Plano Mar',
    type: 'Inspección Técnica de Edificios',
    validUntil: '15/05/2025',
    isExpired: true,
    isIncludedInBook: true,
  },
  {
    id: '4',
    title: 'Certificado de Instalaciones',
    type: 'Inspección Técnica de Edificios',
    validUntil: '15/05/2026',
    isExpired: false,
    isIncludedInBook: false,
  },
  {
    id: '5',
    title: 'Informe de Seguridad',
    type: 'Inspección Técnica de Edificios',
    validUntil: '15/05/2027',
    isExpired: false,
    isIncludedInBook: true,
  },
];

export const DocumentsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const [buildingDetail, setBuildingDetail] = useState<BuildingDetailData | null>(null);
  const [isLoadingBuilding, setIsLoadingBuilding] = useState(true);
  const [activeTab, setActiveTab] = useState('tecnica');
  const [isNewDocumentModalVisible, setIsNewDocumentModalVisible] = useState(false);
  const [isEditDocumentModalVisible, setIsEditDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<EditDocumentData | null>(null);
  
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
        console.log('✅ Edificio cargado para biblioteca:', response.data.nom);
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

  const tabs = [
    { id: 'tecnica', label: 'Doc. Técnica' },
    { id: 'administrativa', label: 'Doc. Administrativa' },
    { id: 'juridica', label: 'Doc. jurídica' },
  ];

  const handleNewDocument = () => {
    setIsNewDocumentModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsNewDocumentModalVisible(false);
  };

  const handleSaveDocument = (documentData: any) => {
    console.log('Guardar documento:', documentData);
    // Aquí implementarías la lógica para guardar el documento
    setIsNewDocumentModalVisible(false);
  };

  const handleEditDocument = (document: any) => {
    // Convertir el documento a EditDocumentData
    const editDocument: EditDocumentData = {
      id: document.id,
      name: document.title,
      type: document.type,
      file: 'BDN103CIR0078CMH_signat.pdf', // Archivo de ejemplo
      validUntil: document.validUntil,
      includeInBook: document.isIncludedInBook,
    };
    setSelectedDocument(editDocument);
    setIsEditDocumentModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditDocumentModalVisible(false);
    setSelectedDocument(null);
  };

  const handleSaveEditDocument = (documentData: EditDocumentData) => {
    console.log('Guardar documento editado:', documentData);
    // Aquí implementarías la lógica para guardar el documento editado
    setIsEditDocumentModalVisible(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = (documentId: string) => {
    console.log('Eliminar documento:', documentId);
    // Aquí implementarías la lógica para eliminar el documento
    setIsEditDocumentModalVisible(false);
    setSelectedDocument(null);
  };

  const renderDocumentCard = (document: any) => (
    <DocumentCard
      key={document.id}
      document={document}
      onPress={() => handleEditDocument(document)}
    />
  );

  return (
    <BuildingLayout building={building}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título de la sección */}
        <Text style={styles.sectionTitle}>Biblioteca de documentos</Text>

        {/* Pestañas */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subtítulo y botón NUEVO */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Documentación técnica</Text>
          <TouchableOpacity style={styles.newButton} onPress={handleNewDocument}>
            <Text style={styles.newButtonText}>+ NUEVO</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de documentos */}
        <View style={styles.documentsList}>
          {mockDocuments.map(renderDocumentCard)}
        </View>

        {/* Paginación */}
        <Pagination
          currentPage={1}
          totalPages={2}
          totalItems={12}
          onPageChange={(page) => console.log('Page changed:', page)}
        />
      </ScrollView>

      {/* Modal Nuevo Documento */}
      <NewDocumentModal
        isVisible={isNewDocumentModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveDocument}
      />

      {/* Modal Editar Documento */}
      <EditDocumentModal
        isVisible={isEditDocumentModalVisible}
        document={selectedDocument}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditDocument}
        onDelete={handleDeleteDocument}
      />
    </BuildingLayout>
  );
};
