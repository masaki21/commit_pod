"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedVeggies = void 0;
const fallbackProvider = {
    async recommend(input) {
        const nonMushroomCandidates = input.candidateVeggieIds.filter((id) => !input.candidateMushroomIds.includes(id));
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
const noopMatrixProvider = {
    async recommend() {
        return null;
    },
};
const noopAiProvider = {
    async recommend() {
        return null;
    },
};
const defaultDependencies = {
    matrixProvider: noopMatrixProvider,
    aiProvider: noopAiProvider,
    safeFallbackProvider: fallbackProvider,
};
const getRecommendedVeggies = async (input, dependencies = defaultDependencies) => {
    const startedAt = Date.now();
    const emit = (event) => {
        dependencies.observer?.emit(event);
    };
    const runProvider = async (providerName, provider) => {
        try {
            const result = await provider.recommend(input);
            if (!result) {
                emit({
                    type: 'provider_miss',
                    soupBase: input.soupBase,
                    proteinId: input.proteinId,
                    provider: providerName,
                });
            }
            return result;
        }
        catch (error) {
            emit({
                type: 'provider_error',
                soupBase: input.soupBase,
                proteinId: input.proteinId,
                provider: providerName,
                errorMessage: error instanceof Error ? error.message : 'unknown-error',
            });
            return null;
        }
    };
    emit({
        type: 'recommendation_started',
        soupBase: input.soupBase,
        proteinId: input.proteinId,
    });
    const matrixResult = await runProvider('matrix', dependencies.matrixProvider);
    if (matrixResult) {
        emit({
            type: 'recommendation_resolved',
            soupBase: input.soupBase,
            proteinId: input.proteinId,
            provider: matrixResult.source,
            reason: matrixResult.reason,
            durationMs: Date.now() - startedAt,
        });
        return matrixResult;
    }
    const aiResult = await runProvider('ai', dependencies.aiProvider);
    if (aiResult) {
        emit({
            type: 'recommendation_resolved',
            soupBase: input.soupBase,
            proteinId: input.proteinId,
            provider: aiResult.source,
            reason: aiResult.reason,
            durationMs: Date.now() - startedAt,
        });
        return aiResult;
    }
    const fallbackResult = await runProvider('fallback', dependencies.safeFallbackProvider);
    if (fallbackResult) {
        emit({
            type: 'recommendation_resolved',
            soupBase: input.soupBase,
            proteinId: input.proteinId,
            provider: fallbackResult.source,
            reason: fallbackResult.reason,
            durationMs: Date.now() - startedAt,
        });
        return fallbackResult;
    }
    emit({
        type: 'recommendation_failed',
        soupBase: input.soupBase,
        proteinId: input.proteinId,
        durationMs: Date.now() - startedAt,
    });
    throw new Error('Failed to resolve veggie recommendation');
};
exports.getRecommendedVeggies = getRecommendedVeggies;
