import { Dispatch, SetStateAction } from 'react';
import { Session } from '@supabase/supabase-js';
import { Plan, UserProfile } from '../../../types';
import {
  dateKeyFromIso,
  formatDateKey,
  useDashboardCalendar,
} from '../../features/dashboard/hooks/useDashboardCalendar';
import { useDashboardNavigation } from '../../features/dashboard/hooks/useDashboardNavigation';
import { usePlanLifecycle } from '../../features/dashboard/hooks/usePlanLifecycle';
import { useCalendarDetailEntries } from '../../features/dashboard/hooks/useCalendarDetailEntries';
import { AppScreen, PotHistoryEntry } from '../../features/common/hooks/useAppFlowState';

type Translate = (key: string, options?: Record<string, unknown>) => string;

type UseAppDashboardControllerParams = {
  language: string;
  calendarMonthOffset: number;
  potHistories: Record<string, PotHistoryEntry>;
  calendarDetailDateKey: string | null;
  session: Session | null;
  plans: Plan[];
  currentPlan: Partial<Plan>;
  targetPFC: Plan['targetPFC'];
  setPlans: Dispatch<SetStateAction<Plan[]>>;
  setPotHistories: Dispatch<SetStateAction<Record<string, PotHistoryEntry>>>;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  t: Translate;
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

export function useAppDashboardController({
  language,
  calendarMonthOffset,
  potHistories,
  calendarDetailDateKey,
  session,
  plans,
  currentPlan,
  targetPFC,
  setPlans,
  setPotHistories,
  setScreen,
  t,
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
}: UseAppDashboardControllerParams) {
  const { weekdayLabels, calendarMonthLabel, calendarStats, calendarCells } = useDashboardCalendar({
    language,
    calendarMonthOffset,
    potHistories,
  });

  const calendarDetailEntries = useCalendarDetailEntries({
    calendarDetailDateKey,
    potHistories,
  });

  const { handleFinishPlan, consumeServing, handleDeletePlan } = usePlanLifecycle({
    session,
    plans,
    currentPlan,
    targetPFC,
    setPlans,
    setPotHistories,
    setScreen,
    t,
    dateKeyFromIso,
    formatDateKey,
  });

  const {
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
  } = useDashboardNavigation({
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
  });

  return {
    weekdayLabels,
    calendarMonthLabel,
    calendarStats,
    calendarCells,
    calendarDetailEntries,
    handleFinishPlan,
    consumeServing,
    handleDeletePlan,
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
}
