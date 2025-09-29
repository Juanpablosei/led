import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';

interface LanguageSelectorProps {
  style?: any;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { currentLanguage, changeLanguage, availableLanguages } = useTranslation();

  const languageNames = {
    es: 'Español',
    ca: 'Català',
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Idioma:</Text>
      <View style={styles.buttonContainer}>
        {availableLanguages.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.button,
              currentLanguage === lang && styles.activeButton,
            ]}
            onPress={() => changeLanguage(lang)}
          >
            <Text
              style={[
                styles.buttonText,
                currentLanguage === lang && styles.activeButtonText,
              ]}
            >
              {languageNames[lang]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
