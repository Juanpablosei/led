import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { DocumentCard, EditDocumentModal, NewDocumentModal } from '../components/documents';
import { EditDocumentData } from '../components/documents/EditDocumentModal.types';
import { BuildingData } from '../components/home/building-card/BuildingCard.types';
import { Pagination } from '../components/home/pagination/Pagination';
import { colors } from '../constants/colors';
import { useTranslation } from '../hooks/useTranslation';
import { BuildingLayout } from '../layouts/BuildingLayout';
import { BuildingDetailData, BuildingDocument, buildingService } from '../services/buildingService';
import { styles } from './DocumentsScreen.styles';

export const DocumentsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { buildingId } = useLocalSearchParams<{ buildingId: string }>();
  const [buildingDetail, setBuildingDetail] = useState<BuildingDetailData | null>(null);
  const [isLoadingBuilding, setIsLoadingBuilding] = useState(true);
  const [documents, setDocuments] = useState<BuildingDocument[]>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [activeTab, setActiveTab] = useState('tecnica');
  const [isNewDocumentModalVisible, setIsNewDocumentModalVisible] = useState(false);
  const [isEditDocumentModalVisible, setIsEditDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<EditDocumentData | null>(null);
  const [showTypesModal, setShowTypesModal] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<any[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [selectedTypeName, setSelectedTypeName] = useState<string>('');
  const [tempTypeSelection, setTempTypeSelection] = useState<string>('');
  
  // Cargar edificio desde el API
  useEffect(() => {
    loadBuilding();
    loadDocuments();
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

  const loadDocuments = async () => {
    if (!buildingId) return;
    
    setIsLoadingDocuments(true);
    try {
      const response = await buildingService.getBuildingDocuments(Number(buildingId));
      
      if (response.status && 'data' in response) {
        console.log('✅ Documentos cargados:', response.data);
        
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
        
        console.log('📚 Total documentos combinados:', allDocs.length);
        console.log('📚 Por categoría - Técnica:', response.data.edif_doc_tecnica?.length || 0);
        console.log('📚 Por categoría - Admin:', response.data.edif_doc_admin?.length || 0);
        console.log('📚 Por categoría - Jurídica:', response.data.edif_doc_juridica?.length || 0);
        
        setDocuments(allDocs);
      } else {
        console.error('❌ Error al cargar documentos:', response.message);
      }
    } catch (error) {
      console.error('❌ Error al cargar documentos:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

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
    { id: 'tecnica', label: 'Doc. Técnica' },
    { id: 'administrativa', label: 'Doc. Administrativa' },
    { id: 'juridica', label: 'Doc. jurídica' },
  ];

  const handleNewDocument = () => {
    const category = getCurrentCategory();
    console.log('📄 Abriendo modal de nuevo documento para categoría:', category);
    loadDocumentTypes(category);
    setIsNewDocumentModalVisible(true);
  };

  const loadDocumentTypes = async (category: string) => {
    setIsLoadingTypes(true);
    try {
      const response = await buildingService.getDocumentTypes(category);
      
      console.log('📦 Respuesta completa de tipos:', JSON.stringify(response, null, 2));
      
      if (response && typeof response === 'object') {
        const categoryData = response[category];
        
        if (categoryData && typeof categoryData === 'object') {
          const typesArray = Object.entries(categoryData).map(([key, value]) => ({
            id: key,
            texto: value as string,
          }));
          
          console.log('✅ Tipos de documentos cargados:', typesArray.length);
          setDocumentTypes(typesArray);
        } else {
          console.error('❌ No se encontró la categoría en la respuesta:', category);
          setDocumentTypes([]);
        }
      } else {
        console.error('❌ Respuesta vacía o inválida');
        setDocumentTypes([]);
      }
    } catch (error: any) {
      console.error('❌ Error al cargar tipos:', error);
      setDocumentTypes([]);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const handleOpenTypesModal = () => {
    console.log('🔵 Abriendo modal de tipos - showTypesModal:', showTypesModal);
    console.log('🔵 Tipos disponibles:', documentTypes.length);
    // Cerrar temporalmente el modal de nuevo documento para iOS
    setIsNewDocumentModalVisible(false);
    // Abrir el modal de tipos después de un pequeño delay
    setTimeout(() => {
      setShowTypesModal(true);
      console.log('🔵 Modal abierto - nuevo estado: true');
    }, 300);
  };

  const handleSelectType = (typeId: string, typeName: string) => {
    console.log('✅ Tipo seleccionado - ID:', typeId, '- Nombre:', typeName);
    setTempTypeSelection(typeId);
    setSelectedTypeName(typeName);
    setShowTypesModal(false);
    // Reabrir el modal de nuevo documento después de seleccionar
    setTimeout(() => {
      setIsNewDocumentModalVisible(true);
    }, 300);
    console.log('✅ Modal cerrado');
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

      if (response.status) {
        console.log('✅ Documento creado correctamente');
        Alert.alert('Éxito', 'Documento creado correctamente');
        // Recargar documentos
        await loadDocuments();
        // Resetear selecciones
        setTempTypeSelection('');
        setSelectedTypeName('');
      } else {
        console.error('❌ Error al crear documento:', response.message);
        Alert.alert('Error', response.message || 'No se pudo crear el documento');
      }
    } catch (error: any) {
      console.error('❌ Error al guardar documento:', error);
      Alert.alert('Error', 'No se pudo guardar el documento');
    } finally {
      setIsNewDocumentModalVisible(false);
    }
  };

  const handleEditDocument = (document: BuildingDocument) => {
    // Convertir el documento a EditDocumentData
    const editDocument: EditDocumentData = {
      id: String(document.id),
      name: document.nom,
      type: document.tipus,
      file: document.nom_arxiu,
      validUntil: formatDate(document.data_validesa),
      includeInBook: document.afegir_al_libre,
      // Guardar datos adicionales para la actualización
      tipusDocument: document.tipus_document,
      ruta: document.ruta,
    };
    setSelectedDocument(editDocument);
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
          tipus_document: documentData.tipusDocument || '',
          file: documentData.ruta || documentData.file,
          data_validesa: formattedDate,
          afegir_al_libre: documentData.includeInBook,
        }
      );

      if (response.status) {
        console.log('✅ Documento actualizado correctamente');
        Alert.alert('Éxito', 'Documento actualizado correctamente');
        // Recargar documentos
        await loadDocuments();
      } else {
        console.error('❌ Error al actualizar documento:', response.message);
        Alert.alert('Error', response.message || 'No se pudo actualizar el documento');
      }
    } catch (error: any) {
      console.error('❌ Error al guardar documento:', error);
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
        console.log('✅ Documento eliminado correctamente');
        Alert.alert('Éxito', 'Documento eliminado correctamente');
        // Recargar documentos
        await loadDocuments();
      } else {
        console.error('❌ Error al eliminar documento:', response.message);
        Alert.alert('Error', response.message || 'No se pudo eliminar el documento');
      }
    } catch (error: any) {
      console.error('❌ Error al eliminar documento:', error);
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
        {isLoadingDocuments ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#E53E3E" />
            <Text style={{ marginTop: 12, fontSize: 14, color: '#666' }}>
              Cargando documentos...
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
              No hay documentos en esta categoría
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
        onOpenTypesModal={handleOpenTypesModal}
        documentTypes={documentTypes}
        isLoadingTypes={isLoadingTypes}
        selectedTypeName={selectedTypeName}
        onSelectType={handleSelectType}
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

      {/* Modal de selección de tipos - FUERA de BuildingLayout */}
      {showTypesModal && console.log('📺 Renderizando modal de tipos...')}
      <Modal
        visible={showTypesModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          console.log('🔴 Cerrando modal de tipos');
          setShowTypesModal(false);
        }}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent={true}
        hardwareAccelerated={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectionModal}>
            <Text style={styles.selectionModalTitle}>Seleccionar tipo de documento</Text>
            
            {isLoadingTypes ? (
              <View style={styles.selectionLoading}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 12, color: '#666' }}>Cargando tipos...</Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.selectionScrollView}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {documentTypes.map((docType) => (
                  <TouchableOpacity
                    key={docType.id}
                    style={styles.selectionOption}
                    onPress={() => {
                      console.log('🟢 Tipo tocado:', docType.texto);
                      handleSelectType(docType.id, docType.texto);
                    }}
                  >
                    <Text style={styles.selectionOptionText}>{docType.texto}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            
            <TouchableOpacity
              style={styles.selectionCancelButton}
              onPress={() => {
                setShowTypesModal(false);
                // Reabrir el modal de nuevo documento al cancelar
                setTimeout(() => {
                  setIsNewDocumentModalVisible(true);
                }, 300);
              }}
            >
              <Text style={styles.selectionCancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
