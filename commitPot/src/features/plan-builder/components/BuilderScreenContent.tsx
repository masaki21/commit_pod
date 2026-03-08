import React, { memo, useMemo } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft } from 'lucide-react-native';
import { POT_BASES } from '../../../../constants';
import { StepProteinSelection } from './StepProteinSelection';
import { StepVeggieSelection } from './StepVeggieSelection';
import { StepCarbSelection } from './StepCarbSelection';
import { StepPlanSummary } from './StepPlanSummary';
import { BuilderModals } from './BuilderModals';
import { PotBase } from '../../../../types';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type BuilderScreenContentProps = {
  t: TFunc;
  styles: any;
  isWeb: boolean;
  wrapContent: (children: React.ReactNode) => React.ReactNode;
  step: number;
  setStep: (step: number) => void;
  setScreen: (screen: 'dashboard' | 'shopping') => void;
  smallButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  ProgressBar: (props: { current: number; total: number }) => React.ReactElement;
  SectionTitle: (props: { children: React.ReactNode; subtitle?: string }) => React.ReactElement;
  currentPlan: any;
  setCurrentPlan: (plan: any) => void;
  normalizePlanForPotBase: (plan: { proteins: string[]; veggies: string[]; carb: string }, potBase: any) => {
    proteins: string[];
    veggies: string[];
    carb: string;
  };
  potBaseImages: Record<string, any>;
  getIngredientsForPotBase: (potBase: any, category: any) => any[];
  onToggleProtein: (id: string) => void;
  mushroomIds: Set<string>;
  synergySummary: any;
  localizedSynergyReason: string;
  synergyCardAnimatedStyle: any;
  autoRecommendedVeggies: string[];
  onMarkCustom: () => void;
  onSetAutoRecommendedVeggies: (veggies: string[]) => void;
  onRestoreAiRecommendation: () => void;
  getEffectLead: (effect: string) => string;
  Card: (props: { children: React.ReactNode; style?: object }) => React.ReactElement;
  mealShare: number;
  targetPFC: any;
  currentPlanTotals: any;
  currentPlanShoppingEntries: any[];
  currentPlanSeasoningEntries: any[];
  isCompactScreen: boolean;
  formatUnits: (units: number, unitName?: string) => string;
  skipPlanConfirm: boolean;
  showPlanConfirm: boolean;
  setShowPlanConfirm: (value: boolean) => void;
  onFinishPlan: () => Promise<void>;
  showFiveServingsModal: boolean;
  setShowFiveServingsModal: (value: boolean) => void;
  skipFiveServingsModal: boolean;
  setSkipFiveServingsModal: (updater: (prev: boolean) => boolean) => void;
  setSkipPlanConfirm: (updater: (prev: boolean) => boolean) => void;
  fiveServingsPotImage: any;
  showAutoVegMiniToast: boolean;
  autoVegMiniToastOpacity: any;
  autoVegMiniToastTranslateY: any;
  autoVegMiniToastScale: any;
  showAutoVegHud: boolean;
  autoVegHudOpacity: any;
  autoVegHudTranslateY: any;
  autoVegHudScale: any;
  showSynergyIntroHud: boolean;
  synergyIntroHudOpacity: any;
  synergyIntroHudTranslateY: any;
  synergyIntroHudScale: any;
};

const BuilderScreenContentComponent = ({
  t,
  styles,
  isWeb,
  wrapContent,
  step,
  setStep,
  setScreen,
  smallButtonHitSlop,
  ProgressBar,
  SectionTitle,
  currentPlan,
  setCurrentPlan,
  normalizePlanForPotBase,
  potBaseImages,
  getIngredientsForPotBase,
  onToggleProtein,
  mushroomIds,
  synergySummary,
  localizedSynergyReason,
  synergyCardAnimatedStyle,
  autoRecommendedVeggies,
  onMarkCustom,
  onSetAutoRecommendedVeggies,
  onRestoreAiRecommendation,
  getEffectLead,
  Card,
  mealShare,
  targetPFC,
  currentPlanTotals,
  currentPlanShoppingEntries,
  currentPlanSeasoningEntries,
  isCompactScreen,
  formatUnits,
  skipPlanConfirm,
  showPlanConfirm,
  setShowPlanConfirm,
  onFinishPlan,
  showFiveServingsModal,
  setShowFiveServingsModal,
  skipFiveServingsModal,
  setSkipFiveServingsModal,
  setSkipPlanConfirm,
  fiveServingsPotImage,
  showAutoVegMiniToast,
  autoVegMiniToastOpacity,
  autoVegMiniToastTranslateY,
  autoVegMiniToastScale,
  showAutoVegHud,
  autoVegHudOpacity,
  autoVegHudTranslateY,
  autoVegHudScale,
  showSynergyIntroHud,
  synergyIntroHudOpacity,
  synergyIntroHudTranslateY,
  synergyIntroHudScale,
}: BuilderScreenContentProps) => {
  const effectivePotBase = (currentPlan.potBase || 'yose') as PotBase;
  const selectedProteinIds = currentPlan.proteins || [];
  const selectedCarbId = currentPlan.carb || '';
  const selectedVeggieIds = useMemo(
    () => (currentPlan.veggies || []).filter((id: string) => !mushroomIds.has(id)),
    [currentPlan.veggies, mushroomIds]
  );
  const selectedMushroomIds = useMemo(
    () => (currentPlan.veggies || []).filter((id: string) => mushroomIds.has(id)),
    [currentPlan.veggies, mushroomIds]
  );

  const proteinOptions = useMemo(
    () => getIngredientsForPotBase(effectivePotBase, 'protein'),
    [effectivePotBase, getIngredientsForPotBase]
  );
  const carbOptions = useMemo(
    () => getIngredientsForPotBase(effectivePotBase, 'carb'),
    [effectivePotBase, getIngredientsForPotBase]
  );
  const allVegOptions = useMemo(
    () => getIngredientsForPotBase(effectivePotBase, 'veg'),
    [effectivePotBase, getIngredientsForPotBase]
  );
  const veggieOptions = useMemo(
    () => allVegOptions.filter((ing) => !mushroomIds.has(ing.id)),
    [allVegOptions, mushroomIds]
  );
  const mushroomOptions = useMemo(
    () => allVegOptions.filter((ing) => mushroomIds.has(ing.id)),
    [allVegOptions, mushroomIds]
  );

  return (
    <SafeAreaView style={[styles.safeArea, isWeb && styles.webRoot]}>
      {showAutoVegMiniToast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.autoVegMiniToast,
            {
              opacity: autoVegMiniToastOpacity,
              transform: [{ translateY: autoVegMiniToastTranslateY }, { scale: autoVegMiniToastScale }],
            },
          ]}
        >
          <Text style={styles.autoVegMiniToastText}>{t('ui.ai_hud_title')}</Text>
        </Animated.View>
      ) : null}
      {showAutoVegHud ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.autoVegHudWrap,
            {
              opacity: autoVegHudOpacity,
              transform: [{ translateY: autoVegHudTranslateY }, { scale: autoVegHudScale }],
            },
          ]}
        >
          <View style={styles.autoVegHudCard}>
            <Text style={styles.autoVegHudText}>{t('ui.ai_hud_title')}</Text>
          </View>
        </Animated.View>
      ) : null}
      {showSynergyIntroHud && synergySummary?.reason ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.synergyIntroHudWrap,
            {
              opacity: synergyIntroHudOpacity,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.synergyIntroHudCard,
              {
                transform: [{ translateY: synergyIntroHudTranslateY }, { scale: synergyIntroHudScale }],
              },
            ]}
          >
            <Text style={styles.synergyIntroHudTitle}>{t('ui.ai_hud_title')}</Text>
            <Text style={styles.synergyIntroHudSubtitle}>{t('ui.ai_hud_subtitle')}</Text>
            <Text style={styles.synergyIntroHudReason}>{localizedSynergyReason}</Text>
          </Animated.View>
        </Animated.View>
      ) : null}
      {wrapContent(
        <ScrollView
          contentContainerStyle={styles.screenPad}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.builderHeader}>
            <Pressable
              onPress={() => (step > 1 ? setStep(step - 1) : setScreen('dashboard'))}
              style={styles.squareButton}
              hitSlop={smallButtonHitSlop}
            >
              <ChevronLeft size={24} color="#111827" strokeWidth={3} />
            </Pressable>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.stepLabel}>{t('ui.step_label', { current: step, total: 6 })}</Text>
              <Text style={styles.builderTitle}>{t('ui.plan_builder')}</Text>
            </View>
          </View>

          <ProgressBar current={step} total={6} />

          {step === 1 && (
            <View style={styles.sectionBlock}>
              <SectionTitle>{t('ui.servings_question')}</SectionTitle>
              <View style={styles.grid2}>
                {[2, 5].map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => {
                      setCurrentPlan({ ...currentPlan, servings: s as 2 | 5 });
                      if (s === 5) {
                        if (!skipFiveServingsModal) {
                          setShowFiveServingsModal(true);
                          return;
                        }
                        setStep(2);
                        return;
                      }
                      setStep(2);
                    }}
                    style={[styles.choiceCard, currentPlan.servings === s && styles.choiceCardActive]}
                  >
                    <Text style={styles.choiceNumber}>{s}</Text>
                    <Text style={styles.choiceUnit}>{t('ui.servings_unit')}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.sectionBlock}>
              <SectionTitle>{t('ui.base_select')}</SectionTitle>
              <View style={styles.cardStack}>
                {POT_BASES.map((base) => (
                  <Pressable
                    key={base.id}
                    onPress={() => {
                      const normalized = normalizePlanForPotBase(
                        {
                          proteins: currentPlan.proteins || [],
                          veggies: currentPlan.veggies || [],
                          carb: currentPlan.carb || '',
                        },
                        base.id
                      );
                      setCurrentPlan({
                        ...currentPlan,
                        potBase: base.id,
                        proteins: normalized.proteins,
                        veggies: normalized.veggies,
                        carb: normalized.carb,
                      });
                      setStep(3);
                    }}
                    style={[styles.baseRow, currentPlan.potBase === base.id && styles.baseRowActive]}
                  >
                    <View style={styles.baseIcon}>
                      <Image
                        source={potBaseImages[base.id]}
                        style={styles.baseImage}
                        contentFit="cover"
                        transition={150}
                      />
                    </View>
                    <View>
                      <Text style={styles.baseTitle}>{t(base.name)}</Text>
                      <Text style={styles.baseSubtitle}>{t(base.description)}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <StepProteinSelection
              t={t}
              styles={styles}
              proteins={proteinOptions}
              selectedProteinIds={selectedProteinIds}
              onToggleProtein={onToggleProtein}
              onNext={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <StepVeggieSelection
              t={t}
              styles={styles}
              veggieOptions={veggieOptions}
              mushroomOptions={mushroomOptions}
              selectedVeggieIds={selectedVeggieIds}
              selectedMushroomIds={selectedMushroomIds}
              mushroomIds={mushroomIds}
              synergySummary={synergySummary}
              localizedSynergyReason={localizedSynergyReason}
              synergyCardAnimatedStyle={synergyCardAnimatedStyle}
              autoRecommendedVeggies={autoRecommendedVeggies}
              onMarkCustom={onMarkCustom}
              onSetCurrentPlan={setCurrentPlan}
              onSetAutoRecommendedVeggies={onSetAutoRecommendedVeggies}
              onRestoreAiRecommendation={onRestoreAiRecommendation}
              onNext={() => setStep(5)}
            />
          )}

          {step === 5 && (
            <StepCarbSelection
              t={t}
              styles={styles}
              carbs={carbOptions}
              selectedCarbId={selectedCarbId}
              getEffectLead={getEffectLead}
              onSelectCarb={(carbId) => {
                setCurrentPlan({ ...currentPlan, carb: carbId });
                setStep(6);
              }}
            />
          )}

          {step === 6 && (
            <StepPlanSummary
              t={t}
              styles={styles}
              Card={Card}
              mealShare={mealShare}
              targetPFC={targetPFC}
              currentPlanTotals={currentPlanTotals}
              currentPlanShoppingEntries={currentPlanShoppingEntries}
              currentPlanSeasoningEntries={currentPlanSeasoningEntries}
              isCompactScreen={isCompactScreen}
              formatUnits={formatUnits}
              onConfirmPlan={() => {
                if (skipPlanConfirm) {
                  void onFinishPlan();
                  return;
                }
                setShowPlanConfirm(true);
              }}
              onRedoPlan={() => setStep(1)}
            />
          )}
        </ScrollView>
      )}

      <BuilderModals
        t={t}
        styles={styles}
        fiveServingsPotImage={fiveServingsPotImage}
        showFiveServingsModal={showFiveServingsModal}
        skipFiveServingsModal={skipFiveServingsModal}
        showPlanConfirm={showPlanConfirm}
        skipPlanConfirm={skipPlanConfirm}
        onRequestCloseFiveServings={() => setShowFiveServingsModal(false)}
        onToggleSkipFiveServings={() => setSkipFiveServingsModal((prev) => !prev)}
        onConfirmFiveServings={async () => {
          setShowFiveServingsModal(false);
          try {
            await AsyncStorage.setItem('five_servings_modal_skip', skipFiveServingsModal ? 'true' : 'false');
          } catch {
            // ignore storage errors
          }
          setStep(2);
        }}
        onRequestClosePlanConfirm={() => setShowPlanConfirm(false)}
        onToggleSkipPlanConfirm={() => setSkipPlanConfirm((prev) => !prev)}
        onConfirmPlan={async () => {
          setShowPlanConfirm(false);
          try {
            await AsyncStorage.setItem('plan_confirm_skip', skipPlanConfirm ? 'true' : 'false');
          } catch {
            // ignore storage errors
          }
          await onFinishPlan();
          setScreen('shopping');
        }}
      />
    </SafeAreaView>
  );
};

export const BuilderScreenContent = memo(BuilderScreenContentComponent);
