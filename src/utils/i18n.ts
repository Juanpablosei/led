import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'es' | 'ca';

export const LANGUAGE_STORAGE_KEY = 'app_language';
export const DEFAULT_LANGUAGE: Language = 'es';

export const SUPPORTED_LANGUAGES: Language[] = ['es', 'ca'];

export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  ca: 'Català',
};

export const getStoredLanguage = async (): Promise<Language> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage as Language)) {
      return storedLanguage as Language;
    }
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Error getting stored language:', error);
    return DEFAULT_LANGUAGE;
  }
};

export const setStoredLanguage = async (language: Language): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Error setting stored language:', error);
  }
};
