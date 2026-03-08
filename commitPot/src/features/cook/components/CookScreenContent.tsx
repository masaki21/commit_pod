import React, { memo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ChefHat, ChevronLeft, ChevronRight, Target } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type CardComponent = (props: { children: React.ReactNode; style?: object }) => React.ReactElement;
type ProgressBarComponent = (props: { current: number; total: number }) => React.ReactElement;

type CookStepData = {
  titleKey: string;
  descriptionKey: string;
  tipKey: string;
  photo: any;
};

type CookScreenContentProps = {
  t: TFunc;
  styles: any;
  cookStep: number;
  totalSteps: number;
  currentCookData: CookStepData;
  cookScrollRef: React.RefObject<ScrollView | null>;
  smallButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  Card: CardComponent;
  ProgressBar: ProgressBarComponent;
  onBack: () => void;
  onNext: () => void;
};

const CookScreenContentComponent = ({
  t,
  styles,
  cookStep,
  totalSteps,
  currentCookData,
  cookScrollRef,
  smallButtonHitSlop,
  Card,
  ProgressBar,
  onBack,
  onNext,
}: CookScreenContentProps) => {
  return (
    <View style={styles.cookPad}>
      <View style={styles.builderHeader}>
        <Pressable onPress={onBack} style={styles.squareButton} hitSlop={smallButtonHitSlop}>
          <ChevronLeft size={24} color="#111827" strokeWidth={3} />
        </Pressable>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.builderTitle}>{t('ui.prep_mode_title')}</Text>
          <Text style={styles.stepLabel}>{t('ui.step_of', { current: cookStep + 1, total: totalSteps })}</Text>
        </View>
      </View>

      <ProgressBar current={cookStep + 1} total={totalSteps} />

      <View style={styles.cookCenter}>
        <ScrollView
          ref={cookScrollRef}
          style={styles.scrollFlex}
          contentContainerStyle={styles.cookContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.cookTitle}>{t(currentCookData.titleKey)}</Text>
          <Image source={currentCookData.photo} style={styles.cookPhoto} contentFit="cover" transition={200} />
          <Text style={styles.cookDesc}>{t(currentCookData.descriptionKey)}</Text>

          <Card style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <ChefHat size={50} color="#111827" />
            </View>
            <View style={styles.labelRow}>
              <Target size={12} color="#f97316" />
              <Text style={styles.tipLabelText}>{t('ui.commit_point')}</Text>
            </View>
            <Text style={styles.tipText}>{t(currentCookData.tipKey)}</Text>
          </Card>
        </ScrollView>
      </View>

      <Pressable onPress={onNext} style={styles.primaryButtonInline}>
        <Text style={styles.primaryButtonText}>
          {cookStep < totalSteps - 1 ? t('ui.next_step') : t('ui.finish_prep')}
        </Text>
        <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
      </Pressable>
    </View>
  );
};

export const CookScreenContent = memo(CookScreenContentComponent);
