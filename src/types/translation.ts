export type Language = 'es' | 'ca';

export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface Translations {
  common: TranslationData;
  auth: TranslationData;
  navigation: TranslationData;
  email: TranslationData;
  notifications: TranslationData;
  user: TranslationData;
}

export interface TranslationContextType {
  t: (key: string, namespace?: keyof Translations) => string;
  currentLanguage: Language;
  changeLanguage: (language: Language) => Promise<void>;
  isLoading: boolean;
  availableLanguages: readonly Language[];
}

export interface LanguageSelectorProps {
  style?: any;
  showLabel?: boolean;
  labelText?: string;
}
