import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { colors } from "../../constants/colors";
import { useTranslation } from "../../hooks/useTranslation";
import { styles } from "./NewDocumentModal.styles";
import {
  NewDocumentData,
  NewDocumentModalProps,
} from "./NewDocumentModal.types";

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isVisible,
  onClose,
  onSave,
  category = "edif_doc_admin",
  documentTypes = [],
  isLoadingTypes = false,
  selectedTypeName = "",
  selectedTypeId = "",
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<NewDocumentData>({
    name: "",
    type: "",
    file: "",
    validUntil: "",
    includeInBook: false,
  });
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [showTypesDropdown, setShowTypesDropdown] = useState(false);
  const [internalSelectedTypeName, setInternalSelectedTypeName] = useState(selectedTypeName);
  const [isPdfFile, setIsPdfFile] = useState(false);

  // Función para verificar si el archivo es PDF
  const isPdfFileType = (mimeType: string, fileName: string): boolean => {
    return mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf');
  };

  // Actualizar formData.type cuando se selecciona un tipo
  useEffect(() => {
    if (selectedTypeId) {
      handleInputChange("type", selectedTypeId);
    }
  }, [selectedTypeId]);

  // Sincronizar el nombre del tipo seleccionado con la prop
  useEffect(() => {
    setInternalSelectedTypeName(selectedTypeName);
  }, [selectedTypeName]);

  const handleInputChange = (
    field: keyof NewDocumentData,
    value: string | boolean
  ) => {
    setFormData((prev: NewDocumentData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    
    if (
      formData.name &&
      formData.type &&
      formData.file &&
      selectedFile
    ) {
      setIsSaving(true);
      
      try {
        await onSave({
          ...formData,
          fileData: selectedFile,
        });
        
        // Reset form
        setFormData({
          name: "",
          type: "",
          file: "",
          validUntil: "",
          includeInBook: false,
        });
        setSelectedFile(null);
        setIsSaving(false);
        onClose();
      } catch {
        setIsSaving(false);
        Alert.alert("Error", t('errors.saveError', 'documents'));
      }
    } else {
      Alert.alert("Error", t('errors.missingFields', 'documents'));
    }
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Permitir todos los tipos de archivo
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileSizeMB = file.size ? file.size / (1024 * 1024) : 0;

        if (fileSizeMB > 10) {
          Alert.alert("Error", t('errors.fileTooBig', 'documents'));
          return;
        }

        // Verificar si es PDF
        const isPdf = isPdfFileType(file.mimeType || '', file.name);
        setIsPdfFile(isPdf);
        
        // Si no es PDF, desmarcar "incluir en libro"
        if (!isPdf) {
          handleInputChange("includeInBook", false);
        }

        // Guardar el archivo completo para enviar en el FormData
        setSelectedFile({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
        });
        handleInputChange("file", file.name);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
      Alert.alert("Error", t('errors.fileSelectionError', 'documents'));
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTypesPicker = () => {
    setShowTypesDropdown(true);
  };

  const hideTypesPicker = () => {
    setShowTypesDropdown(false);
  };

  const handleSelectType = (typeId: string, typeName: string) => {
    handleInputChange("type", typeId);
    setInternalSelectedTypeName(typeName);
    setShowTypesDropdown(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    handleInputChange("validUntil", formattedDate);
    hideDatePicker();
  };


  return (
    <>
      {/* Date Picker Modal - Render first to ensure it appears on top */}

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
                  <Text style={styles.title}>{t('newDocument', 'documents')}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                  >
                    <Ionicons name="close" size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>

                {/* Form - Scrolleable */}
                <ScrollView
                  style={styles.formScroll}
                  showsVerticalScrollIndicator={true}
                >
                  <View style={styles.form}>
                    {/* Nombre */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>
                        {t('name', 'documents')}: <Text style={styles.required}>{t('required', 'documents')}</Text>
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          focusedField === "name" && styles.inputFocused,
                        ]}
                        value={formData.name}
                        onChangeText={(value) =>
                          handleInputChange("name", value)
                        }
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder={t('namePlaceholder', 'documents')}
                      />
                    </View>

                    {/* Tipo documento */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>
                        {t('documentType', 'documents')}: <Text style={styles.required}>{t('required', 'documents')}</Text>
                      </Text>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={showTypesPicker}
                      >
                        <Text 
                          style={styles.dropdownText}
                          numberOfLines={2}
                          ellipsizeMode="tail"
                        >
                          {isLoadingTypes
                            ? t('loadingTypes', 'documents')
                            : internalSelectedTypeName || t('selectType', 'documents')}
                        </Text>
                        <Ionicons
                          name="chevron-down"
                          size={20}
                          color={colors.text}
                        />
                      </TouchableOpacity>

                      {/* Dropdown de tipos */}
                      {showTypesDropdown && (
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

                    {/* Documento */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>
                        {t('document', 'documents')} ({t('maxSize', 'documents')}):{" "}
                        <Text style={styles.required}>{t('required', 'documents')}</Text>
                      </Text>
                      <View style={styles.fileContainer}>
                        <Text style={styles.fileText}>
                          {formData.file || t('noFilesSelected', 'documents')}
                        </Text>
                        <TouchableOpacity
                          style={styles.selectFileButton}
                          onPress={handleSelectFile}
                        >
                          <Text style={styles.selectFileButtonText}>
                            {t('selectFile', 'documents')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Válido hasta */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>
                        {formData.validUntil ? `${t('validUntil', 'documents')}:` : t('selectDate', 'documents')}
                      </Text>
                      <TouchableOpacity
                        style={styles.dateContainer}
                        onPress={() => {
                          showDatePicker();
                        }}
                      >
                        <Text style={styles.dateInput}>
                          {formData.validUntil || t('datePlaceholder', 'documents')}
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

                    {/* Checkbox - Solo para archivos PDF */}
                    {isPdfFile && (
                      <>
                        <View style={styles.checkboxContainer}>
                          <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() =>
                              handleInputChange(
                                "includeInBook",
                                !formData.includeInBook
                              )
                            }
                          >
                            <Ionicons
                              name={
                                formData.includeInBook
                                  ? "checkbox"
                                  : "square-outline"
                              }
                              size={20}
                              color={
                                formData.includeInBook
                                  ? colors.primary
                                  : colors.text
                              }
                            />
                          </TouchableOpacity>
                          <Text style={styles.checkboxText}>
                            {t('includeInBook', 'documents')}
                          </Text>
                        </View>

                        <Text style={styles.infoText}>
                          {t('bookInfo', 'documents')}
                        </Text>
                      </>
                    )}
                  </View>
                </ScrollView>

                {/* Save Button */}
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isSaving && { opacity: 0.6 }
                  ]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <ActivityIndicator size="small" color={colors.white} />
                      <Text style={styles.saveButtonText}>{t('saving', 'documents')}</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="lock-closed" size={20} color={colors.white} />
                      <Text style={styles.saveButtonText}>{t('save', 'documents')}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
