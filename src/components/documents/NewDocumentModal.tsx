import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
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
}) => {
  const [formData, setFormData] = useState<NewDocumentData>({
    name: '',
    type: '',
    file: '',
    validUntil: '',
    includeInBook: false,
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const documentTypes = [
    'Inspección Técnica de Edificios',
    'Certificado de Instalaciones',
    'Informe de Seguridad',
    'Plano de Instalaciones',
    'Manual de Mantenimiento',
  ];

  const handleInputChange = (field: keyof NewDocumentData, value: string | boolean) => {
    setFormData((prev: NewDocumentData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (formData.name && formData.type && formData.file && formData.validUntil) {
      onSave(formData);
      // Reset form
      setFormData({
        name: '',
        type: '',
        file: '',
        validUntil: '',
        includeInBook: false,
      });
      onClose();
    }
  };

  const handleSelectFile = () => {
    // Aquí implementarías la lógica de selección de archivos
    console.log('Seleccionar archivo');
    handleInputChange('file', 'documento_seleccionado.pdf');
  };

  const handleDatePicker = () => {
    // Aquí implementarías la lógica del date picker
    console.log('Abrir date picker');
    handleInputChange('validUntil', '15/05/2027');
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
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
                  <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>
                      {formData.type || 'Seleccionar tipo'}
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
                    <TextInput
                      style={styles.dateInput}
                      value={formData.validUntil}
                      onChangeText={(value) => handleInputChange('validUntil', value)}
                      placeholder="dd/mm/aaaa"
                      editable={false}
                    />
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
  );
};
