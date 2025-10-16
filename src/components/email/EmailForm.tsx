import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { Toast, ToastType } from '../ui';
import { styles } from './EmailForm.styles';
import { EmailAttachment, EmailFormData, EmailFormProps } from './EmailForm.types';

export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, isLoading = false }) => {
  const { t } = useTranslation();
  const richText = useRef<RichEditor>(null);
  const [formData, setFormData] = useState<EmailFormData>({
    subject: '',
    attachments: [],
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('error');

  const handleInputChange = (field: keyof EmailFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Convertir cada archivo a base64 usando fetch
        const filesPromises = result.assets.map(async (file) => {
          try {
            // Leer el archivo usando fetch y convertir a base64
            const response = await fetch(file.uri);
            const blob = await response.blob();
            
            return new Promise<EmailAttachment | null>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = reader.result as string;
                // Remover el prefijo "data:..." si existe
                const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
                
                resolve({
                  base64: base64Data,
                  nombre: file.name,
                  type: file.mimeType || 'application/octet-stream',
                });
              };
              reader.onerror = () => {
                console.error('Error reading file:', file.name);
                resolve(null);
              };
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error('Error reading file:', file.name, error);
            return null;
          }
        });
        
        const files = (await Promise.all(filesPromises)).filter((f): f is EmailAttachment => f !== null);
        
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, ...files],
        }));
        
        showToast(`${files.length} archivo(s) agregado(s)`, 'success');
      }
    } catch (error) {
      console.error('Error selecting files:', error);
      showToast(t('errors.fileSelectionError', 'email'), 'error');
    }
  };

  const handleTakePhoto = async () => {
    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('', 'Se necesitan permisos de cámara para tomar fotos');
        return;
      }

      // Abrir cámara sin recorte para evitar problemas visuales en Android
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false, // Deshabilitado para evitar interfaz oscura en Android
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        
        if (photo.base64) {
          const attachment: EmailAttachment = {
            base64: photo.base64,
            nombre: `foto_${Date.now()}.jpg`,
            type: 'image/jpeg',
          };
          
          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, attachment],
          }));
          
          showToast('Foto agregada', 'success');
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showToast('Error al tomar foto', 'error');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!formData.subject || !formData.message) {
      showToast(t('errors.missingFields', 'email'), 'error');
      return;
    }
    onSubmit(formData);
  };

  const handleEditorChange = (html: string) => {
    handleInputChange('message', html);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    // También cerrar el editor rico si está activo
    if (richText.current) {
      richText.current.blurContentEditor();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {/* Asunto */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            {t('subject', 'email')}: <Text style={styles.required}>{t('required', 'email')}</Text>
          </Text>
          <TextInput
            style={[styles.input, focusedField === 'subject' && styles.inputFocused]}
            value={formData.subject}
            onChangeText={value => handleInputChange('subject', value)}
            onFocus={() => setFocusedField('subject')}
            onBlur={() => setFocusedField(null)}
            placeholder=""
          />
        </View>

        {/* Adjuntar ficheros */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{t('attachFiles', 'email')}:</Text>
          
          {/* Botones para adjuntar */}
          <View style={styles.attachmentButtons}>
            <TouchableOpacity style={styles.attachmentButton} onPress={handleSelectFiles}>
              <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
              <Text style={styles.attachmentButtonText}>Adjuntar archivo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.attachmentButton} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={20} color={colors.primary} />
              <Text style={styles.attachmentButtonText}>Tomar foto</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de archivos adjuntos */}
          {formData.attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              <Text style={styles.attachmentsListTitle}>
                {formData.attachments.length} archivo(s) adjunto(s):
              </Text>
              {formData.attachments.map((file, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Ionicons 
                    name={file.type?.startsWith('image/') ? 'image-outline' : 'document-outline'} 
                    size={18} 
                    color={colors.text} 
                  />
                  <Text style={styles.attachmentItemText} numberOfLines={1}>
                    {file.nombre}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                    <Ionicons name="close-circle" size={20} color="#E53E3E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Mensaje */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{t('message', 'email')}:</Text>
          <View style={styles.textEditorContainer}>
            {/* Rich Text Toolbar */}
            <RichToolbar
              editor={richText}
              actions={[
                actions.undo,
                actions.redo,
                actions.heading1,
                actions.heading2,
                actions.setBold,
                actions.setUnderline,
                actions.setItalic,
                actions.setStrikethrough,
                actions.foreColor,
                actions.hiliteColor,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.insertImage,
              ]}
              iconMap={{
                [actions.undo]: ({ tintColor }: any) => <Ionicons name="arrow-undo-outline" size={18} color={tintColor} />,
                [actions.redo]: ({ tintColor }: any) => <Ionicons name="arrow-redo-outline" size={18} color={tintColor} />,
                [actions.heading1]: ({ tintColor }: any) => <Text style={{ color: tintColor, fontSize: 18, fontWeight: 'bold' }}>H1</Text>,
                [actions.heading2]: ({ tintColor }: any) => <Text style={{ color: tintColor, fontSize: 16, fontWeight: 'bold' }}>H2</Text>,
                [actions.setBold]: ({ tintColor }: any) => <Ionicons name="text" size={18} color={tintColor} />,
                [actions.setUnderline]: ({ tintColor }: any) => <Text style={{ color: tintColor, textDecorationLine: 'underline' }}>U</Text>,
                [actions.setItalic]: ({ tintColor }: any) => <Text style={{ color: tintColor, fontStyle: 'italic' }}>I</Text>,
                [actions.setStrikethrough]: ({ tintColor }: any) => <Text style={{ color: tintColor, textDecorationLine: 'line-through' }}>S</Text>,
                [actions.foreColor]: ({ tintColor }: any) => <Ionicons name="color-palette-outline" size={18} color={tintColor} />,
                [actions.hiliteColor]: ({ tintColor }: any) => <Ionicons name="color-fill-outline" size={18} color={tintColor} />,
                [actions.insertBulletsList]: ({ tintColor }: any) => <Ionicons name="list" size={18} color={tintColor} />,
                [actions.insertOrderedList]: ({ tintColor }: any) => <Ionicons name="list-outline" size={18} color={tintColor} />,
                [actions.insertLink]: ({ tintColor }: any) => <Ionicons name="link-outline" size={18} color={tintColor} />,
                [actions.insertImage]: ({ tintColor }: any) => <Ionicons name="image-outline" size={18} color={tintColor} />,
              }}
              style={styles.toolbar}
            />

          {/* Rich Text Editor */}
          <RichEditor
            ref={richText}
            onChange={handleEditorChange}
            placeholder={t('messagePlaceholder', 'email')}
            initialHeight={200}
            style={styles.textArea}
            editorStyle={{
              backgroundColor: colors.white,
              color: colors.text,
              placeholderColor: colors.lightGray,
            }}
          />
        </View>
      </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.sendButtonText}>Enviando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="mail" size={20} color="#FFFFFF" />
              <Text style={styles.sendButtonText}>{t('sendEmail', 'email')}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Toast notification */}
        <Toast
          message={toastMessage}
          type={toastType}
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
