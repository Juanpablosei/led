import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Language, TranslationContextType, Translations } from '../types/translation';
import { TRANSLATION_CONFIG } from '../utils/translationConfig';

const translations: Record<Language, Translations> = {
  es: {
    common: require('../locales/es/common.json'),
    auth: require('../locales/es/auth.json'),
    navigation: require('../locales/es/navigation.json'),
  },
  ca: {
    common: require('../locales/ca/common.json'),
    auth: require('../locales/ca/auth.json'),
    navigation: require('../locales/ca/navigation.json'),
  },
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(TRANSLATION_CONFIG.defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(TRANSLATION_CONFIG.storageKey);
      if (savedLanguage && TRANSLATION_CONFIG.supportedLanguages.includes(savedLanguage as Language)) {
        setCurrentLanguage(savedLanguage as Language);
      }
    } catch (error) {
      if (TRANSLATION_CONFIG.debug) {
        console.error('Error loading language:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language: Language) => {
    try {
      await AsyncStorage.setItem(TRANSLATION_CONFIG.storageKey, language);
      setCurrentLanguage(language);
    } catch (error) {
      if (TRANSLATION_CONFIG.debug) {
        console.error('Error saving language:', error);
      }
    }
  };

  const t = (key: string, namespace: keyof Translations = 'common'): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage][namespace];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        if (TRANSLATION_CONFIG.debug) {
          console.warn(`Translation key "${key}" not found in ${namespace}`);
        }
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider
      value={{
        t,
        currentLanguage,
        changeLanguage,
        isLoading,
        availableLanguages: TRANSLATION_CONFIG.supportedLanguages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
