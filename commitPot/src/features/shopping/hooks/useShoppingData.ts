import { useCallback, useMemo } from 'react';
import { Goal, Ingredient, PFC, Plan, PotBase } from '../../../../types';
import { perfMeasureSync } from '../../common/utils/perfLogger';

type NutritionPer100g = {
  kcalPer100g: number;
  pPer100g: number;
  fPer100g: number;
  cPer100g: number;
};

type ServingCount = 2 | 5;

type SeasoningDefinition = {
  id: string;
  name: string;
  gramsByServings: Record<ServingCount, number>;
  nutrition: NutritionPer100g;
  note?: string;
  noteByServings?: Partial<Record<ServingCount, string>>;
  amountLabelByServings?: Partial<Record<ServingCount, string>>;
};

type IngredientCategory = 'protein' | 'veg' | 'carb';

type Screen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'cards' | 'shopping' | 'cook';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

export type ShoppingEntry = {
  id: string;
  name: string;
  category: IngredientCategory;
  roundedGrams: number;
  units: number | null;
  unitName: string | undefined;
};

export type SeasoningEntry = {
  id: string;
  name: string;
  grams: number;
  amountLabel?: string;
  note?: string;
  nutrition: NutritionPer100g;
};

export function useShoppingData({
  plans,
  shoppingPlanId,
  balancePlanId,
  screen,
  step,
  currentPlan,
  targetPFC,
  goal,
  t,
  mealShare,
  ingredientById,
  potBaseSeasonings,
}: {
  plans: Plan[];
  shoppingPlanId: string | null;
  balancePlanId: string | null;
  screen: Screen;
  step: number;
  currentPlan: Partial<Plan>;
  targetPFC: PFC;
  goal: Goal;
  t: TFunc;
  mealShare: number;
  ingredientById: Map<string, Ingredient>;
  potBaseSeasonings: Record<PotBase, SeasoningDefinition[]>;
}) {
  const selectedShoppingPlan = shoppingPlanId ? plans.find((plan) => plan.id === shoppingPlanId) ?? null : null;
  const selectedBalancePlan = balancePlanId ? plans.find((plan) => plan.id === balancePlanId) ?? null : null;

  const formatUnits = useCallback((units: number | null, unitName?: string) => {
    if (!units || !unitName) return '';
    const fractionMatch = unitName.match(/^(.+?)\((\d+)\/(\d+)\)$/);
    if (fractionMatch) {
      const baseLabel = fractionMatch[1];
      const numerator = Number(fractionMatch[2]);
      const denominator = Number(fractionMatch[3]);
      const totalNumerator = units * numerator;
      const whole = Math.floor(totalNumerator / denominator);
      const remainder = totalNumerator % denominator;
      if (remainder === 0) {
        return whole > 0 ? `${whole}${baseLabel}` : '';
      }
      if (whole > 0) {
        return `${whole}${baseLabel}${remainder}/${denominator}`;
      }
      return `${remainder}/${denominator}${baseLabel}`;
    }
    const decimalMatch = unitName.match(/^(.+?)\((\d+)\.(\d+)\)$/);
    if (decimalMatch) {
      const baseLabel = decimalMatch[1];
      const intPart = Number(decimalMatch[2]);
      const decimalPart = Number(decimalMatch[3]);
      const denominator = 10 ** String(decimalPart).length;
      const totalNumerator = units * (intPart * denominator + decimalPart);
      const whole = Math.floor(totalNumerator / denominator);
      const remainder = totalNumerator % denominator;
      if (remainder === 0) return `${whole}${baseLabel}`;
      return `${whole}.${String(remainder).padStart(String(decimalPart).length, '0')}${baseLabel}`;
    }
    const needsSpace = /[A-Za-z]/.test(unitName);
    return `${units}${needsSpace ? ' ' : ''}${unitName}`;
  }, []);

  const getSeasoningEntries = useCallback(
    (plan: Partial<Plan>): SeasoningEntry[] => {
      const potBase = (plan.potBase || 'yose') as PotBase;
      const servings = (plan.servings === 2 ? 2 : 5) as ServingCount;
      return (potBaseSeasonings[potBase] || []).map((seasoning) => {
        const amountLabelKey = seasoning.amountLabelByServings?.[servings];
        return {
          id: seasoning.id,
          name: t(seasoning.name),
          grams: seasoning.gramsByServings[servings],
          amountLabel: amountLabelKey ? t(amountLabelKey) : undefined,
          note: seasoning.noteByServings?.[servings]
            ? t(seasoning.noteByServings[servings] as string)
            : seasoning.note
              ? t(seasoning.note)
              : undefined,
          nutrition: seasoning.nutrition,
        };
      });
    },
    [potBaseSeasonings, t]
  );

  const buildShoppingEntries = useCallback(
    (plan: Partial<Plan>): ShoppingEntry[] => {
      const servings = plan.servings || 5;
      const totalTargetP = targetPFC.protein * mealShare * servings;
      const totalTargetC = targetPFC.carbs * mealShare * servings;
      const vegPerMeal = goal === 'bulk' ? 200 : goal === 'recomp' ? 250 : 300;
      const totalVegG = vegPerMeal * servings;

      const proteinIds = plan.proteins || [];
      const vegIds = plan.veggies || [];
      const carbId = plan.carb || '';

      const proteinShare = proteinIds.length > 0 ? totalTargetP / 2 : 0;
      const vegShare = vegIds.length > 0 ? totalVegG / 3 : 0;

      const entries: { id: string; grams: number }[] = [];

      proteinIds.forEach((id) => {
        const ing = ingredientById.get(id);
        if (!ing || ing.pPer100g === 0) return;
        const grams = Math.round(proteinShare / (ing.pPer100g / 100));
        entries.push({ id, grams });
      });

      vegIds.forEach((id) => {
        const ing = ingredientById.get(id);
        if (!ing) return;
        const grams = Math.round(vegShare);
        entries.push({ id, grams });
      });

      if (carbId) {
        const ing = ingredientById.get(carbId);
        if (ing && ing.cPer100g !== 0) {
          const grams = Math.round(totalTargetC / (ing.cPer100g / 100));
          entries.push({ id: carbId, grams });
        }
      }

      return entries
        .map(({ id, grams }) => {
          const ing = ingredientById.get(id);
          if (!ing) return null;
          const roundedGrams = Math.round(grams / 10) * 10;
          const units = ing.unitWeight && ing.unitName ? Math.ceil(roundedGrams / ing.unitWeight) : null;
          return {
            id,
            name: t(ing.name),
            category: proteinIds.includes(id) ? 'protein' : vegIds.includes(id) ? 'veg' : 'carb',
            roundedGrams,
            units,
            unitName: ing.unitName ? t(ing.unitName) : undefined,
          } as ShoppingEntry;
        })
        .filter((entry): entry is ShoppingEntry => Boolean(entry));
    },
    [goal, ingredientById, mealShare, t, targetPFC.carbs, targetPFC.protein]
  );

  const calculatePlanTotals = useCallback(
    (plan: Partial<Plan>, overrideTargetPFC?: PFC) => {
      const appliedTargetPFC = overrideTargetPFC ?? targetPFC;
      const servings = plan.servings || 5;
      const totalTargetP = appliedTargetPFC.protein * mealShare * servings;
      const totalTargetC = appliedTargetPFC.carbs * mealShare * servings;
      const vegPerMeal = goal === 'bulk' ? 200 : goal === 'recomp' ? 225 : 250;
      const totalVegG = vegPerMeal * servings;

      const proteinIds = plan.proteins || [];
      const vegIds = plan.veggies || [];
      const carbId = plan.carb || '';

      const proteinShare = proteinIds.length > 0 ? totalTargetP / 2 : 0;
      const vegShare = vegIds.length > 0 ? totalVegG / 3 : 0;

      let totalP = 0;
      let totalF = 0;
      let totalC = 0;
      let totalKcal = 0;

      proteinIds.forEach((id) => {
        const ing = ingredientById.get(id);
        if (!ing || ing.pPer100g === 0) return;
        const grams = proteinShare / (ing.pPer100g / 100);
        totalP += (grams * ing.pPer100g) / 100;
        totalF += (grams * ing.fPer100g) / 100;
        totalC += (grams * ing.cPer100g) / 100;
        totalKcal += (grams * ing.kcalPer100g) / 100;
      });

      vegIds.forEach((id) => {
        const ing = ingredientById.get(id);
        if (!ing) return;
        const grams = vegShare;
        totalP += (grams * ing.pPer100g) / 100;
        totalF += (grams * ing.fPer100g) / 100;
        totalC += (grams * ing.cPer100g) / 100;
        totalKcal += (grams * ing.kcalPer100g) / 100;
      });

      getSeasoningEntries(plan).forEach((seasoning) => {
        const grams = seasoning.grams;
        totalP += (grams * seasoning.nutrition.pPer100g) / 100;
        totalF += (grams * seasoning.nutrition.fPer100g) / 100;
        totalC += (grams * seasoning.nutrition.cPer100g) / 100;
        totalKcal += (grams * seasoning.nutrition.kcalPer100g) / 100;
      });

      if (carbId) {
        const ing = ingredientById.get(carbId);
        if (ing && ing.cPer100g !== 0) {
          const grams = totalTargetC / (ing.cPer100g / 100);
          totalP += (grams * ing.pPer100g) / 100;
          totalF += (grams * ing.fPer100g) / 100;
          totalC += (grams * ing.cPer100g) / 100;
          totalKcal += (grams * ing.kcalPer100g) / 100;
        }
      }
      return { servings, totalP, totalF, totalC, totalKcal };
    },
    [getSeasoningEntries, goal, ingredientById, mealShare, targetPFC]
  );

  const selectedShoppingPlanData = useMemo(() => {
    return perfMeasureSync(
      'shopping.selectedShoppingPlanData',
      () => {
        if (!selectedShoppingPlan) {
          return {
            shoppingEntries: [] as ShoppingEntry[],
            seasoningEntries: [] as SeasoningEntry[],
            proteinEntries: [] as ShoppingEntry[],
            vegEntries: [] as ShoppingEntry[],
            carbEntries: [] as ShoppingEntry[],
          };
        }

        const shoppingEntries = buildShoppingEntries(selectedShoppingPlan);
        const seasoningEntries = getSeasoningEntries(selectedShoppingPlan);
        return {
          shoppingEntries,
          seasoningEntries,
          proteinEntries: shoppingEntries.filter((entry) => entry.category === 'protein'),
          vegEntries: shoppingEntries.filter((entry) => entry.category === 'veg'),
          carbEntries: shoppingEntries.filter((entry) => entry.category === 'carb'),
        };
      },
      {
        hasPlan: Boolean(selectedShoppingPlan),
      }
    );
  }, [buildShoppingEntries, getSeasoningEntries, selectedShoppingPlan]);

  const selectedBalancePlanTotals = useMemo(() => {
    return perfMeasureSync(
      'shopping.selectedBalancePlanTotals',
      () => {
        if (!selectedBalancePlan) return null;
        const planTargetPFC = selectedBalancePlan.targetPFC ?? targetPFC;
        return {
          planTargetPFC,
          totals: calculatePlanTotals(selectedBalancePlan, planTargetPFC),
        };
      },
      {
        hasPlan: Boolean(selectedBalancePlan),
      }
    );
  }, [calculatePlanTotals, selectedBalancePlan, targetPFC]);

  const currentPlanShoppingEntries = useMemo(() => {
    return perfMeasureSync(
      'shopping.currentPlanShoppingEntries',
      () => {
        if (screen !== 'builder' || step !== 6) return [] as ShoppingEntry[];
        return buildShoppingEntries(currentPlan);
      },
      { screen, step }
    );
  }, [buildShoppingEntries, currentPlan, screen, step]);

  const currentPlanSeasoningEntries = useMemo(() => {
    if (screen !== 'builder' || step !== 6) return [] as SeasoningEntry[];
    return getSeasoningEntries(currentPlan);
  }, [currentPlan, getSeasoningEntries, screen, step]);

  const currentPlanTotals = useMemo(() => {
    if (screen !== 'builder' || step !== 6) return null;
    return calculatePlanTotals(currentPlan);
  }, [calculatePlanTotals, currentPlan, screen, step]);

  const shoppingScreenData = useMemo(() => {
    return perfMeasureSync(
      'shopping.shoppingScreenData',
      () => {
        if (screen !== 'shopping') {
          return {
            activePlan: null as Plan | null,
            shoppingEntries: [] as ShoppingEntry[],
            seasoningEntries: [] as SeasoningEntry[],
            proteinEntries: [] as ShoppingEntry[],
            vegEntries: [] as ShoppingEntry[],
            carbEntries: [] as ShoppingEntry[],
          };
        }

        const activePlan = plans[0] ?? null;
        if (!activePlan) {
          return {
            activePlan,
            shoppingEntries: [] as ShoppingEntry[],
            seasoningEntries: [] as SeasoningEntry[],
            proteinEntries: [] as ShoppingEntry[],
            vegEntries: [] as ShoppingEntry[],
            carbEntries: [] as ShoppingEntry[],
          };
        }

        const shoppingEntries = buildShoppingEntries(activePlan);
        const seasoningEntries = getSeasoningEntries(activePlan);
        return {
          activePlan,
          shoppingEntries,
          seasoningEntries,
          proteinEntries: shoppingEntries.filter((entry) => entry.category === 'protein'),
          vegEntries: shoppingEntries.filter((entry) => entry.category === 'veg'),
          carbEntries: shoppingEntries.filter((entry) => entry.category === 'carb'),
        };
      },
      { screen, planCount: plans.length }
    );
  }, [buildShoppingEntries, getSeasoningEntries, plans, screen]);

  return {
    formatUnits,
    selectedShoppingPlan,
    selectedBalancePlan,
    selectedShoppingPlanData,
    selectedBalancePlanTotals,
    currentPlanShoppingEntries,
    currentPlanSeasoningEntries,
    currentPlanTotals,
    shoppingScreenData,
  };
}
