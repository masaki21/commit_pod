import { useMemo } from 'react';
import { UserProfile } from '../../../types';
import { calculateTargetPFC, calculateTDEE } from '../../features/onboarding/utils/nutritionTargets';

export function useAppNutritionTargets(profile: UserProfile) {
  const tdee = useMemo(() => calculateTDEE(profile), [profile]);
  const targetPFC = useMemo(() => calculateTargetPFC(profile, tdee), [profile, tdee]);

  return { tdee, targetPFC };
}
