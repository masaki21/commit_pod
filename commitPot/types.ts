
export type Gender = 'male' | 'female';
export type ActivityLevel = 'low' | 'normal' | 'high';
export type Goal = 'bulk' | 'recomp' | 'cut';

export interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: Gender | null;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface PFC {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

export type PotBase = 'yose' | 'miso' | 'kimchi';

export interface Ingredient {
  id: string;
  name: string;
  category: 'protein' | 'veg' | 'carb' | 'seasoning';
  pPer100g: number;
  fPer100g: number;
  cPer100g: number;
  kcalPer100g: number;
  effect: string;
  photo: import('react-native').ImageSourcePropType;
  photoSmall?: import('react-native').ImageSourcePropType;
  unitWeight?: number; // e.g., 200g per pack
  unitName?: string; // e.g., "パック"
}

export interface Plan {
  id: string;
  servings: 2 | 5;
  remaining: number;
  potBase: PotBase;
  proteins: string[];
  veggies: string[];
  carb: string;
  createdAt: string;
  targetPFC: PFC;
}
