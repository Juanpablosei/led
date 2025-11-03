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
  sidebar: TranslationData;
  communications: TranslationData;
  documents: TranslationData;
  alerts: TranslationData;
}

export interface TranslationContextType {
  t: (key: string, namespace?: keyof Translations, params?: Record<string, string>) => string;
  currentLanguage: Language;
  changeLanguage: (language: Language) => Promise<void>;
  isLoading: boolean;
  availableLanguages: readonly Language[];
}

