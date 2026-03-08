import React, { memo } from 'react';
import { Pressable, Text } from 'react-native';
import { Globe } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type LanguageButtonProps = {
  t: TFunc;
  styles: any;
  onPress: () => void;
};

const LanguageButtonComponent = ({ t, styles, onPress }: LanguageButtonProps) => {
  return (
    <Pressable style={styles.languageButton} onPress={onPress}>
      <Globe size={16} color="#6b7280" />
      <Text style={styles.languageButtonText}>{t('ui.language')}</Text>
    </Pressable>
  );
};

export const LanguageButton = memo(LanguageButtonComponent);
