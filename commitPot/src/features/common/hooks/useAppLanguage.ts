import { useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';
import {
  SupportedLanguage,
  clearStoredLanguage,
  getDeviceLanguage,
  loadStoredLanguage,
  saveStoredLanguage,
} from '../../../../i18n';

type UseAppLanguageParams = {
  t: (key: string) => string;
  i18n: {
    language: string;
    changeLanguage: (language: string) => Promise<unknown>;
  };
};

export function useAppLanguage({ t, i18n }: UseAppLanguageParams) {
  const [languageMode, setLanguageMode] = useState<'auto' | SupportedLanguage>('auto');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncLanguage = async () => {
      const stored = await loadStoredLanguage();
      if (!isMounted) return;
      if (stored) {
        setLanguageMode(stored);
        if (i18n.language !== stored) {
          await i18n.changeLanguage(stored);
        }
        return;
      }

      setLanguageMode('auto');
      const nextLanguage = getDeviceLanguage();
      if (i18n.language !== nextLanguage) {
        await i18n.changeLanguage(nextLanguage);
      }
    };

    void syncLanguage();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncLanguage();
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [i18n]);

  const languageOptions: Array<{ value: 'auto' | SupportedLanguage; label: string }> = useMemo(
    () => [
      { value: 'auto', label: t('ui.language_auto') },
      { value: 'ja', label: '日本語' },
      { value: 'en', label: 'English' },
      { value: 'vi', label: 'Tiếng Việt' },
      { value: 'es', label: 'Español' },
      { value: 'it', label: 'Italiano' },
      { value: 'pt', label: 'Português' },
      { value: 'ko', label: '한국어' },
      { value: 'zh', label: '中文' },
      { value: 'id', label: 'Bahasa Indonesia' },
    ],
    [t]
  );

  const handleSelectLanguage = async (value: 'auto' | SupportedLanguage) => {
    if (value === 'auto') {
      await clearStoredLanguage();
      const nextLanguage = getDeviceLanguage();
      await i18n.changeLanguage(nextLanguage);
      setLanguageMode('auto');
      setShowLanguageModal(false);
      return;
    }

    await saveStoredLanguage(value);
    await i18n.changeLanguage(value);
    setLanguageMode(value);
    setShowLanguageModal(false);
  };

  return {
    languageMode,
    showLanguageModal,
    setShowLanguageModal,
    languageOptions,
    handleSelectLanguage,
  };
}
