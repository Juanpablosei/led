import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DocumentCard, NewDocumentModal } from '../components/documents';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { Pagination } from '../components/home/pagination/Pagination';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { styles } from './DocumentsScreen.styles';

// Datos de ejemplo para desarrollo
const mockBuildings: BuildingData[] = [
  {
    id: '1',
    title: 'TEST: Edifici fictici per presentacions',
    type: 'Edificio residencial plurifamiliar (EXISTENTE)',
    buildingId: '8862',
    cadastralReference: '8931613DF2883B',
    imageUrl: undefined,
  },
  // ... otros edificios
];

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
  const [activeTab, setActiveTab] = useState('tecnica');
  const [isNewDocumentModalVisible, setIsNewDocumentModalVisible] = useState(false);
  
  // Buscar el edificio por ID
  const building = mockBuildings.find(b => b.id === buildingId);

  if (!building) {
    return null;
  }

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

  const renderDocumentCard = (document: any) => (
    <DocumentCard
      key={document.id}
      document={document}
      onPress={() => console.log('Document pressed:', document.id)}
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
    </BuildingLayout>
  );
};
