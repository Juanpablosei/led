import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { DocumentCard, EditDocumentModal, NewDocumentModal } from '../components/documents';
import { EditDocumentData } from '../components/documents/EditDocumentModal.types';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { Pagination } from '../components/home/pagination/Pagination';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { BuildingDetailData, BuildingDocument, buildingService } from '../services/buildingService';
import { styles } from './DocumentsScreen.styles';

export const DocumentsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const screenWidth = Dimensions.get('window').width;
  
  // Función para obtener el tamaño de fuente basado en el ancho de pantalla
  const getTabFontSize = () => {
    if (screenWidth < 375) {
      return 12; // Pantallas muy pequeñas
    } else if (screenWidth < 414) {
      return 14; // Pantallas pequeñas
    } else {
      return 16; // Pantallas normales y grandes
    }
  };

  // Función para verificar si el usuario puede crear documentos
  const canCreateDocuments = (buildingDetail?: BuildingDetailData): boolean => {
    if (!buildingDetail?.perfil_llibre) {
      return false;
    }
    
    const allowedIds = [1, 3]; // Solo IDs 1 y 3 pueden crear documentos
    const hasPermission = buildingDetail.perfil_llibre.some(profile => 
      allowedIds.includes(profile.id)
    );
    
   
    
    return hasPermission;
  };
  
  const [buildingDetail, setBuildingDetail] = useState<BuildingDetailData | null>(null);
  const [isLoadingBuilding, setIsLoadingBuilding] = useState(true);
  const [documents, setDocuments] = useState<BuildingDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [activeTab, setActiveTab] = useState('tecnica');
  const [isNewDocumentModalVisible, setIsNewDocumentModalVisible] = useState(false);
  const [isEditDocumentModalVisible, setIsEditDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<EditDocumentData | null>(null);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [selectedTypeName, setSelectedTypeName] = useState<string>('');
  const [tempTypeSelection, setTempTypeSelection] = useState<string>('');
  
  const loadBuilding = useCallback(async () => {
    if (!buildingId) return;
    
    setIsLoadingBuilding(true);
    try {
      const response = await buildingService.getBuildingById(Number(buildingId));
      
      if (response.status && response.data) {
        setBuildingDetail(response.data);
      } else {
        console.error(' Error al cargar edificio:', response.message);
      }
    } catch (error) {
      console.error(' Error al cargar edificio:', error);
    } finally {
      setIsLoadingBuilding(false);
    }
  }, [buildingId]);

  const loadDocuments = useCallback(async () => {
    if (!buildingId) return;
    
    setIsLoadingDocuments(true);
    try {
      const response = await buildingService.getBuildingDocuments(Number(buildingId));
      
      if (response.status && 'data' in response) {
        
        // Combinar todos los documentos de todas las categorías
        const allDocs: BuildingDocument[] = [];
        
        if (response.data.edif_doc_tecnica) {
          allDocs.push(...response.data.edif_doc_tecnica);
        }
        if (response.data.edif_doc_admin) {
          allDocs.push(...response.data.edif_doc_admin);
        }
        if (response.data.edif_doc_juridica) {
          allDocs.push(...response.data.edif_doc_juridica);
        }
        if (response.data.edif_doc_otros) {
          allDocs.push(...response.data.edif_doc_otros);
        }
        
        
        setDocuments(allDocs);
      } else {
        console.error(' Error al cargar documentos:', response.message);
      }
    } catch (error) {
      console.error(' Error al cargar documentos:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [buildingId]);

  // Cargar edificio desde el API
  useEffect(() => {
    loadBuilding();
    loadDocuments();
  }, [buildingId, loadBuilding, loadDocuments]);

  // Función para formatear la fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Función para verificar si un documento ha expirado
  const isExpired = (dateString: string | null) => {
    if (!dateString) return false;
    
    try {
      const date = new Date(dateString);
      return date < new Date();
    } catch {
      return false;
    }
  };

  // Filtrar documentos por categoría
  const getFilteredDocuments = () => {
    if (!documents) return [];
    
    return documents.filter(doc => {
      const categoryMap: { [key: string]: string } = {
        'tecnica': 'edif_doc_tecnica',
        'administrativa': 'edif_doc_admin',
        'juridica': 'edif_doc_juridica',
      };
      
      return doc.doc_params_padre_id === categoryMap[activeTab];
    });
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
    { id: 'tecnica', label: t('technical', 'documents') },
    { id: 'administrativa', label: t('administrative', 'documents') },
    { id: 'juridica', label: t('legal', 'documents') },
  ];

  const handleNewDocument = () => {
    const category = getCurrentCategory();
    loadDocumentTypes(category);
    setIsNewDocumentModalVisible(true);
  };

  const loadDocumentTypes = async (category: string) => {
    setIsLoadingTypes(true);
    try {
      const response = await buildingService.getDocumentTypes(category);
            
      if (response && typeof response === 'object') {
        const categoryData = response[category];
        
        if (categoryData && typeof categoryData === 'object') {
          const typesArray = Object.entries(categoryData).map(([key, value]) => ({
            id: key,
            texto: value as string,
          }));
          
          setDocumentTypes(typesArray);
        } else {
          setDocumentTypes([]);
        }
      } else {
        setDocumentTypes([]);
      }
    } catch (error: any) {
      console.error(' Error al cargar tipos:', error);
      setDocumentTypes([]);
    } finally {
      setIsLoadingTypes(false);
    }
  };


  // Obtener la categoría según el tab activo
  const getCurrentCategory = () => {
    const categoryMap: { [key: string]: string } = {
      'tecnica': 'edif_doc_tecnica',
      'administrativa': 'edif_doc_admin',
      'juridica': 'edif_doc_juridica',
    };
    
    return categoryMap[activeTab] || 'edif_doc_admin';
  };

  const handleCloseModal = () => {
    setIsNewDocumentModalVisible(false);
  };

  const handleSaveDocument = async (documentData: any) => {
    console.log('Guardar documento:', documentData);
    console.log('buildingId:', buildingId);
    console.log('tempTypeSelection:', tempTypeSelection);
    
    if (!buildingId) return;
    
    try {
      // Convertir la fecha al formato YYYY-MM-DD
      const dateMatch = documentData.validUntil.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const formattedDate = dateMatch 
        ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}` 
        : documentData.validUntil;

      // Usar el tipo seleccionado del estado temporal
      const typeToSave = tempTypeSelection || documentData.type;
      
  
      const response = await buildingService.createBuildingDocument(
        Number(buildingId),
        {
          nom: documentData.name,
          tipus_document: typeToSave,
          file: documentData.fileData,
          data_validesa: formattedDate,
          afegir_al_libre: documentData.includeInBook,
        }
      );
      
      console.log('Respuesta del servidor:', response);

      if (response.status) {
        Alert.alert('Éxito', 'Documento creado correctamente');
        // Recargar documentos
        await loadDocuments();
        // Resetear selecciones
        setTempTypeSelection('');
        setSelectedTypeName('');
        // Cerrar modal solo si fue exitoso
        setIsNewDocumentModalVisible(false);
      } else {
        Alert.alert('Error', response.message || 'No se pudo crear el documento');
        // Lanzar error para que el modal no se cierre
        throw new Error(response.message || 'No se pudo crear el documento');
      }
    } catch (error: any) {
      console.error('Error al guardar documento:', error);
      Alert.alert('Error', `No se pudo guardar el documento: ${error.message || 'Error desconocido'}`);
      // Re-lanzar el error para que el modal no se cierre
      throw error;
    }
  };

  const handleEditDocument = (document: BuildingDocument) => {
    // Convertir el documento a EditDocumentData
    const editDocument: EditDocumentData = {
      id: String(document.id),
      name: document.nom,
      type: document.tipus_document || document.tipus, // Usar ID si está disponible, sino el nombre
      file: document.nom_arxiu,
      validUntil: formatDate(document.data_validesa),
      includeInBook: document.afegir_al_libre,
      // Guardar datos adicionales para la actualización
      tipusDocument: document.tipus_document,
      ruta: document.ruta,
    };
    setSelectedDocument(editDocument);
    
    // Cargar tipos de documentos para el modal de editar
    const category = getCurrentCategory();
    loadDocumentTypes(category);
    
    setIsEditDocumentModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditDocumentModalVisible(false);
    setSelectedDocument(null);
  };

  const handleSaveEditDocument = async (documentData: EditDocumentData) => {
    console.log('Guardar documento editado:', documentData);
    
    if (!buildingId) return;
    
    try {
      // Convertir la fecha al formato YYYY-MM-DD
      const dateMatch = documentData.validUntil.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const formattedDate = dateMatch 
        ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}` 
        : documentData.validUntil;

      const response = await buildingService.updateBuildingDocument(
        Number(documentData.id),
        Number(buildingId),
        {
          nom: documentData.name,
          tipus_document: documentData.type || '',
          file: documentData.ruta || documentData.file,
          data_validesa: formattedDate,
          afegir_al_libre: documentData.includeInBook,
        }
      );

      if (response.status) {
        Alert.alert('Éxito', 'Documento actualizado correctamente');
        // Recargar documentos
        await loadDocuments();
      } else {
        Alert.alert('Error', response.message || 'No se pudo actualizar el documento');
      }
    } catch (error: any) {
      console.error(' Error al guardar documento:', error);
      Alert.alert('Error', 'No se pudo guardar el documento');
    } finally {
      setIsEditDocumentModalVisible(false);
      setSelectedDocument(null);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    console.log('Eliminar documento:', documentId);
    
    try {
      const response = await buildingService.deleteBuildingDocument(Number(documentId));

      if (response.status) {
        Alert.alert('Éxito', 'Documento eliminado correctamente');
        // Recargar documentos
        await loadDocuments();
      } else {
        Alert.alert('Error', response.message || 'No se pudo eliminar el documento');
      }
    } catch (error: any) {
      console.error(' Error al eliminar documento:', error);
      Alert.alert('Error', 'No se pudo eliminar el documento');
    } finally {
      setIsEditDocumentModalVisible(false);
      setSelectedDocument(null);
    }
  };

  const renderDocumentCard = (document: BuildingDocument) => {
    // Convertir BuildingDocument al formato que espera DocumentCard
    const cardDocument = {
      id: String(document.id),
      title: document.nom,
      type: document.tipus,
      validUntil: formatDate(document.data_validesa),
      isExpired: isExpired(document.data_validesa),
      isIncludedInBook: document.afegir_al_libre,
    };
    
    return (
      <DocumentCard
        key={document.id}
        document={cardDocument}
        onPress={() => handleEditDocument(document)}
      />
    );
  };

  const filteredDocuments = getFilteredDocuments();

  return (
    <>
      <BuildingLayout building={building}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Título de la sección */}
        <Text style={styles.sectionTitle}>{t('libraryTitle', 'documents')}</Text>

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
                activeTab === tab.id && styles.tabTextActive,
                { fontSize: getTabFontSize() }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Subtítulo y botón NUEVO */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {activeTab === 'tecnica' && t('technicalDocumentation', 'documents')}
            {activeTab === 'administrativa' && t('administrativeDocumentation', 'documents')}
            {activeTab === 'juridica' && t('legalDocumentation', 'documents')}
          </Text>
          {canCreateDocuments(buildingDetail) && (
            <TouchableOpacity style={styles.newButton} onPress={handleNewDocument}>
              <Text style={styles.newButtonText}>+ {t('new', 'documents')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de documentos */}
        {isLoadingDocuments ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#E53E3E" />
            <Text style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
              {t('loadingDocuments', 'documents')}
            </Text>
          </View>
        ) : filteredDocuments.length > 0 ? (
          <>
            <View style={styles.documentsList}>
              {filteredDocuments.map(renderDocumentCard)}
            </View>

            {/* Paginación */}
            <Pagination
              currentPage={1}
              totalPages={Math.ceil(filteredDocuments.length / 10)}
              totalItems={filteredDocuments.length}
              onPageChange={(page) => console.log('Page changed:', page)}
            />
          </>
        ) : (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: '#999' }}>
              {t('noDocuments', 'documents')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal Nuevo Documento */}
      <NewDocumentModal
        isVisible={isNewDocumentModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveDocument}
        category={getCurrentCategory()}
        documentTypes={documentTypes}
        isLoadingTypes={isLoadingTypes}
        selectedTypeName={selectedTypeName}
        selectedTypeId={tempTypeSelection}
      />

      {/* Modal Editar Documento */}
      <EditDocumentModal
        isVisible={isEditDocumentModalVisible}
        document={selectedDocument}
        onClose={handleCloseEditModal}
        onSave={handleSaveEditDocument}
        onDelete={handleDeleteDocument}
        isReadOnly={!canCreateDocuments(buildingDetail)}
        documentTypes={documentTypes}
        isLoadingTypes={isLoadingTypes}
      />
      </BuildingLayout>

     
    </>
  );
};
