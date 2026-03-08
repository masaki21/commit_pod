import { INGREDIENTS } from '../../../../constants';
import { PotBase } from '../../../../types';

type IngredientCategory = 'protein' | 'veg' | 'carb';

export const POT_BASE_INGREDIENT_IDS: Partial<Record<PotBase, Record<IngredientCategory, string[]>>> = {
  miso: {
    protein: ['p1', 'p2', 'p6', 'p4', 'p7'],
    veg: ['v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10', 'v14', 'v15', 'v16', 'v17'],
    carb: ['c3', 'c4', 'c5'],
  },
  kimchi: {
    protein: ['p1', 'p8', 'p9', 'p4', 'p7'],
    veg: ['v1', 'v5', 'v11', 'v7', 'v8', 'v3', 'v10', 'v14', 'v15', 'v16', 'v17'],
    carb: ['c3', 'c6', 'c7'],
  },
  yose: {
    protein: ['p1', 'p10', 'p3', 'p2', 'p4'],
    veg: ['v1', 'v12', 'v11', 'v13', 'v8', 'v3', 'v9', 'v14', 'v15', 'v16', 'v17'],
    carb: ['c3', 'c2', 'c5'],
  },
};

export const MUSHROOM_IDS = new Set(['v3', 'v9', 'v10', 'v16', 'v17']);

export const getIngredientsForPotBase = (potBase: PotBase, category: IngredientCategory) => {
  const allowed = POT_BASE_INGREDIENT_IDS[potBase]?.[category];
  return INGREDIENTS.filter(
    (ingredient) => ingredient.category === category && (!allowed || allowed.includes(ingredient.id))
  );
};

export const normalizePlanForPotBase = (
  plan: { proteins: string[]; veggies: string[]; carb: string },
  potBase: PotBase
) => {
  const allowedProtein = POT_BASE_INGREDIENT_IDS[potBase]?.protein;
  const allowedVeg = POT_BASE_INGREDIENT_IDS[potBase]?.veg;
  const allowedCarb = POT_BASE_INGREDIENT_IDS[potBase]?.carb;

  return {
    proteins: allowedProtein ? plan.proteins.filter((id) => allowedProtein.includes(id)) : plan.proteins,
    veggies: allowedVeg ? plan.veggies.filter((id) => allowedVeg.includes(id)) : plan.veggies,
    carb: allowedCarb && plan.carb && !allowedCarb.includes(plan.carb) ? '' : plan.carb,
  };
};
