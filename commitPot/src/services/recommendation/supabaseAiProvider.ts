import { supabase } from '../../../supabase';
import {
  RecommendationInput,
  RecommendationResult,
  VegRecommendationProvider,
} from '../../domain/recommendation';
import { recommendationDebug } from './recommendationLog';
import { isValidRecommendationCandidate } from './validateRecommendation';

type AiRecommendationResponse = {
  veggie_ids: string[];
  mushroom_id: string;
  reason?: string;
};

const AI_FUNCTION_NAME = process.env.EXPO_PUBLIC_VEG_RECOMMENDER_FN || 'recommend_veggies';
const AI_TIMEOUT_MS = 1800;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> => {
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
};

const parseAiPayload = (payload: unknown): AiRecommendationResponse | null => {
  if (!payload || typeof payload !== 'object') return null;

  const data = payload as Record<string, unknown>;
  const veggieIds = data.veggie_ids;
  const mushroomId = data.mushroom_id;
  const reason = data.reason;

  if (!Array.isArray(veggieIds) || typeof mushroomId !== 'string') return null;

  return {
    veggie_ids: veggieIds.filter((id): id is string => typeof id === 'string'),
    mushroom_id: mushroomId,
    reason: typeof reason === 'string' ? reason : undefined,
  };
};

export const supabaseAiProvider: VegRecommendationProvider = {
  async recommend(input: RecommendationInput): Promise<RecommendationResult | null> {
    const invokePromise = supabase.functions.invoke(AI_FUNCTION_NAME, {
      body: {
        soupBase: input.soupBase,
        proteinId: input.proteinId,
        goal: input.goal,
        locale: input.locale,
        candidateVeggieIds: input.candidateVeggieIds,
        candidateMushroomIds: input.candidateMushroomIds,
      },
    });

    const invokeResult = await withTimeout(invokePromise, AI_TIMEOUT_MS);
    if (!invokeResult) {
      recommendationDebug('ai invoke timeout', { soupBase: input.soupBase, proteinId: input.proteinId });
      return null;
    }

    const { data, error } = invokeResult;
    if (error || !data) {
      recommendationDebug('ai invoke failed', {
        soupBase: input.soupBase,
        proteinId: input.proteinId,
        error: error?.message,
      });
      return null;
    }

    const parsed = parseAiPayload(data);
    if (!parsed) {
      recommendationDebug('ai payload parse failed', { soupBase: input.soupBase, proteinId: input.proteinId });
      return null;
    }
    const aiReason = parsed.reason;
    if (!isValidRecommendationCandidate(parsed, input)) {
      recommendationDebug('ai recommendation rejected by candidate validation', {
        soupBase: input.soupBase,
        proteinId: input.proteinId,
      });
      return null;
    }

    return {
      veggieIds: parsed.veggie_ids,
      mushroomId: parsed.mushroom_id,
      source: 'ai',
      reason: aiReason || 'ai:generated',
    };
  },
};
