import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2 } from 'lucide-react-native';
import { Ingredient } from '../../../../types';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type StepProteinSelectionProps = {
  t: TFunc;
  styles: any;
  proteins: Ingredient[];
  selectedProteinIds: string[];
  onToggleProtein: (ingredientId: string) => void;
  onNext: () => void;
};

const StepProteinSelectionComponent = ({
  t,
  styles,
  proteins,
  selectedProteinIds,
  onToggleProtein,
  onNext,
}: StepProteinSelectionProps) => {
  const canProceed = selectedProteinIds.length === 2;

  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>{t('ui.protein_select')}</Text>
      <View style={styles.cardStack}>
        {proteins.map((ing) => {
          const isSelected = selectedProteinIds.includes(ing.id);
          return (
            <Pressable
              key={ing.id}
              onPress={() => onToggleProtein(ing.id)}
              style={[styles.baseRow, isSelected && styles.baseRowActive]}
            >
              <View>
                <Image
                  source={ing.photoSmall ?? ing.photo}
                  style={styles.ingredientRowImage}
                  contentFit="cover"
                  transition={150}
                />
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.ingredientName}>{t(ing.name)}</Text>
                <Text style={styles.ingredientMeta}>
                  {t('ui.protein_meta', { value: ing.pPer100g })}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        disabled={!canProceed}
        onPress={onNext}
        style={[styles.fullButton, !canProceed && styles.fullButtonDisabled]}
      >
        <Text style={styles.fullButtonText}>
          {t('ui.next_with_count', { current: selectedProteinIds.length })}
        </Text>
      </Pressable>
    </View>
  );
};

export const StepProteinSelection = memo(StepProteinSelectionComponent);
