"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const index_1 = require("../index");
const baseInput = {
    soupBase: 'yose',
    proteinId: 'pork_loin',
    candidateVeggieIds: ['nira', 'negi', 'komatsuna', 'maitake'],
    candidateMushroomIds: ['maitake'],
};
const createDependencies = (overrides = {}) => {
    return {
        matrixProvider: { recommend: async () => null },
        aiProvider: { recommend: async () => null },
        safeFallbackProvider: { recommend: async () => null },
        ...overrides,
    };
};
(0, node_test_1.default)('matrix結果がある場合はmatrixを返す', async () => {
    const result = await (0, index_1.getRecommendedVeggies)(baseInput, createDependencies({
        matrixProvider: {
            recommend: async () => ({
                veggieIds: ['nira', 'negi'],
                mushroomId: 'maitake',
                source: 'matrix',
                reason: 'matrix-hit',
            }),
        },
    }));
    strict_1.default.equal(result.source, 'matrix');
    strict_1.default.equal(result.reason, 'matrix-hit');
});
(0, node_test_1.default)('matrix miss時にai結果へフォールスルーする', async () => {
    const result = await (0, index_1.getRecommendedVeggies)(baseInput, createDependencies({
        aiProvider: {
            recommend: async () => ({
                veggieIds: ['komatsuna', 'negi'],
                mushroomId: 'maitake',
                source: 'ai',
                reason: 'ai-hit',
            }),
        },
    }));
    strict_1.default.equal(result.source, 'ai');
    strict_1.default.equal(result.reason, 'ai-hit');
});
(0, node_test_1.default)('providerで例外が発生しても次のproviderで解決する', async () => {
    const result = await (0, index_1.getRecommendedVeggies)(baseInput, createDependencies({
        matrixProvider: {
            recommend: async () => {
                throw new Error('matrix down');
            },
        },
        aiProvider: {
            recommend: async () => ({
                veggieIds: ['komatsuna', 'negi'],
                mushroomId: 'maitake',
                source: 'ai',
                reason: 'ai-recovered',
            }),
        },
    }));
    strict_1.default.equal(result.source, 'ai');
    strict_1.default.equal(result.reason, 'ai-recovered');
});
(0, node_test_1.default)('全providerがnullの場合は例外を投げる', async () => {
    await strict_1.default.rejects(() => (0, index_1.getRecommendedVeggies)(baseInput, createDependencies({
        matrixProvider: { recommend: async () => null },
        aiProvider: { recommend: async () => null },
        safeFallbackProvider: { recommend: async () => null },
    })), /Failed to resolve veggie recommendation/);
});
(0, node_test_1.default)('observerへイベントが送信される', async () => {
    const events = [];
    const deps = createDependencies({
        matrixProvider: {
            recommend: async () => ({
                veggieIds: ['nira', 'negi'],
                mushroomId: 'maitake',
                source: 'matrix',
                reason: 'matrix-hit',
            }),
        },
        observer: {
            emit(event) {
                events.push(event.type);
            },
        },
    });
    const result = await (0, index_1.getRecommendedVeggies)(baseInput, deps);
    strict_1.default.equal(result.source, 'matrix');
    strict_1.default.deepEqual(events, ['recommendation_started', 'recommendation_resolved']);
});
