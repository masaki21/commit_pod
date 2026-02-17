import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import ja from './locales/ja/translation.json';
import en from './locales/en/translation.json';
import vi from './locales/vi/translation.json';
import es from './locales/es/translation.json';
import it from './locales/it/translation.json';
import pt from './locales/pt/translation.json';
import ko from './locales/ko/translation.json';
import zh from './locales/zh/translation.json';
import id from './locales/id/translation.json';

const SUPPORTED_LANGUAGES = ['ja', 'en', 'vi', 'es', 'it', 'pt', 'ko', 'zh', 'id'] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
const LANGUAGE_STORAGE_KEY = 'commitpot_language';

const normalizeLanguage = (language: string): SupportedLanguage => {
  const base = language.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(base as SupportedLanguage) ? (base as SupportedLanguage) : 'ja';
};

const getDeviceLanguage = (): SupportedLanguage => {
  const locales = typeof Localization.getLocales === 'function' ? Localization.getLocales() : [];
  const candidate =
    locales[0]?.languageCode ||
    locales[0]?.languageTag ||
    (typeof Localization.locale === 'string' ? Localization.locale : '') ||
    'ja';
  return normalizeLanguage(candidate);
};

const loadStoredLanguage = async (): Promise<SupportedLanguage | null> => {
  try {
    if (Platform.OS === 'web') {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
      return stored ? normalizeLanguage(stored) : null;
    }
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored ? normalizeLanguage(stored) : null;
  } catch (error) {
    return null;
  }
};

const saveStoredLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      }
      return;
    }
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // ignore storage errors and fall back to device language
  }
};

const clearStoredLanguage = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      }
      return;
    }
    await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    // ignore storage errors and fall back to device language
  }
};

const deviceLanguage = getDeviceLanguage();

void i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources: {
      ja: { translation: ja },
      en: { translation: en },
      vi: { translation: vi },
      es: { translation: es },
      it: { translation: it },
      pt: { translation: pt },
      ko: { translation: ko },
      zh: { translation: zh },
      id: { translation: id },
    },
    lng: deviceLanguage,
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    returnEmptyString: false,
  });

export default i18n;
export {
  SUPPORTED_LANGUAGES,
  getDeviceLanguage,
  loadStoredLanguage,
  saveStoredLanguage,
  clearStoredLanguage,
  normalizeLanguage,
};
export type { SupportedLanguage };
