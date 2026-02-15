import { supabase } from '../../../supabase';
import { RecommendationInput, RecommendationObserver, RecommendationResult } from '../../domain/recommendation';

type CacheAiRecommendationInput = {
  request: RecommendationInput;
  result: RecommendationResult;
  observer?: RecommendationObserver;
};

export const cacheAiRecommendation = async ({
  request,
  result,
  observer,
}: CacheAiRecommendationInput): Promise<void> => {
  if (result.source !== 'ai') return;

  const { error } = await supabase.from('synergy_matrix').upsert(
    {
      pot_base: request.soupBase,
      protein_id: request.proteinId,
      veggie_ids: result.veggieIds,
      mushroom_id: result.mushroomId,
      synergy_reason: result.reason,
      nutrition_category: 'ai_generated',
      evidence_level: 1,
      priority: 500,
      is_active: true,
    },
    {
      onConflict: 'pot_base,protein_id,veggie_ids,mushroom_id',
      ignoreDuplicates: true,
    }
  );

  if (error) {
    observer?.emit({
      type: 'ai_cache_failed',
      soupBase: request.soupBase,
      proteinId: request.proteinId,
      provider: 'ai',
      errorMessage: error.message,
    });
    throw error;
  }

  observer?.emit({
    type: 'ai_cache_saved',
    soupBase: request.soupBase,
    proteinId: request.proteinId,
    provider: 'ai',
  });
};
