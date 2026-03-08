import { useCallback, useEffect, useRef } from 'react';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Plan, PotBase, UserProfile } from '../../../../types';
import { perfMeasureAsync, perfTap } from '../../common/utils/perfLogger';

type SynergySummaryState = {
  reason: string;
  mode: 'ai' | 'custom';
  recommendedVeggies: string[];
};

type RecommendResult = {
  veggieIds: string[];
  mushroomId: string;
  reason: string;
};

type RecommendArgs = {
  soupBase: PotBase;
  proteinId: string;
  goal: UserProfile['goal'];
  locale: string;
  candidateVeggieIds: string[];
  candidateMushroomIds: string[];
  signal?: AbortSignal | null;
};

type Params = {
  currentPlan: Partial<Plan>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  profileGoal: UserProfile['goal'];
  language: string;
  recommend: (args: RecommendArgs) => Promise<RecommendResult>;
  recommendationRequestRef: MutableRefObject<number>;
  triggerAutoVegFeedback: (recommendedIds: string[]) => void;
  setSynergySummary: Dispatch<SetStateAction<SynergySummaryState | null>>;
  animateSynergySummaryCard: () => void;
  getVeggieCandidates: (
    potBase: PotBase
  ) => { candidateVeggieIds: string[]; candidateMushroomIds: string[] };
};

export const useProteinRecommendation = ({
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
}: Params) => {
  const activeRecommendationAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      activeRecommendationAbortRef.current?.abort();
      activeRecommendationAbortRef.current = null;
    };
  }, []);

  const applyAutoVegRecommendation = useCallback(
    async (proteinId: string, potBase: PotBase, shouldShowFeedback = true) => {
      const { candidateVeggieIds, candidateMushroomIds } = getVeggieCandidates(potBase);
      if (candidateVeggieIds.length < 3 || candidateMushroomIds.length < 1) return;

      activeRecommendationAbortRef.current?.abort();
      const abortController = new AbortController();
      activeRecommendationAbortRef.current = abortController;

      const requestId = recommendationRequestRef.current + 1;
      recommendationRequestRef.current = requestId;

      try {
        const result = await perfMeasureAsync(
          'builder.recommendation.resolve',
          () =>
            recommend({
              soupBase: potBase,
              proteinId,
              goal: profileGoal,
              locale: language,
              candidateVeggieIds,
              candidateMushroomIds,
              signal: abortController.signal,
            }),
          {
            proteinId,
            potBase,
            candidateVeggieCount: candidateVeggieIds.length,
            candidateMushroomCount: candidateMushroomIds.length,
          },
          { logAll: true }
        );

        if (abortController.signal.aborted) return;
        if (recommendationRequestRef.current !== requestId) return;
        const nextVeggies = [result.veggieIds[0], result.veggieIds[1], result.mushroomId];
        if (shouldShowFeedback) {
          triggerAutoVegFeedback(nextVeggies);
        }
        setSynergySummary({
          reason: result.reason,
          mode: 'ai',
          recommendedVeggies: nextVeggies,
        });
        animateSynergySummaryCard();

        setCurrentPlan((prev) => {
          const currentPotBase = (prev.potBase || 'yose') as PotBase;
          if (currentPotBase !== potBase) return prev;
          return {
            ...prev,
            veggies: nextVeggies,
          };
        });
      } catch {
        // Keep current manual selection if recommendation fails.
      } finally {
        if (activeRecommendationAbortRef.current === abortController) {
          activeRecommendationAbortRef.current = null;
        }
      }
    },
    [
      animateSynergySummaryCard,
      getVeggieCandidates,
      language,
      profileGoal,
      recommend,
      recommendationRequestRef,
      setCurrentPlan,
      setSynergySummary,
      triggerAutoVegFeedback,
    ]
  );

  const handleToggleProtein = useCallback(
    (ingredientId: string) => {
      perfTap('builder.toggleProtein', {
        ingredientId,
        selectedProteinCount: (currentPlan.proteins || []).length,
      });
      const exists = currentPlan.proteins?.includes(ingredientId);
      if (exists) {
        activeRecommendationAbortRef.current?.abort();
        setCurrentPlan({
          ...currentPlan,
          proteins: currentPlan.proteins?.filter((p) => p !== ingredientId),
        });
        return;
      }

      const potBase = (currentPlan.potBase || 'yose') as PotBase;
      const nextProteins = [...(currentPlan.proteins || [])];
      if (nextProteins.length >= 2) {
        nextProteins.shift();
      }
      nextProteins.push(ingredientId);
      const shouldShowFeedback = (currentPlan.proteins?.length || 0) >= 1;

      setCurrentPlan({
        ...currentPlan,
        proteins: nextProteins,
      });
      void applyAutoVegRecommendation(ingredientId, potBase, shouldShowFeedback);
    },
    [applyAutoVegRecommendation, currentPlan, setCurrentPlan]
  );

  return {
    applyAutoVegRecommendation,
    handleToggleProtein,
  };
};
