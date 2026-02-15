import { supabase } from '../../../supabase';
import { PotBase } from '../../../types';

type GetAlternativeIngredientSuggestionInput = {
  potBase: PotBase;
  proteinId: string;
  ingredientId: string;
  candidateVeggieIds: string[];
  selectedVeggieIds: string[];
};

type AlternativeSuggestion = {
  alternativeId: string;
  nutritionCategory: string;
  note?: string;
};

type SynergyMatrixCategoryRow = {
  nutrition_category: string;
  is_active: boolean;
  priority: number;
};

type SynergyAlternativeRow = {
  alternative_ids: string[];
  note: string | null;
  is_active: boolean;
};

export const getAlternativeIngredientSuggestion = async (
  input: GetAlternativeIngredientSuggestionInput
): Promise<AlternativeSuggestion | null> => {
  const { data: matrixData, error: matrixError } = await supabase
    .from('synergy_matrix')
    .select('nutrition_category, is_active, priority')
    .eq('pot_base', input.potBase)
    .eq('protein_id', input.proteinId)
    .eq('is_active', true)
    .order('priority', { ascending: true })
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle<SynergyMatrixCategoryRow>();

  if (matrixError || !matrixData?.nutrition_category) {
    return null;
  }

  const { data: alternativeData, error: alternativeError } = await supabase
    .from('synergy_alternatives')
    .select('alternative_ids, note, is_active')
    .eq('ingredient_id', input.ingredientId)
    .eq('nutrition_category', matrixData.nutrition_category)
    .eq('is_active', true)
    .maybeSingle<SynergyAlternativeRow>();

  const selectedSet = new Set(
    input.selectedVeggieIds.filter((id) => id !== input.ingredientId)
  );

  const dbAlternatives =
    alternativeError || !alternativeData?.alternative_ids?.length
      ? []
      : alternativeData.alternative_ids.filter((id) => input.candidateVeggieIds.includes(id));
  const fallbackAlternatives = input.candidateVeggieIds.filter(
    (id) => id !== input.ingredientId && !selectedSet.has(id)
  );
  const candidateAlternatives = [...new Set([...dbAlternatives, ...fallbackAlternatives])];

  const nextAlternativeId = candidateAlternatives.find((id) => !selectedSet.has(id));

  if (!nextAlternativeId) {
    return null;
  }

  return {
    alternativeId: nextAlternativeId,
    nutritionCategory: matrixData.nutrition_category,
    note: alternativeData?.note || undefined,
  };
};
