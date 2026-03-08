import React, { memo } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { SupportedLanguage } from '../../../../i18n';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type LanguageOption = {
  value: 'auto' | SupportedLanguage;
  label: string;
};

type LanguageModalProps = {
  t: TFunc;
  styles: any;
  visible: boolean;
  languageMode: 'auto' | SupportedLanguage;
  options: LanguageOption[];
  onClose: () => void;
  onSelect: (value: 'auto' | SupportedLanguage) => void;
};

const LanguageModalComponent = ({
  t,
  styles,
  visible,
  languageMode,
  options,
  onClose,
  onSelect,
}: LanguageModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.languageBackdrop}>
        <Pressable
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          onPress={onClose}
        />
        <View style={styles.languageModalCard}>
          <Text style={styles.languageModalTitle}>{t('ui.language_title')}</Text>
          <View style={styles.languageList}>
            {options.map((option) => {
              const active = languageMode === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => onSelect(option.value)}
                  style={[styles.languageOptionRow, active && styles.languageOptionActive]}
                >
                  <Text style={styles.languageOptionText}>{option.label}</Text>
                  {active ? <Check size={16} color="#f97316" strokeWidth={3} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const LanguageModal = memo(LanguageModalComponent);
