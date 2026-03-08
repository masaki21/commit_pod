import { PotBase } from '../../../../types';

export const POT_BASE_IMAGES: Record<PotBase, import('react-native').ImageSourcePropType> = {
  miso: require('../../../../assets/nabe_base/miso.jpg'),
  kimchi: require('../../../../assets/nabe_base/kimchi.jpg'),
  yose: require('../../../../assets/nabe_base/yose.jpg'),
};

export const FIVE_SERVINGS_POT_IMAGE = require('../../../../assets/nabe_base/five_servings_pot.jpg');

export const SMALL_BUTTON_HIT_SLOP = { top: 12, right: 12, bottom: 12, left: 12 } as const;
export const CARD_BUTTON_HIT_SLOP = { top: 10, right: 10, bottom: 10, left: 10 } as const;
export const CARD_PRESS_RETENTION = { top: 16, right: 16, bottom: 16, left: 16 } as const;

export const MEAL_SHARE = 0.3; // 1食 = 1日の10分の3

export const PROFILE_LIMITS = {
  height: { min: 120, max: 250 },
  weight: { min: 30, max: 230 },
  age: { min: 12, max: 100 },
} as const;
