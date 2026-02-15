import { supabase } from '../../../supabase';
import { RecommendationEvent } from '../../domain/recommendation';

const EVENT_PERSIST_ENABLED = process.env.EXPO_PUBLIC_RECOMMENDATION_EVENT_DB !== '0';

type PersistedEventType = 'provider_miss' | 'ai_invoked' | 'recommendation_resolved';

type PersistedRecommendationEvent = {
  event_type: PersistedEventType;
  pot_base: RecommendationEvent['soupBase'];
  protein_id: RecommendationEvent['proteinId'];
  source: 'matrix' | 'ai' | 'fallback' | null;
  reason: string | null;
};

const toPersistableEvent = (event: RecommendationEvent): PersistedRecommendationEvent | null => {
  if (event.type === 'provider_miss' && event.provider === 'matrix') {
    return {
      event_type: 'provider_miss',
      pot_base: event.soupBase,
      protein_id: event.proteinId,
      source: 'matrix',
      reason: null,
    };
  }

  if (event.type === 'ai_invoked') {
    return {
      event_type: 'ai_invoked',
      pot_base: event.soupBase,
      protein_id: event.proteinId,
      source: 'ai',
      reason: null,
    };
  }

  if (event.type === 'recommendation_resolved') {
    return {
      event_type: 'recommendation_resolved',
      pot_base: event.soupBase,
      protein_id: event.proteinId,
      source: event.provider ?? null,
      reason: event.reason ?? null,
    };
  }

  return null;
};

export const persistRecommendationEvent = async (event: RecommendationEvent): Promise<void> => {
  if (!EVENT_PERSIST_ENABLED) return;

  const payload = toPersistableEvent(event);
  if (!payload) return;

  const { error } = await supabase.from('recommendation_events').insert(payload);
  if (error) throw error;
};

