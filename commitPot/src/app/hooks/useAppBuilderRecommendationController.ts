import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from 'react';
import { TFunction } from 'i18next';
import { Plan, PotBase } from '../../../types';
import { useAutoVegSelector } from '../../hooks/useAutoVegSelector';
import { createRecommendationDependencies } from '../../services/recommendation/createRecommendationDependencies';
import { AppScreen, SynergySummaryState } from '../../features/common/hooks/useAppFlowState';
import { useProteinRecommendation } from '../../features/plan-builder/hooks/useProteinRecommendation';
import { useRecommendationFeedback } from '../../features/plan-builder/hooks/useRecommendationFeedback';
import { useVeggieReplacement } from '../../features/plan-builder/hooks/useVeggieReplacement';
import {
  getIngredientsForPotBase,
  MUSHROOM_IDS,
} from '../../features/plan-builder/constants/potBaseIngredients';
import { SYNERGY_REASON_I18N } from '../../features/plan-builder/constants/synergyReasonI18n';

type UseAppBuilderRecommendationControllerParams = {
  screen: AppScreen;
  step: number;
  currentPlan: Partial<Plan>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  profileGoal: Plan['goal'];
  language: string;
  resolvedLanguage: string | undefined;
  t: TFunction;
  synergySummary: SynergySummaryState | null;
  setSynergySummary: Dispatch<SetStateAction<SynergySummaryState | null>>;
  setReplacingIngredientId: Dispatch<SetStateAction<string | null>>;
};

export function useAppBuilderRecommendationController({
  screen,
  step,
  currentPlan,
  setCurrentPlan,
  profileGoal,
  language,
  resolvedLanguage,
  t,
  synergySummary,
  setSynergySummary,
  setReplacingIngredientId,
}: UseAppBuilderRecommendationControllerParams) {
  const recommendationRequestRef = useRef(0);
  const recommendationDependencies = useMemo(() => createRecommendationDependencies(), []);
  const { recommend } = useAutoVegSelector(recommendationDependencies);

  const {
    autoRecommendedVeggies,
    setAutoRecommendedVeggies,
    showAutoVegMiniToast,
    showAutoVegHud,
    showSynergyIntroHud,
    autoVegMiniToastOpacity,
    autoVegMiniToastTranslateY,
    autoVegMiniToastScale,
    autoVegHudOpacity,
    autoVegHudTranslateY,
    autoVegHudScale,
    synergyIntroHudOpacity,
    synergyIntroHudTranslateY,
    synergyIntroHudScale,
    localizedSynergyReason,
    synergyCardAnimatedStyle,
    animateSynergySummaryCard,
    markSynergySummaryAsCustom,
    triggerAutoVegFeedback,
  } = useRecommendationFeedback({
    screen,
    step,
    synergySummary,
    setSynergySummary,
    language,
    resolvedLanguage,
    t,
    reasonMap: SYNERGY_REASON_I18N,
  });

  const getVeggieCandidates = useCallback((potBase: PotBase) => {
    const allVeggies = getIngredientsForPotBase(potBase, 'veg');
    const candidateVeggieIds = allVeggies.map((ing) => ing.id);
    const candidateMushroomIds = candidateVeggieIds.filter((id) => MUSHROOM_IDS.has(id));
    return { candidateVeggieIds, candidateMushroomIds };
  }, []);

  const { handleToggleProtein } = useProteinRecommendation({
    currentPlan,
    setCurrentPlan,
    profileGoal,
    language,
    recommend,
    recommendationRequestRef,
    triggerAutoVegFeedback,
    setSynergySummary,
    animateSynergySummaryCard,
    getVeggieCandidates,
  });

  const { handleRestoreAiRecommendation } = useVeggieReplacement({
    currentPlan,
    setCurrentPlan,
    setReplacingIngredientId,
    setAutoRecommendedVeggies,
    markSynergySummaryAsCustom,
    synergySummary,
    setSynergySummary,
    animateSynergySummaryCard,
  });

  return {
    handleToggleProtein,
    handleRestoreAiRecommendation,
    autoRecommendedVeggies,
    setAutoRecommendedVeggies,
    showAutoVegMiniToast,
    showAutoVegHud,
    showSynergyIntroHud,
    autoVegMiniToastOpacity,
    autoVegMiniToastTranslateY,
    autoVegMiniToastScale,
    autoVegHudOpacity,
    autoVegHudTranslateY,
    autoVegHudScale,
    synergyIntroHudOpacity,
    synergyIntroHudTranslateY,
    synergyIntroHudScale,
    localizedSynergyReason,
    synergyCardAnimatedStyle,
    markSynergySummaryAsCustom,
  };
}
