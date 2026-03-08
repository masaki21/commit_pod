import { useMemo } from 'react';
import { LanguageButton } from '../components/LanguageButton';
import { LanguageModal } from '../components/LanguageModal';

type UseLanguageUiElementsParams = {
  t: (key: string, options?: Record<string, unknown>) => string;
  styles: any;
  showLanguageModal: boolean;
  setShowLanguageModal: (visible: boolean) => void;
  languageMode: any;
  languageOptions: Array<{ value: any; label: string }>;
  handleSelectLanguage: (value: any) => void;
};

export function useLanguageUiElements({
  t,
  styles,
  showLanguageModal,
  setShowLanguageModal,
  languageMode,
  languageOptions,
  handleSelectLanguage,
}: UseLanguageUiElementsParams) {
  const languageButton = useMemo(
    () => <LanguageButton t={t} styles={styles} onPress={() => setShowLanguageModal(true)} />,
    [t, styles, setShowLanguageModal]
  );

  const languageModal = useMemo(
    () => (
      <LanguageModal
        t={t}
        styles={styles}
        visible={showLanguageModal}
        languageMode={languageMode}
        options={languageOptions}
        onClose={() => setShowLanguageModal(false)}
        onSelect={handleSelectLanguage}
      />
    ),
    [t, styles, showLanguageModal, languageMode, languageOptions, setShowLanguageModal, handleSelectLanguage]
  );

  return { languageButton, languageModal };
}
