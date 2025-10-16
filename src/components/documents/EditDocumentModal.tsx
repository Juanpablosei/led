import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
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
  documentTypes = [],
  isLoadingTypes = false,
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
  const [selectedTypeName, setSelectedTypeName] = useState('');

  // Función para encontrar el nombre del tipo por ID
  const getTypeNameById = useCallback((typeId: string): string => {
    const type = documentTypes.find(docType => docType.id === typeId);
    return type ? type.texto : typeId; // Si no se encuentra, devolver el ID
  }, [documentTypes]);

  // Cargar datos del documento cuando se abre el modal
  useEffect(() => {
    if (document) {
      setFormData(document);
      // Establecer el nombre del tipo basado en el ID
      setSelectedTypeName(getTypeNameById(document.type));
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
  }, [document, getTypeNameById]);

  const handleInputChange = (field: keyof EditDocumentData, value: string | boolean) => {
    setFormData((prev: EditDocumentData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (formData.name && formData.type && formData.validUntil) {
      try {
        await onSave(formData);
        onClose();
      } catch {
        Alert.alert("Error", "No se pudo guardar el documento. Inténtalo de nuevo.");
      }
    } else {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este documento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            onDelete(formData.id);
          },
        },
      ]
    );
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

  const handleSelectType = (typeId: string, typeName: string) => {
    console.log("✅ Tipo seleccionado:", typeName);
    handleInputChange('type', typeId);
    setSelectedTypeName(typeName);
    setShowTypesDropdown(false);
  };

  const handleConfirm = (date: Date) => {
    console.log('Date confirmed:', date);
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    handleInputChange('validUntil', formattedDate);
    hideDatePicker();
  };

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
                <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
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
                        onChangeText={(text) => handleInputChange('name', text)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Nombre del documento"
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
                          {isLoadingTypes
                            ? "Cargando tipos..."
                            : selectedTypeName || 'Seleccionar tipo'}
                        </Text>
                        {!isReadOnly && <Ionicons name="chevron-down" size={20} color={colors.text} />}
                      </TouchableOpacity>

                      {/* Dropdown de tipos */}
                      {showTypesDropdown && !isReadOnly && (
                        <TouchableWithoutFeedback onPress={hideTypesPicker}>
                          <View style={styles.dropdownList}>
                            <ScrollView style={styles.dropdownListScroll}>
                              {documentTypes.map((docType) => (
                                <TouchableOpacity
                                  key={docType.id}
                                  style={styles.dropdownItem}
                                  onPress={() => handleSelectType(docType.id, docType.texto)}
                                >
                                  <Text style={styles.dropdownItemText}>
                                    {docType.texto}
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
                      <Text style={styles.label}>Documento:</Text>
                      <View style={styles.fileContainerReadOnly}>
                        <Ionicons name="document-text" size={20} color={colors.primary} />
                        <Text style={styles.fileTextReadOnly}>
                          {formData.file || 'Sin archivo'}
                        </Text>
                      </View>
                    </View>

                    {/* Fecha de validez */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>
                        Válido hasta: <Text style={styles.required}>*</Text>
                      </Text>
                      <TouchableOpacity
                        style={[styles.dateContainer, isReadOnly && styles.dateContainerReadOnly]}
                        onPress={isReadOnly ? undefined : showDatePicker}
                        disabled={isReadOnly}
                      >
                        <Text style={[styles.dateInput, isReadOnly && styles.dateInputReadOnly]}>
                          {formData.validUntil || 'dd/mm/aaaa'}
                        </Text>
                        {!isReadOnly && (
                          <Ionicons name="calendar-outline" size={20} color={colors.text} style={styles.dateIcon} />
                        )}
                      </TouchableOpacity>
                    </View>

                    {/* Checkbox para incluir en libro */}
                    <View style={styles.fieldContainer}>
                      <View style={styles.checkboxContainer}>
                        <TouchableOpacity
                          style={[styles.checkbox, isReadOnly && styles.checkboxReadOnly]}
                          onPress={isReadOnly ? undefined : () => handleInputChange('includeInBook', !formData.includeInBook)}
                          disabled={isReadOnly}
                        >
                          <Ionicons
                            name={formData.includeInBook ? "checkbox" : "square-outline"}
                            size={20}
                            color={formData.includeInBook ? colors.primary : colors.gray}
                          />
                        </TouchableOpacity>
                        <Text style={[styles.checkboxText, isReadOnly && styles.checkboxTextReadOnly]}>
                          Incluir en el Libro del edificio
                        </Text>
                      </View>

                      <Text style={styles.infoText}>
                        Los documentos que se quieran incluir en el Libro del edificio no deben estar bloqueados ni protegidos con contraseña.
                      </Text>
                    </View>
                  </View>
                </ScrollView>
                
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

      {/* DateTimePickerModal */}
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
        }}
      />
    </>
  );
};