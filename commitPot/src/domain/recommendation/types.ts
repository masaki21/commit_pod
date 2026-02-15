import { Goal, PotBase } from '../../../types';

export type RecommendationSource = 'matrix' | 'ai' | 'fallback';

export type RecommendationInput = {
  soupBase: PotBase;
  proteinId: string;
  goal?: Goal;
  locale?: string;
  candidateVeggieIds: string[];
  candidateMushroomIds: string[];
};

export type RecommendationResult = {
  veggieIds: [string, string];
  mushroomId: string;
  source: RecommendationSource;
  reason: string;
};

export interface VegRecommendationProvider {
  recommend(input: RecommendationInput): Promise<RecommendationResult | null>;
}

export type RecommendationEventType =
  | 'recommendation_started'
  | 'provider_miss'
  | 'ai_invoked'
  | 'provider_error'
  | 'recommendation_resolved'
  | 'recommendation_failed'
  | 'ai_cache_saved'
  | 'ai_cache_failed';

export type RecommendationEvent = {
  type: RecommendationEventType;
  soupBase: RecommendationInput['soupBase'];
  proteinId: RecommendationInput['proteinId'];
  provider?: RecommendationSource | 'matrix' | 'ai' | 'fallback';
  reason?: string;
  errorMessage?: string;
  durationMs?: number;
};

export interface RecommendationObserver {
  emit(event: RecommendationEvent): void;
}
