import { supabase } from '../../../supabase';
import {
  RecommendationInput,
  RecommendationResult,
  VegRecommendationProvider,
} from '../../domain/recommendation';
import { recommendationDebug } from './recommendationLog';
import { isValidRecommendationCandidate } from './validateRecommendation';

type SynergyMatrixRow = {
  veggie_ids: string[];
  mushroom_id: string;
  synergy_reason: string;
  is_active: boolean;
  priority: number;
};

export const supabaseMatrixProvider: VegRecommendationProvider = {
  async recommend(input: RecommendationInput): Promise<RecommendationResult | null> {
    const { data, error } = await supabase
      .from('synergy_matrix')
      .select('veggie_ids, mushroom_id, synergy_reason, is_active, priority')
      .eq('pot_base', input.soupBase)
      .eq('protein_id', input.proteinId)
      .eq('is_active', true)
      .order('priority', { ascending: true })
      .order('updated_at', { ascending: false });

    if (error || !data?.length) {
      recommendationDebug('matrix lookup miss or error', {
        soupBase: input.soupBase,
        proteinId: input.proteinId,
        error: error?.message,
      });
      return null;
    }

    const candidate = data.find((row) => isValidRecommendationCandidate(row, input));
    if (!candidate) {
      recommendationDebug('all matrix rows rejected by candidate validation', {
        soupBase: input.soupBase,
        proteinId: input.proteinId,
        rowCount: data.length,
      });
      return null;
    }

    return {
      veggieIds: candidate.veggie_ids,
      mushroomId: candidate.mushroom_id,
      source: 'matrix',
      reason: candidate.synergy_reason,
    };
  },
};
