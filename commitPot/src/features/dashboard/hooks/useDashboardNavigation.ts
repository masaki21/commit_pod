import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Plan } from '../../../../types';
import { perfTap } from '../../common/utils/perfLogger';

type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';

type Params = {
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  setStep: Dispatch<SetStateAction<number>>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  setOnboardingStep: Dispatch<SetStateAction<1 | 2>>;
  setBalancePlanId: Dispatch<SetStateAction<string | null>>;
  setShowPlanBalance: Dispatch<SetStateAction<boolean>>;
  setShoppingPlanId: Dispatch<SetStateAction<string | null>>;
  setShowPlanShopping: Dispatch<SetStateAction<boolean>>;
  setShowStockCalendar: Dispatch<SetStateAction<boolean>>;
  setCalendarMonthOffset: Dispatch<SetStateAction<number>>;
  setCalendarDetailDateKey: Dispatch<SetStateAction<string | null>>;
  setShowCalendarDetail: Dispatch<SetStateAction<boolean>>;
};

export const useDashboardNavigation = ({
  setScreen,
  setStep,
  setCurrentPlan,
  setOnboardingStep,
  setBalancePlanId,
  setShowPlanBalance,
  setShoppingPlanId,
  setShowPlanShopping,
  setShowStockCalendar,
  setCalendarMonthOffset,
  setCalendarDetailDateKey,
  setShowCalendarDetail,
}: Params) => {
  const handleOpenOnboarding = useCallback(() => {
    perfTap('dashboard.openOnboarding');
    setOnboardingStep(1);
    setScreen('onboarding');
  }, [setOnboardingStep, setScreen]);

  const handleStartBuilder = useCallback(() => {
    perfTap('dashboard.startBuilder');
    setStep(1);
    setCurrentPlan({ servings: 5, potBase: 'yose', proteins: [], veggies: [], carb: '' });
    setScreen('builder');
  }, [setCurrentPlan, setScreen, setStep]);

  const handleOpenCards = useCallback(() => {
    perfTap('dashboard.openCards');
    setScreen('cards');
  }, [setScreen]);

  const handleOpenBalance = useCallback(
    (planId: string) => {
      perfTap('dashboard.openBalance', { planId });
      setBalancePlanId(planId);
      setShowPlanBalance(true);
    },
    [setBalancePlanId, setShowPlanBalance]
  );

  const handleOpenShopping = useCallback(
    (planId: string) => {
      perfTap('dashboard.openPlanShopping', { planId });
      setShoppingPlanId(planId);
      setShowPlanShopping(true);
    },
    [setShoppingPlanId, setShowPlanShopping]
  );

  const handleOpenCalendar = useCallback(() => {
    perfTap('dashboard.openCalendar');
    setShowStockCalendar(true);
  }, [setShowStockCalendar]);

  const handleGoShopping = useCallback(() => {
    perfTap('dashboard.goShopping');
    setScreen('shopping');
  }, [setScreen]);

  const handleGoStats = useCallback(() => {
    perfTap('dashboard.goStats');
    setOnboardingStep(1);
    setScreen('onboarding');
  }, [setOnboardingStep, setScreen]);

  const handleClosePlanShopping = useCallback(() => {
    perfTap('dashboard.closePlanShopping');
    setShowPlanShopping(false);
  }, [setShowPlanShopping]);

  const handleClosePlanBalance = useCallback(() => {
    perfTap('dashboard.closePlanBalance');
    setShowPlanBalance(false);
  }, [setShowPlanBalance]);

  const handleCloseStockCalendar = useCallback(() => {
    perfTap('dashboard.closeStockCalendar');
    setShowStockCalendar(false);
  }, [setShowStockCalendar]);

  const handlePrevCalendarMonth = useCallback(() => {
    perfTap('dashboard.prevCalendarMonth');
    setCalendarMonthOffset((prev) => prev - 1);
  }, [setCalendarMonthOffset]);

  const handleNextCalendarMonth = useCallback(() => {
    perfTap('dashboard.nextCalendarMonth');
    setCalendarMonthOffset((prev) => prev + 1);
  }, [setCalendarMonthOffset]);

  const handleOpenCalendarDetail = useCallback(
    (dateKey: string) => {
      perfTap('dashboard.openCalendarDetail', { dateKey });
      // Avoid opening two RN Modals at once on iOS; close the calendar modal first.
      setShowStockCalendar(false);
      setCalendarDetailDateKey(dateKey);
      setShowCalendarDetail(true);
    },
    [setCalendarDetailDateKey, setShowCalendarDetail, setShowStockCalendar]
  );

  const handleCloseCalendarDetail = useCallback(() => {
    perfTap('dashboard.closeCalendarDetail');
    setShowCalendarDetail(false);
  }, [setShowCalendarDetail]);

  return {
    handleOpenOnboarding,
    handleStartBuilder,
    handleOpenCards,
    handleOpenBalance,
    handleOpenShopping,
    handleOpenCalendar,
    handleGoShopping,
    handleGoStats,
    handleClosePlanShopping,
    handleClosePlanBalance,
    handleCloseStockCalendar,
    handlePrevCalendarMonth,
    handleNextCalendarMonth,
    handleOpenCalendarDetail,
    handleCloseCalendarDetail,
  };
};
