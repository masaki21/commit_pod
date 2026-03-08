import { PFC, UserProfile } from '../../../../types';

export const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  let bmr = 10 * weight + 6.25 * height - 5 * age;

  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    // Sex-neutral fallback when gender is not provided.
    bmr -= 78;
  }

  return Math.round(bmr);
};

export const calculateTDEE = (profile: UserProfile): number => {
  const bmr = calculateBMR(profile);
  const factors = { low: 1.2, normal: 1.55, high: 1.725 };
  return Math.round(bmr * factors[profile.activityLevel]);
};

export const calculateTargetPFC = (profile: UserProfile, tdee: number): PFC => {
  const multipliers = { bulk: 1.1, recomp: 1.0, cut: 0.88 };
  let targetCalories = Math.round(tdee * multipliers[profile.goal]);
  const pFactor = profile.goal === 'bulk' ? 2.2 : 2.3;
  const fFactor = profile.goal === 'bulk' ? 0.95 : profile.goal === 'recomp' ? 1.8 : 2.0;
  const protein = Math.round(profile.weight * pFactor);
  const baseFat = Math.round(profile.weight * fFactor);

  const minFat = 60;
  const minCarbs = 50;

  let fat = baseFat;
  let carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);

  const applyMinimumOrder = () => {
    if (fat < minFat) {
      fat = minFat;
      carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);
    }
    if (carbs < minCarbs) {
      carbs = minCarbs;
      fat = Math.round((targetCalories - protein * 4 - carbs * 4) / 9);
    }
  };

  applyMinimumOrder();

  if (fat < minFat || carbs < minCarbs) {
    const minCalories = protein * 4 + minFat * 9 + minCarbs * 4;
    if (targetCalories < minCalories) {
      targetCalories = Math.ceil(minCalories);
    }
    fat = baseFat;
    carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);
    applyMinimumOrder();
  }

  return { protein, fat, carbs, calories: targetCalories };
};
