import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';
import { colors, styles } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header: React.FC<HeaderProps> = ({ onLanguageChange }) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const insets = useSafeAreaInsets();
  
  // Calcular posición del dropdown específica por plataforma
  const getDropdownTopPosition = () => {
    if (Platform.OS === 'android') {
      return insets.top + 0; // Android: solo el área segura sin margen adicional
    } else {
      return insets.top + 40; // iOS: área segura + margen adicional
    }
  };

  const handleLanguageSelect = async (language: 'es' | 'ca') => {
    await changeLanguage(language);
    setShowLanguageModal(false);
    if (onLanguageChange) {
      onLanguageChange();
    }
  };

  const getLanguageCode = (lang: string) => {
    return lang === 'es' ? 'ES' : 'CA';
  };

  const getLanguageName = (lang: string) => {
    return lang === 'es' ? 'Español' : 'Català';
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      {/* Logo */}
      <View style={styles.logo}>
        <Image 
          source={require('../../../assets/images/logo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Language Selector */}
      <TouchableOpacity 
        style={styles.languageSelector}
        onPress={() => setShowLanguageModal(true)}
      >
        <Ionicons name="globe-outline" size={26} color={colors.white} />
        <Text style={[styles.body, { color: colors.white, marginLeft: 12, marginRight: 12, fontSize: 26 }]}>
          {getLanguageCode(currentLanguage)}
        </Text>
        <Ionicons name="chevron-down" size={26} color={colors.white} />
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity 
          style={[styles.modalOverlay, { paddingTop: insets.top }]}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={[styles.languageDropdownContainer, { top: getDropdownTopPosition() }]}>
            <View style={styles.languageDropdown}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageOption,
                  currentLanguage === lang && styles.languageOptionActive
                ]}
                onPress={() => handleLanguageSelect(lang)}
              >
                <Text style={[
                  styles.languageOptionText,
                  currentLanguage === lang && styles.languageOptionTextActive
                ]}>
                  {getLanguageName(lang)}
                </Text>
              </TouchableOpacity>
            ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
