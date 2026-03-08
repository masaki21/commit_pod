import React from 'react';
import {
  FIVE_SERVINGS_POT_IMAGE,
  MEAL_SHARE,
  POT_BASE_IMAGES,
  SMALL_BUTTON_HIT_SLOP,
} from '../../../features/common/constants/appUiConfig';
import {
  getIngredientsForPotBase,
  MUSHROOM_IDS,
  normalizePlanForPotBase,
} from '../../../features/plan-builder/constants/potBaseIngredients';
import { getEffectLead } from '../../../features/plan-builder/utils/effectText';

type BuildBuilderRouteParams = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setScreen: React.Dispatch<React.SetStateAction<any>>;
  currentPlan: any;
  setCurrentPlan: React.Dispatch<React.SetStateAction<any>>;
  handleToggleProtein: (id: string) => Promise<void>;
  synergySummary: any;
  localizedSynergyReason: string;
  synergyCardAnimatedStyle: any;
  autoRecommendedVeggies: string[];
  markSynergySummaryAsCustom: () => void;
  setAutoRecommendedVeggies: React.Dispatch<React.SetStateAction<string[]>>;
  handleRestoreAiRecommendation: () => void;
  currentPlanTotals: any;
  currentPlanShoppingEntries: any[];
  currentPlanSeasoningEntries: any[];
  skipPlanConfirm: boolean;
  showPlanConfirm: boolean;
  setShowPlanConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  handleFinishPlan: () => Promise<void>;
  showFiveServingsModal: boolean;
  setShowFiveServingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  skipFiveServingsModal: boolean;
  setSkipFiveServingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSkipPlanConfirm: React.Dispatch<React.SetStateAction<boolean>>;
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
  targetPFC: any;
  isCompactScreen: boolean;
  formatUnits: (...args: any[]) => string;
};

type BuilderUiAdapters = {
  ProgressBar: ({ current, total }: { current: number; total: number }) => React.ReactElement;
  SectionTitle: ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => React.ReactElement;
  Card: ({ children, style }: { children: React.ReactNode; style?: object }) => React.ReactElement;
};

export function buildBuilderRoute(params: BuildBuilderRouteParams, ui: BuilderUiAdapters) {
  return {
    step: params.step,
    setStep: params.setStep,
    setScreen: params.setScreen,
    currentPlan: params.currentPlan,
    setCurrentPlan: params.setCurrentPlan,
    normalizePlanForPotBase,
    getIngredientsForPotBase,
    handleToggleProtein: params.handleToggleProtein,
    mushroomIds: MUSHROOM_IDS,
    synergySummary: params.synergySummary,
    localizedSynergyReason: params.localizedSynergyReason,
    synergyCardAnimatedStyle: params.synergyCardAnimatedStyle,
    autoRecommendedVeggies: params.autoRecommendedVeggies,
    markSynergySummaryAsCustom: params.markSynergySummaryAsCustom,
    setAutoRecommendedVeggies: params.setAutoRecommendedVeggies,
    handleRestoreAiRecommendation: params.handleRestoreAiRecommendation,
    getEffectLead,
    currentPlanTotals: params.currentPlanTotals,
    currentPlanShoppingEntries: params.currentPlanShoppingEntries,
    currentPlanSeasoningEntries: params.currentPlanSeasoningEntries,
    skipPlanConfirm: params.skipPlanConfirm,
    showPlanConfirm: params.showPlanConfirm,
    setShowPlanConfirm: params.setShowPlanConfirm,
    handleFinishPlan: params.handleFinishPlan,
    showFiveServingsModal: params.showFiveServingsModal,
    setShowFiveServingsModal: params.setShowFiveServingsModal,
    skipFiveServingsModal: params.skipFiveServingsModal,
    setSkipFiveServingsModal: params.setSkipFiveServingsModal,
    setSkipPlanConfirm: params.setSkipPlanConfirm,
    fiveServingsPotImage: FIVE_SERVINGS_POT_IMAGE,
    showAutoVegMiniToast: params.showAutoVegMiniToast,
    autoVegMiniToastOpacity: params.autoVegMiniToastOpacity,
    autoVegMiniToastTranslateY: params.autoVegMiniToastTranslateY,
    autoVegMiniToastScale: params.autoVegMiniToastScale,
    showAutoVegHud: params.showAutoVegHud,
    autoVegHudOpacity: params.autoVegHudOpacity,
    autoVegHudTranslateY: params.autoVegHudTranslateY,
    autoVegHudScale: params.autoVegHudScale,
    showSynergyIntroHud: params.showSynergyIntroHud,
    synergyIntroHudOpacity: params.synergyIntroHudOpacity,
    synergyIntroHudTranslateY: params.synergyIntroHudTranslateY,
    synergyIntroHudScale: params.synergyIntroHudScale,
    potBaseImages: POT_BASE_IMAGES,
    smallButtonHitSlop: SMALL_BUTTON_HIT_SLOP,
    ProgressBar: ui.ProgressBar,
    SectionTitle: ui.SectionTitle,
    Card: ui.Card,
    mealShare: MEAL_SHARE,
    targetPFC: params.targetPFC,
    isCompactScreen: params.isCompactScreen,
    formatUnits: params.formatUnits,
  };
}
