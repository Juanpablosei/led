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

  // Actualizar formData.type cuando se selecciona un tipo
  useEffect(() => {
    if (selectedTypeId) {
      console.log("🔄 Actualizando tipo seleccionado:", selectedTypeId);
      handleInputChange("type", selectedTypeId);
    }
  }, [selectedTypeId]);

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
    console.log("🔍 Validating form data:", {
      name: formData.name,
      type: formData.type,
      file: formData.file,
      validUntil: formData.validUntil,
      selectedFile: selectedFile
    });
    
    if (
      formData.name &&
      formData.type &&
      formData.file &&
      formData.validUntil &&
      selectedFile
    ) {
      console.log("✅ All fields valid, saving document");
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
      } catch (error) {
        console.log("❌ Error saving document:", error);
        setIsSaving(false);
        Alert.alert("Error", "No se pudo guardar el documento. Inténtalo de nuevo.");
      }
    } else {
      console.log("❌ Validation failed, missing fields");
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
    }
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileSizeMB = file.size ? file.size / (1024 * 1024) : 0;

        if (fileSizeMB > 10) {
          Alert.alert("Error", "El archivo es demasiado grande. Máximo 10 MB.");
          return;
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
      Alert.alert("Error", "No se pudo seleccionar el archivo");
    }
  };

  const showDatePicker = () => {
    console.log("🔄 showDatePicker called");
    console.log("🔄 Current isDatePickerVisible state:", isDatePickerVisible);
    setDatePickerVisibility(true);
    console.log("🔄 After setDatePickerVisibility(true)");
  };

  const hideDatePicker = () => {
    console.log("🔄 hideDatePicker called");
    setDatePickerVisibility(false);
  };

  const showTypesPicker = () => {
    console.log("🟡 Abriendo selector de tipos");
    setShowTypesDropdown(true);
  };

  const hideTypesPicker = () => {
    setShowTypesDropdown(false);
  };

  const handleSelectType = (typeId: string, typeName: string) => {
    console.log("✅ Tipo seleccionado:", typeId, typeName);
    handleInputChange("type", typeId);
    setShowTypesDropdown(false);
  };

  const handleConfirm = (date: Date) => {
    console.log("✅ Date confirmed:", date);
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    console.log("✅ Formatted date:", formattedDate);
    handleInputChange("validUntil", formattedDate);
    hideDatePicker();
  };

  console.log(
    "🚀 NewDocumentModal render - isDatePickerVisible:",
    isDatePickerVisible,
    "selectedDate:",
    selectedDate
  );

  return (
    <>
      {/* Date Picker Modal - Render first to ensure it appears on top */}
      {console.log(
        "🎯 Rendering DateTimePickerModal - isDatePickerVisible:",
        isDatePickerVisible
      )}

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
                        Nombre: <Text style={styles.required}>*</Text>
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
                        onPress={showTypesPicker}
                      >
                        <Text style={styles.dropdownText}>
                          {isLoadingTypes
                            ? "Cargando tipos..."
                            : selectedTypeName || "Seleccionar tipo"}
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
                        Documento (Máx. 10 MB):{" "}
                        <Text style={styles.required}>*</Text>
                      </Text>
                      <View style={styles.fileContainer}>
                        <Text style={styles.fileText}>
                          {formData.file || "Sin archivos seleccionados"}
                        </Text>
                        <TouchableOpacity
                          style={styles.selectFileButton}
                          onPress={handleSelectFile}
                        >
                          <Text style={styles.selectFileButtonText}>
                            SELECCIONAR ARCHIVO
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Válido hasta */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Válido hasta:</Text>
                      <TouchableOpacity
                        style={styles.dateContainer}
                        onPress={() => {
                          console.log("📅 Date container pressed");
                          showDatePicker();
                        }}
                      >
                        <Text style={styles.dateInput}>
                          {formData.validUntil || "dd/mm/aaaa"}
                        </Text>
                        <DateTimePickerModal
                          isVisible={isDatePickerVisible}
                          mode="date"
                          date={selectedDate}
                          minimumDate={new Date()}
                          onConfirm={handleConfirm}
                          onCancel={() => {
                            console.log("❌ Date picker cancelled");
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
                        Incluir en el Libro del edificio (Sólo se admiten
                        documentos en formato pdf)
                      </Text>
                    </View>

                    <Text style={styles.infoText}>
                      Los documentos que se quieran incluir en el Libro del
                      edificio no deben estar bloqueados ni protegidos con
                      contraseña.
                    </Text>
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
                      <Text style={styles.saveButtonText}>GUARDANDO...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="lock-closed" size={20} color={colors.white} />
                      <Text style={styles.saveButtonText}>GUARDAR</Text>
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
