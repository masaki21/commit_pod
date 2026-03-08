import { INGREDIENTS } from '../../../../constants';
import { PotBase } from '../../../../types';

type ServingCount = 2 | 5;

type NutritionPer100g = {
  kcalPer100g: number;
  pPer100g: number;
  fPer100g: number;
  cPer100g: number;
};

type SeasoningDefinition = {
  id: string;
  name: string;
  gramsByServings: Record<ServingCount, number>;
  nutrition: NutritionPer100g;
  note?: string;
  noteByServings?: Partial<Record<ServingCount, string>>;
  amountLabelByServings?: Partial<Record<ServingCount, string>>;
};

const SHIMAYA_POWDER_NUTRITION: NutritionPer100g = {
  kcalPer100g: 205,
  pPer100g: 14.25,
  fPer100g: 0.125,
  cPer100g: 36.875,
};

export const POT_BASE_SEASONINGS: Record<PotBase, SeasoningDefinition[]> = {
  miso: [
    {
      id: 's_miso',
      name: 'seasonings.miso_mix',
      gramsByServings: { 2: 70, 5: 175 },
      nutrition: { kcalPer100g: 194, pPer100g: 10.8, fPer100g: 4.1, cPer100g: 27.1 },
      noteByServings: {
        2: 'seasonings.note_miso_2',
        5: 'seasonings.note_miso_5',
      },
    },
    {
      id: 's_chicken',
      name: 'seasonings.chicken_stock',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_chicken_2',
        5: 'seasonings.note_chicken_5',
      },
    },
    {
      id: 's_ginger',
      name: 'seasonings.ginger_tube',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_ginger_2',
        5: 'seasonings.note_ginger_5',
      },
    },
  ],
  kimchi: [
    {
      id: 's_kimchi_soup',
      name: 'seasonings.shimaya_kimchi',
      gramsByServings: { 2: 20, 5: 50 },
      nutrition: SHIMAYA_POWDER_NUTRITION,
      amountLabelByServings: {
        2: 'seasonings.amount_label_2',
        5: 'seasonings.amount_label_5',
      },
      noteByServings: {
        2: 'seasonings.note_nabe_2',
        5: 'seasonings.note_nabe_5',
      },
    },
    {
      id: 's_chicken',
      name: 'seasonings.chicken_stock',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_chicken_2',
        5: 'seasonings.note_chicken_5',
      },
    },
  ],
  yose: [
    {
      id: 's_yose_soup',
      name: 'seasonings.shimaya_yose',
      gramsByServings: { 2: 20, 5: 50 },
      nutrition: SHIMAYA_POWDER_NUTRITION,
      amountLabelByServings: {
        2: 'seasonings.amount_label_2',
        5: 'seasonings.amount_label_5',
      },
      noteByServings: {
        2: 'seasonings.note_nabe_2',
        5: 'seasonings.note_nabe_5',
      },
    },
    {
      id: 's_chicken',
      name: 'seasonings.chicken_stock',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_chicken_2',
        5: 'seasonings.note_chicken_5',
      },
    },
  ],
};

export const INGREDIENT_BY_ID = new Map(INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]));
