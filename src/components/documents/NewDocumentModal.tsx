import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
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
import { colors } from '../../constants/colors';
import { styles } from './NewDocumentModal.styles';
import { NewDocumentData, NewDocumentModalProps } from './NewDocumentModal.types';

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isVisible,
  onClose,
  onSave,
  category = 'edif_doc_admin',
  onOpenTypesModal,
  documentTypes = [],
  isLoadingTypes = false,
  selectedTypeName = '',
  onSelectType,
}) => {
  const [formData, setFormData] = useState<NewDocumentData>({
    name: '',
    type: '',
    file: '',
    validUntil: '',
    includeInBook: false,
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleInputChange = (field: keyof NewDocumentData, value: string | boolean) => {
    setFormData((prev: NewDocumentData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.type && formData.file && formData.validUntil && selectedFile) {
      onSave({
        ...formData,
        fileData: selectedFile,
      });
      // Reset form
      setFormData({
        name: '',
        type: '',
        file: '',
        validUntil: '',
        includeInBook: false,
      });
      setSelectedFile(null);
      onClose();
    } else {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
    }
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

        // Guardar el archivo completo para enviar en el FormData
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        });
        handleInputChange('file', file.name);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const handleDatePicker = () => {
    console.log('Opening date picker...');
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log('Date picker event:', event, selectedDate);
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      console.log('Formatted date:', formattedDate);
      handleInputChange('validUntil', formattedDate);
    }
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
                <Text style={styles.title}>Nuevo documento</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {/* Form - Scrolleable */}
              <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={true}>
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
                    ]}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ingrese el nombre del documento"
                  />
                </View>

                {/* Tipo documento */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Tipo documento: <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity 
                    style={styles.dropdown}
                    onPress={() => {
                      console.log('🟡 Presionando dropdown de tipos');
                      if (onOpenTypesModal) {
                        onOpenTypesModal();
                      } else {
                        console.log('❌ onOpenTypesModal no está definido');
                      }
                    }}
                  >
                    <Text style={styles.dropdownText}>
                      {isLoadingTypes ? 'Cargando tipos...' : (selectedTypeName || 'Seleccionar tipo')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Documento */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>
                    Documento (Máx. 10 MB): <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.fileContainer}>
                    <Text style={styles.fileText}>
                      {formData.file || 'Sin archivos seleccionados'}
                    </Text>
                    <TouchableOpacity 
                      style={styles.selectFileButton}
                      onPress={handleSelectFile}
                    >
                      <Text style={styles.selectFileButtonText}>SELECCIONAR ARCHIVO</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Válido hasta */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Válido hasta:</Text>
                  <TouchableOpacity style={styles.dateContainer} onPress={handleDatePicker}>
                    <Text style={styles.dateInput}>
                      {formData.validUntil || 'dd/mm/aaaa'}
                    </Text>
                    <Ionicons 
                      name="calendar-outline" 
                      size={20} 
                      color={colors.text}
                      style={styles.dateIcon}
                    />
                  </TouchableOpacity>
                </View>

                {/* Checkbox */}
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => handleInputChange('includeInBook', !formData.includeInBook)}
                  >
                    <Ionicons
                      name={formData.includeInBook ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={formData.includeInBook ? colors.primary : colors.text}
                    />
                  </TouchableOpacity>
                  <Text style={styles.checkboxText}>
                    Incluir en el Libro del edificio (Sólo se admiten documentos en formato pdf)
                  </Text>
                </View>

                <Text style={styles.infoText}>
                  Los documentos que se quieran incluir en el Libro del edificio no deben estar bloqueados ni protegidos con contraseña.
                </Text>
              </View>
              </ScrollView>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Ionicons name="lock-closed" size={20} color={colors.white} />
                <Text style={styles.saveButtonText}>GUARDAR</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      </Modal>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </>
  );
};
