import React from 'react';
import {
  CARD_BUTTON_HIT_SLOP,
  CARD_PRESS_RETENTION,
  MEAL_SHARE,
  POT_BASE_IMAGES,
  SMALL_BUTTON_HIT_SLOP,
} from '../../../features/common/constants/appUiConfig';

type BuildDashboardRouteParams = {
  plans: any;
  isCompactScreen: boolean;
  showPlanShopping: boolean;
  showPlanBalance: boolean;
  showStockCalendar: boolean;
  showCalendarDetail: boolean;
  selectedShoppingPlan: any;
  selectedShoppingPlanData: any;
  selectedBalancePlan: any;
  selectedBalancePlanTotals: any;
  calendarMonthLabel: string;
  weekdayLabels: string[];
  calendarCells: any[];
  calendarStats: any;
  calendarDetailDateKey: string | null;
  calendarDetailEntries: any[];
  formatUnits: (...args: any[]) => string;
  handleOpenOnboarding: () => void;
  handleStartBuilder: () => void;
  handleOpenCards: () => void;
  handleOpenBalance: (id: string) => void;
  handleDeletePlan: (id: string) => Promise<void>;
  handleOpenShopping: (id: string) => void;
  consumeServing: (id: string) => Promise<void>;
  handleOpenCalendar: () => void;
  handleGoShopping: () => void;
  handleGoStats: () => void;
  handleClosePlanShopping: () => void;
  handleClosePlanBalance: () => void;
  handleCloseStockCalendar: () => void;
  handlePrevCalendarMonth: () => void;
  handleNextCalendarMonth: () => void;
  handleOpenCalendarDetail: (dateKey: string) => void;
  handleCloseCalendarDetail: () => void;
};

type DashboardUiAdapters = {
  Card: ({ children, style }: { children: React.ReactNode; style?: object }) => React.ReactElement;
  SectionTitle: ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => React.ReactElement;
};

export function buildDashboardRoute(params: BuildDashboardRouteParams, ui: DashboardUiAdapters) {
  return {
    plans: params.plans,
    potBaseImages: POT_BASE_IMAGES,
    smallButtonHitSlop: SMALL_BUTTON_HIT_SLOP,
    cardButtonHitSlop: CARD_BUTTON_HIT_SLOP,
    cardPressRetention: CARD_PRESS_RETENTION,
    isCompactScreen: params.isCompactScreen,
    mealShare: MEAL_SHARE,
    showPlanShopping: params.showPlanShopping,
    showPlanBalance: params.showPlanBalance,
    showStockCalendar: params.showStockCalendar,
    showCalendarDetail: params.showCalendarDetail,
    selectedShoppingPlan: params.selectedShoppingPlan,
    selectedShoppingPlanData: params.selectedShoppingPlanData,
    selectedBalancePlan: params.selectedBalancePlan,
    selectedBalancePlanTotals: params.selectedBalancePlanTotals,
    calendarMonthLabel: params.calendarMonthLabel,
    weekdayLabels: params.weekdayLabels,
    calendarCells: params.calendarCells,
    calendarStats: params.calendarStats,
    calendarDetailDateKey: params.calendarDetailDateKey,
    calendarDetailEntries: params.calendarDetailEntries,
    Card: ui.Card,
    SectionTitle: ui.SectionTitle,
    formatUnits: params.formatUnits,
    handleOpenOnboarding: params.handleOpenOnboarding,
    handleStartBuilder: params.handleStartBuilder,
    handleOpenCards: params.handleOpenCards,
    handleOpenBalance: params.handleOpenBalance,
    handleDeletePlan: params.handleDeletePlan,
    handleOpenShopping: params.handleOpenShopping,
    consumeServing: params.consumeServing,
    handleOpenCalendar: params.handleOpenCalendar,
    handleGoShopping: params.handleGoShopping,
    handleGoStats: params.handleGoStats,
    handleClosePlanShopping: params.handleClosePlanShopping,
    handleClosePlanBalance: params.handleClosePlanBalance,
    handleCloseStockCalendar: params.handleCloseStockCalendar,
    handlePrevCalendarMonth: params.handlePrevCalendarMonth,
    handleNextCalendarMonth: params.handleNextCalendarMonth,
    handleOpenCalendarDetail: params.handleOpenCalendarDetail,
    handleCloseCalendarDetail: params.handleCloseCalendarDetail,
  };
}
