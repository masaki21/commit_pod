const DEBUG_ENABLED = process.env.EXPO_PUBLIC_RECOMMENDATION_DEBUG === '1';

type RecommendationLogMeta = Record<string, unknown>;

export const recommendationDebug = (message: string, meta?: RecommendationLogMeta): void => {
  if (!DEBUG_ENABLED) return;
  if (meta) {
    console.info(`[recommendation:debug] ${message}`, meta);
    return;
  }
  console.info(`[recommendation:debug] ${message}`);
};

