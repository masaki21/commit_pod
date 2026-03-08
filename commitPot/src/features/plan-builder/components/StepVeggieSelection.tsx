import React, { memo } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { CheckCircle2 } from 'lucide-react-native';
import { Ingredient, Plan } from '../../../../types';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type SynergySummaryState = {
  reason: string;
  mode: 'ai' | 'custom';
  recommendedVeggies: string[];
};

type StepVeggieSelectionProps = {
  t: TFunc;
  styles: any;
  veggieOptions: Ingredient[];
  mushroomOptions: Ingredient[];
  selectedVeggieIds: string[];
  selectedMushroomIds: string[];
  mushroomIds: Set<string>;
  synergySummary: SynergySummaryState | null;
  localizedSynergyReason: string;
  synergyCardAnimatedStyle: any;
  autoRecommendedVeggies: string[];
  onMarkCustom: () => void;
  onSetCurrentPlan: React.Dispatch<React.SetStateAction<Plan>>;
  onSetAutoRecommendedVeggies: (ids: string[]) => void;
  onRestoreAiRecommendation: () => void;
  onNext: () => void;
};

const StepVeggieSelectionComponent = ({
  t,
  styles,
  veggieOptions,
  mushroomOptions,
  selectedVeggieIds,
  selectedMushroomIds,
  mushroomIds,
  synergySummary,
  localizedSynergyReason,
  synergyCardAnimatedStyle,
  autoRecommendedVeggies,
  onMarkCustom,
  onSetCurrentPlan,
  onSetAutoRecommendedVeggies,
  onRestoreAiRecommendation,
  onNext,
}: StepVeggieSelectionProps) => {
  const canProceed = selectedVeggieIds.length === 2 && selectedMushroomIds.length === 1;

  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>{t('ui.veg_select')}</Text>
      <Text style={styles.sectionLabel}>{t('ui.veg_select_two')}</Text>
      {synergySummary?.reason ? (
        <Animated.View
          style={[
            styles.synergyCard,
            synergySummary.mode === 'custom' ? styles.synergyCardCustom : styles.synergyCardRecommended,
            synergyCardAnimatedStyle,
          ]}
        >
          <Text
            style={[
              styles.synergyCardLabel,
              synergySummary.mode === 'custom' ? styles.synergyCardLabelCustom : styles.synergyCardLabelRecommended,
            ]}
          >
            {synergySummary.mode === 'custom' ? t('ui.custom_mode_label') : t('ui.ai_hud_title')}
          </Text>
          {synergySummary.mode === 'custom' ? (
            <Text style={styles.synergyCardMessage}>{t('ui.custom_mode_message')}</Text>
          ) : (
            <>
              <Text style={[styles.synergyCardSubMessage, styles.synergyCardSubMessageRecommended]}>
                {t('ui.ai_hud_subtitle')}
              </Text>
              <Text style={styles.synergyCardMessage}>{localizedSynergyReason}</Text>
            </>
          )}
          {synergySummary.mode === 'custom' ? (
            <>
              <Text style={styles.synergyCardSubMessage}>{t('ui.custom_mode_support')}</Text>
              <Pressable onPress={onRestoreAiRecommendation} style={styles.synergyResetButton}>
                <Text style={styles.synergyResetButtonText}>{t('ui.back_to_ai')}</Text>
              </Pressable>
            </>
          ) : null}
        </Animated.View>
      ) : null}

      <View style={styles.cardStack}>
        {veggieOptions.map((ing) => {
          const isSelected = selectedVeggieIds.includes(ing.id);
          return (
            <Pressable
              key={ing.id}
              onPress={() => {
                onSetAutoRecommendedVeggies([]);
                onMarkCustom();
                onSetCurrentPlan((prev) => {
                  const currentVeggies = (prev.veggies || []).filter((id) => !mushroomIds.has(id));
                  const currentMushrooms = (prev.veggies || []).filter((id) => mushroomIds.has(id));
                  const exists = currentVeggies.includes(ing.id);
                  const nextVeggies = exists
                    ? currentVeggies.filter((id) => id !== ing.id)
                    : [...currentVeggies, ing.id].slice(-2);
                  return {
                    ...prev,
                    veggies: [...nextVeggies, ...currentMushrooms],
                  };
                });
              }}
              style={[
                styles.baseRow,
                isSelected && styles.baseRowActive,
                autoRecommendedVeggies.includes(ing.id) && styles.autoRecommendedRow,
              ]}
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
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>{t('ui.mushroom_select_one')}</Text>
      <View style={styles.cardStack}>
        {mushroomOptions.map((ing) => {
          const isSelected = selectedMushroomIds.includes(ing.id);
          return (
            <Pressable
              key={ing.id}
              onPress={() => {
                onSetAutoRecommendedVeggies([]);
                onMarkCustom();
                onSetCurrentPlan((prev) => {
                  const exists = prev.veggies?.includes(ing.id);
                  if (exists) {
                    return {
                      ...prev,
                      veggies: prev.veggies?.filter((p) => p !== ing.id),
                    };
                  }

                  const nextVeggies = [...(prev.veggies || [])];
                  const mushroomIdList = nextVeggies.filter((id) => mushroomIds.has(id));
                  if (mushroomIdList.length >= 1) {
                    const removeId = mushroomIdList[0];
                    const removeIndex = nextVeggies.indexOf(removeId);
                    if (removeIndex >= 0) {
                      nextVeggies.splice(removeIndex, 1);
                    }
                  }
                  nextVeggies.push(ing.id);
                  return {
                    ...prev,
                    veggies: nextVeggies,
                  };
                });
              }}
              style={[
                styles.baseRow,
                isSelected && styles.baseRowActive,
                autoRecommendedVeggies.includes(ing.id) && styles.autoRecommendedRow,
              ]}
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
            {t('ui.next_veg_mushroom', {
            veg: selectedVeggieIds.length,
            mush: selectedMushroomIds.length,
          })}
        </Text>
      </Pressable>
    </View>
  );
};

export const StepVeggieSelection = memo(StepVeggieSelectionComponent);
