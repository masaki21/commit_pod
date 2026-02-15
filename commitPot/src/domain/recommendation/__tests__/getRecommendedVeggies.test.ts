import assert from 'node:assert/strict';
import test from 'node:test';

import { getRecommendedVeggies, RecommendationDependencies, RecommendationInput } from '../index';

const baseInput: RecommendationInput = {
  soupBase: 'yose',
  proteinId: 'pork_loin',
  candidateVeggieIds: ['nira', 'negi', 'komatsuna', 'maitake'],
  candidateMushroomIds: ['maitake'],
};

const createDependencies = (
  overrides: Partial<RecommendationDependencies> = {}
): RecommendationDependencies => {
  return {
    matrixProvider: { recommend: async () => null },
    aiProvider: { recommend: async () => null },
    safeFallbackProvider: { recommend: async () => null },
    ...overrides,
  };
};

test('matrix結果がある場合はmatrixを返す', async () => {
  const result = await getRecommendedVeggies(
    baseInput,
    createDependencies({
      matrixProvider: {
        recommend: async () => ({
          veggieIds: ['nira', 'negi'],
          mushroomId: 'maitake',
          source: 'matrix',
          reason: 'matrix-hit',
        }),
      },
    })
  );

  assert.equal(result.source, 'matrix');
  assert.equal(result.reason, 'matrix-hit');
});

test('matrix miss時にai結果へフォールスルーする', async () => {
  const result = await getRecommendedVeggies(
    baseInput,
    createDependencies({
      aiProvider: {
        recommend: async () => ({
          veggieIds: ['komatsuna', 'negi'],
          mushroomId: 'maitake',
          source: 'ai',
          reason: 'ai-hit',
        }),
      },
    })
  );

  assert.equal(result.source, 'ai');
  assert.equal(result.reason, 'ai-hit');
});

test('providerで例外が発生しても次のproviderで解決する', async () => {
  const result = await getRecommendedVeggies(
    baseInput,
    createDependencies({
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
    })
  );

  assert.equal(result.source, 'ai');
  assert.equal(result.reason, 'ai-recovered');
});

test('全providerがnullの場合は例外を投げる', async () => {
  await assert.rejects(
    () =>
      getRecommendedVeggies(
        baseInput,
        createDependencies({
          matrixProvider: { recommend: async () => null },
          aiProvider: { recommend: async () => null },
          safeFallbackProvider: { recommend: async () => null },
        })
      ),
    /Failed to resolve veggie recommendation/
  );
});

test('observerへイベントが送信される', async () => {
  const events: string[] = [];
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

  const result = await getRecommendedVeggies(baseInput, deps);
  assert.equal(result.source, 'matrix');
  assert.deepEqual(events, ['recommendation_started', 'recommendation_resolved']);
});

