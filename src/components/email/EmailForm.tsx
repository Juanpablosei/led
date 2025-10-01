import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useRef, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { colors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { Toast, ToastType } from '../ui';
import { styles } from './EmailForm.styles';
import { EmailFormData, EmailFormProps } from './EmailForm.types';

export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit }) => {
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
        const fileNames = result.assets.map(file => file.name);
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, ...fileNames],
        }));
      }
    } catch (error) {
      console.error('Error selecting files:', error);
      showToast(t('errors.fileSelectionError', 'email'), 'error');
    }
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
          <TouchableOpacity style={styles.attachmentContainer} onPress={handleSelectFiles}>
            <Text style={styles.attachmentText}>
              {formData.attachments.length > 0
                ? `${formData.attachments.length} ${t('filesSelected', 'email')}`
                : t('attachFilesPlaceholder', 'email')}
            </Text>
          </TouchableOpacity>
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
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
          <Ionicons name="mail" size={20} color="#FFFFFF" />
          <Text style={styles.sendButtonText}>{t('sendEmail', 'email')}</Text>
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
