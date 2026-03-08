import { Alert } from 'react-native';
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { Plan, PotBase } from '../../../../types';
import { getAlternativeIngredientSuggestion } from '../../../services/recommendation/getAlternativeIngredientSuggestion';

type SynergySummaryState = {
  reason: string;
  mode: 'ai' | 'custom';
  recommendedVeggies: string[];
};

type Params = {
  currentPlan: Partial<Plan>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  setReplacingIngredientId: Dispatch<SetStateAction<string | null>>;
  setAutoRecommendedVeggies: Dispatch<SetStateAction<string[]>>;
  markSynergySummaryAsCustom: () => void;
  synergySummary: SynergySummaryState | null;
  setSynergySummary: Dispatch<SetStateAction<SynergySummaryState | null>>;
  animateSynergySummaryCard: () => void;
};

export const useVeggieReplacement = ({
  currentPlan,
  setCurrentPlan,
  setReplacingIngredientId,
  setAutoRecommendedVeggies,
  markSynergySummaryAsCustom,
  synergySummary,
  setSynergySummary,
  animateSynergySummaryCard,
}: Params) => {
  const handleRestoreAiRecommendation = useCallback(() => {
    setCurrentPlan((prev) => ({
      ...prev,
      veggies: [...(synergySummary?.recommendedVeggies || [])],
    }));
    setAutoRecommendedVeggies([...(synergySummary?.recommendedVeggies || [])]);
    setSynergySummary((prev) => (prev ? { ...prev, mode: 'ai' } : prev));
    animateSynergySummaryCard();
  }, [
    animateSynergySummaryCard,
    setAutoRecommendedVeggies,
    setCurrentPlan,
    setSynergySummary,
    synergySummary?.recommendedVeggies,
  ]);

  const replaceIngredientWithAlternative = useCallback(
    async (ingredientId: string, candidateVeggieIds: string[]) => {
      const selectedProteinId =
        currentPlan.proteins && currentPlan.proteins.length > 0
          ? currentPlan.proteins[currentPlan.proteins.length - 1]
          : null;
      const potBase = (currentPlan.potBase || 'yose') as PotBase;
      const selectedVeggieIds = currentPlan.veggies || [];

      if (!selectedProteinId || !selectedVeggieIds.includes(ingredientId)) {
        return;
      }

      setReplacingIngredientId(ingredientId);

      try {
        const suggestion = await getAlternativeIngredientSuggestion({
          potBase,
          proteinId: selectedProteinId,
          ingredientId,
          candidateVeggieIds,
          selectedVeggieIds,
        });

        if (!suggestion) {
          Alert.alert('入れ替え候補なし', '同じ栄養カテゴリの代替候補が見つかりませんでした。');
          return;
        }

        setCurrentPlan((prev) => {
          const nextVeggies = [...(prev.veggies || [])];
          const replaceIndex = nextVeggies.indexOf(ingredientId);
          if (replaceIndex < 0) return prev;
          if (nextVeggies[replaceIndex] === suggestion.alternativeId) return prev;

          nextVeggies[replaceIndex] = suggestion.alternativeId;
          const uniqueVeggies: string[] = [];
          for (const id of nextVeggies) {
            if (!uniqueVeggies.includes(id)) uniqueVeggies.push(id);
          }

          return {
            ...prev,
            veggies: uniqueVeggies,
          };
        });

        setAutoRecommendedVeggies([]);
        markSynergySummaryAsCustom();
      } finally {
        setReplacingIngredientId((prev) => (prev === ingredientId ? null : prev));
      }
    },
    [
      currentPlan.potBase,
      currentPlan.proteins,
      currentPlan.veggies,
      markSynergySummaryAsCustom,
      setAutoRecommendedVeggies,
      setCurrentPlan,
      setReplacingIngredientId,
    ]
  );

  return {
    handleRestoreAiRecommendation,
    replaceIngredientWithAlternative,
  };
};
