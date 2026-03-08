import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ingredient } from '../../../../types';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type StepCarbSelectionProps = {
  t: TFunc;
  styles: any;
  carbs: Ingredient[];
  selectedCarbId: string;
  getEffectLead: (effectText: string) => string;
  onSelectCarb: (carbId: string) => void;
};

const StepCarbSelectionComponent = ({
  t,
  styles,
  carbs,
  selectedCarbId,
  getEffectLead,
  onSelectCarb,
}: StepCarbSelectionProps) => {
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>{t('ui.carb_select')}</Text>
      <View style={styles.cardStack}>
        {carbs.map((ing) => (
          <Pressable
            key={ing.id}
            onPress={() => onSelectCarb(ing.id)}
            style={[styles.baseRow, selectedCarbId === ing.id && styles.baseRowActive]}
          >
            <Image
              source={ing.photoSmall ?? ing.photo}
              style={styles.carbImage}
              contentFit="cover"
              transition={150}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.baseTitle}>{t(ing.name)}</Text>
              <Text style={styles.baseSubtitle}>{getEffectLead(t(ing.effect))}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export const StepCarbSelection = memo(StepCarbSelectionComponent);
