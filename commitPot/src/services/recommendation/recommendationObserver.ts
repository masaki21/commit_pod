import { RecommendationEvent, RecommendationObserver } from '../../domain/recommendation';
import { recommendationDebug } from './recommendationLog';
import { persistRecommendationEvent } from './persistRecommendationEvent';

const DEBUG_ENABLED = process.env.EXPO_PUBLIC_RECOMMENDATION_DEBUG === '1';
const MONITORING_ENABLED = process.env.EXPO_PUBLIC_RECOMMENDATION_MONITORING === '1';
const SNAPSHOT_INTERVAL = 10;

type MetricSnapshot = {
  total: number;
  resolved: number;
  failed: number;
  matrixResolved: number;
  aiResolved: number;
  aiInvoked: number;
  fallbackResolved: number;
  cacheSaved: number;
  cacheFailed: number;
};

const metrics: MetricSnapshot = {
  total: 0,
  resolved: 0,
  failed: 0,
  matrixResolved: 0,
  aiResolved: 0,
  aiInvoked: 0,
  fallbackResolved: 0,
  cacheSaved: 0,
  cacheFailed: 0,
};

const logDebugEvent = (event: RecommendationEvent): void => {
  if (!DEBUG_ENABLED) return;
  console.info('[recommendation:event]', JSON.stringify(event));
};

const logSnapshot = (): void => {
  if (!MONITORING_ENABLED) return;
  console.info('[recommendation:monitor]', JSON.stringify(metrics));
};

const updateMetrics = (event: RecommendationEvent): void => {
  metrics.total += 1;

  if (event.type === 'recommendation_resolved') {
    metrics.resolved += 1;
    if (event.provider === 'matrix') metrics.matrixResolved += 1;
    if (event.provider === 'ai') metrics.aiResolved += 1;
    if (event.provider === 'fallback') metrics.fallbackResolved += 1;
  }

  if (event.type === 'ai_invoked') {
    metrics.aiInvoked += 1;
  }

  if (event.type === 'recommendation_failed') {
    metrics.failed += 1;
  }

  if (event.type === 'ai_cache_saved') {
    metrics.cacheSaved += 1;
  }

  if (event.type === 'ai_cache_failed') {
    metrics.cacheFailed += 1;
  }

  if (metrics.total % SNAPSHOT_INTERVAL === 0) {
    logSnapshot();
  }
};

export const recommendationObserver: RecommendationObserver = {
  emit(event: RecommendationEvent): void {
    logDebugEvent(event);
    updateMetrics(event);
    void persistRecommendationEvent(event).catch((error) => {
      recommendationDebug('recommendation event persist failed', {
        type: event.type,
        soupBase: event.soupBase,
        proteinId: event.proteinId,
        error: error instanceof Error ? error.message : 'unknown-error',
      });
    });
  },
};
