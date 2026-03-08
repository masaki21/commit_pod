import { Plan } from '../../../types';
import { useShoppingData } from '../../features/shopping/hooks/useShoppingData';
import { MEAL_SHARE } from '../../features/common/constants/appUiConfig';
import { INGREDIENT_BY_ID, POT_BASE_SEASONINGS } from '../../features/shopping/constants/seasonings';

type UseAppPlanDataControllerParams = {
  plans: Plan[];
  shoppingPlanId: string | null;
  balancePlanId: string | null;
  screen: string;
  step: number;
  currentPlan: Partial<Plan>;
  targetPFC: Plan['targetPFC'];
  goal: string;
  t: (key: string, options?: Record<string, any>) => string;
};

export function useAppPlanDataController(params: UseAppPlanDataControllerParams) {
  return useShoppingData({
    plans: params.plans,
    shoppingPlanId: params.shoppingPlanId,
    balancePlanId: params.balancePlanId,
    screen: params.screen,
    step: params.step,
    currentPlan: params.currentPlan,
    targetPFC: params.targetPFC,
    goal: params.goal,
    t: params.t,
    mealShare: MEAL_SHARE,
    ingredientById: INGREDIENT_BY_ID,
    potBaseSeasonings: POT_BASE_SEASONINGS,
  });
}
