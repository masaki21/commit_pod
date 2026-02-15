import { useCallback } from 'react';

import {
  getRecommendedVeggies,
  RecommendationDependencies,
  RecommendationInput,
  RecommendationResult,
} from '../domain/recommendation';

export const useAutoVegSelector = (dependencies?: RecommendationDependencies) => {
  const recommend = useCallback(
    async (input: RecommendationInput): Promise<RecommendationResult> => {
      return getRecommendedVeggies(input, dependencies);
    },
    [dependencies]
  );

  return { recommend };
};
