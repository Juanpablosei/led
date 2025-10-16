import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { colors } from '../../constants/colors';
import { styles } from './EditDocumentModal.styles';
import { EditDocumentData, EditDocumentModalProps } from './EditDocumentModal.types';

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  isVisible,
  document,
  onClose,
  onSave,
  onDelete,
  isReadOnly = false,
}) => {
  const [formData, setFormData] = useState<EditDocumentData>({
    id: '',
    name: '',
    type: '',
    file: '',
    validUntil: '',
    includeInBook: false,
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);

  const documentTypes = [
    'Inspección Técnica de Edificios',
    'Certificado de Instalaciones',
    'Informe de Seguridad',
    'Plano de Instalaciones',
    'Manual de Mantenimiento',
  ];

  // Cargar datos del documento cuando se abre el modal
  useEffect(() => {
    if (document) {
      setFormData(document);
      if (document.validUntil) {
        // Parsear la fecha existente
        const dateParts = document.validUntil.split('/');
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // Los meses en JS son 0-indexados
          const year = parseInt(dateParts[2]);
          setSelectedDate(new Date(year, month, day));
        }
      }
    }
  }, [document]);

  const handleInputChange = (field: keyof EditDocumentData, value: string | boolean) => {
    setFormData((prev: EditDocumentData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.type && formData.file && formData.validUntil) {
      onSave(formData);
      onClose();
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Eliminar documento',
      '¿Estás seguro de que quieres eliminar este documento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            onDelete(formData.id);
            onClose();
          }
        }
      ]
    );
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileSizeMB = file.size ? file.size / (1024 * 1024) : 0;
        
        if (fileSizeMB > 10) {
          Alert.alert('Error', 'El archivo es demasiado grande. Máximo 10 MB.');
          return;
        }

        handleInputChange('file', file.name);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const showTypesPicker = () => {
    console.log("🟡 Abriendo selector de tipos");
    setShowTypesDropdown(true);
  };

  const hideTypesPicker = () => {
    setShowTypesDropdown(false);
  };

  const handleSelectType = (typeName: string) => {
    console.log("✅ Tipo seleccionado:", typeName);
    handleInputChange('type', typeName);
    setShowTypesDropdown(false);
  };

  const handleConfirm = (date: Date) => {
    console.log('Date confirmed:', date);
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    console.log('Formatted date:', formattedDate);
    handleInputChange('validUntil', formattedDate);
    hideDatePicker();
  };

  if (!document) return null;

  return (
    <>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent={true}
        presentationStyle="overFullScreen"
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modal}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Editar documento</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  {/* Nombre */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      Nombre: <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === 'name' && styles.inputFocused,
                        isReadOnly && styles.inputReadOnly
                      ]}
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Ingrese el nombre del documento"
                      editable={!isReadOnly}
                    />
                  </View>

                  {/* Tipo documento */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      Tipo documento: <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity 
                      style={[styles.dropdown, isReadOnly && styles.dropdownReadOnly]} 
                      onPress={isReadOnly ? undefined : showTypesPicker}
                      disabled={isReadOnly}
                    >
                      <Text style={[styles.dropdownText, isReadOnly && styles.dropdownTextReadOnly]}>
                        {formData.type || 'Seleccionar tipo'}
                      </Text>
                      {!isReadOnly && <Ionicons name="chevron-down" size={20} color={colors.text} />}
                    </TouchableOpacity>

                    {/* Dropdown de tipos */}
                    {showTypesDropdown && !isReadOnly && (
                      <TouchableWithoutFeedback onPress={hideTypesPicker}>
                        <View style={styles.dropdownList}>
                          <ScrollView style={styles.dropdownListScroll}>
                            {documentTypes.map((docType, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.dropdownItem}
                                onPress={() => handleSelectType(docType)}
                              >
                                <Text style={styles.dropdownItemText}>
                                  {docType}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  </View>

                  {/* Documento - SOLO LECTURA */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>
                      Documento:
                    </Text>
                    <View style={styles.fileContainerReadOnly}>
                      <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
                      <Text style={styles.fileTextReadOnly}>
                        {formData.file || 'Sin archivos seleccionados'}
                      </Text>
                    </View>
                  </View>

                  {/* Válido hasta */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Válido hasta:</Text>
                    <TouchableOpacity 
                      style={[styles.dateContainer, isReadOnly && styles.dateContainerReadOnly]} 
                      onPress={isReadOnly ? undefined : () => {
                        console.log("📅 Date container pressed");
                        showDatePicker();
                      }}
                      disabled={isReadOnly}
                    >
                      <Text style={[styles.dateInput, isReadOnly && styles.dateInputReadOnly]}>
                        {formData.validUntil || 'dd/mm/aaaa'}
                      </Text>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        date={selectedDate}
                        onConfirm={handleConfirm}
                        onCancel={() => {
                          hideDatePicker();
                        }}
                        locale="es-ES"
                        textColor={colors.text}
                        accentColor={colors.primary}
                        display="inline"
                        isDarkModeEnabled={false}
                        modalStyleIOS={{
                          backgroundColor: "transparent",
                          justifyContent: "center",
                          alignItems: "center",
                          paddingBottom: 0,
                        }}
                        customCancelButtonIOS={() => null}
                        confirmTextIOS="Aceptar"
                        themeVariant="light"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Checkbox */}
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={[styles.checkbox, isReadOnly && styles.checkboxReadOnly]}
                      onPress={isReadOnly ? undefined : () => handleInputChange('includeInBook', !formData.includeInBook)}
                      disabled={isReadOnly}
                    >
                      <Ionicons
                        name={formData.includeInBook ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={formData.includeInBook ? colors.primary : colors.text}
                      />
                    </TouchableOpacity>
                    <Text style={[styles.checkboxText, isReadOnly && styles.checkboxTextReadOnly]}>
                      Incluir en el Libro del edificio (Sólo se admiten documentos en formato pdf)
                    </Text>
                  </View>

                  <Text style={styles.infoText}>
                    Los documentos que se quieran incluir en el Libro del edificio no deben estar bloqueados ni protegidos con contraseña.
                  </Text>
                </View>

                {/* Action Buttons - Solo mostrar si no es modo solo lectura */}
                {!isReadOnly && (
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                      <Text style={styles.deleteButtonText}>ELIMINAR</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                      <Ionicons name="lock-closed" size={20} color={colors.white} />
                      <Text style={styles.saveButtonText}>GUARDAR</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Botón de cerrar para modo solo lectura */}
                {isReadOnly && (
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={onClose}>
                      <Ionicons name="close" size={20} color={colors.white} />
                      <Text style={styles.saveButtonText}>CERRAR</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </>
  );
};
