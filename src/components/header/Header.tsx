import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { colors, styles } from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header: React.FC<HeaderProps> = ({ onLanguageChange }) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

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
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logo}>
        <Text style={styles.logoText}>LED</Text>
        <Text style={styles.logoAccent}>^</Text>
        <Ionicons 
          name="flash-outline" 
          size={24} 
          color={colors.lightGray} 
          style={{ marginLeft: 4 }}
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
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.languageDropdownContainer}>
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
