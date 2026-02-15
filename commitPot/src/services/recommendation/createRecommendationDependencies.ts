import {
  RecommendationDependencies,
  RecommendationInput,
  RecommendationResult,
  VegRecommendationProvider,
} from '../../domain/recommendation';
import { cacheAiRecommendation } from './cacheAiRecommendation';
import { recommendationDebug } from './recommendationLog';
import { recommendationObserver } from './recommendationObserver';
import { supabaseAiProvider } from './supabaseAiProvider';
import { supabaseMatrixProvider } from './supabaseMatrixProvider';

const safeFallbackProvider: VegRecommendationProvider = {
  async recommend(input: RecommendationInput): Promise<RecommendationResult | null> {
    const nonMushroomCandidates = input.candidateVeggieIds.filter(
      (id) => !input.candidateMushroomIds.includes(id)
    );

    if (nonMushroomCandidates.length < 2 || input.candidateMushroomIds.length < 1) {
      return null;
    }

    return {
      veggieIds: [nonMushroomCandidates[0], nonMushroomCandidates[1]],
      mushroomId: input.candidateMushroomIds[0],
      source: 'fallback',
      reason: 'fallback:default-candidates',
    };
  },
};

const cachedAiProvider: VegRecommendationProvider = {
  async recommend(input: RecommendationInput): Promise<RecommendationResult | null> {
    recommendationObserver.emit({
      type: 'ai_invoked',
      soupBase: input.soupBase,
      proteinId: input.proteinId,
      provider: 'ai',
    });

    const result = await supabaseAiProvider.recommend(input);
    if (!result) return null;

    try {
      await cacheAiRecommendation({ request: input, result, observer: recommendationObserver });
    } catch (error) {
      recommendationDebug('ai cache save failed', {
        soupBase: input.soupBase,
        proteinId: input.proteinId,
        error: error instanceof Error ? error.message : 'unknown-error',
      });
      // Cache write failure should not block recommendation delivery.
    }

    return result;
  },
};

export const createRecommendationDependencies = (): RecommendationDependencies => {
  return {
    matrixProvider: supabaseMatrixProvider,
    aiProvider: cachedAiProvider,
    safeFallbackProvider,
    observer: recommendationObserver,
  };
};
