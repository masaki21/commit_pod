import { TFunction } from 'i18next';
import { Dispatch, SetStateAction } from 'react';
import { Plan } from '../../../types';
import { SynergySummaryState } from '../../features/common/hooks/useAppFlowState';
import { useAppBuilderRecommendationController } from './useAppBuilderRecommendationController';

type UseAppBuilderFlowControllerParams = {
  screen: string;
  step: number;
  currentPlan: Partial<Plan>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  profileGoal: string;
  language: string;
  resolvedLanguage?: string;
  t: TFunction;
  synergySummary: SynergySummaryState | null;
  setSynergySummary: Dispatch<SetStateAction<SynergySummaryState | null>>;
  setReplacingIngredientId: Dispatch<SetStateAction<string | null>>;
};

export function useAppBuilderFlowController(params: UseAppBuilderFlowControllerParams) {
  return useAppBuilderRecommendationController({
    screen: params.screen,
    step: params.step,
    currentPlan: params.currentPlan,
    setCurrentPlan: params.setCurrentPlan,
    profileGoal: params.profileGoal,
    language: params.language,
    resolvedLanguage: params.resolvedLanguage,
    t: params.t,
    synergySummary: params.synergySummary,
    setSynergySummary: params.setSynergySummary,
    setReplacingIngredientId: params.setReplacingIngredientId,
  });
}
