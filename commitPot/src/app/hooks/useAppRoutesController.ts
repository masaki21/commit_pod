import React from 'react';
import { ScrollView } from 'react-native';
import { Plan, UserProfile } from '../../../types';
import { AppScreen, SynergySummaryState } from '../../features/common/hooks/useAppFlowState';
import { useAppRouteAssembly } from './useAppRouteAssembly';

type RouteCoreSection = {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  showValidationErrors: boolean;
  setShowValidationErrors: React.Dispatch<React.SetStateAction<boolean>>;
  onboardingStep: 1 | 2;
  setOnboardingStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  tdee: number;
  targetPFC: Plan['targetPFC'];
  accountDeleting: boolean;
  plans: Plan[];
  isCompactScreen: boolean;
  showPlanShopping: boolean;
  showPlanBalance: boolean;
  showStockCalendar: boolean;
  showCalendarDetail: boolean;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  currentPlan: Partial<Plan>;
  setCurrentPlan: React.Dispatch<React.SetStateAction<Partial<Plan>>>;
  skipPlanConfirm: boolean;
  showPlanConfirm: boolean;
  setShowPlanConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showFiveServingsModal: boolean;
  setShowFiveServingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  skipFiveServingsModal: boolean;
  setSkipFiveServingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSkipPlanConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  showShoppingIntro: boolean;
  skipShoppingIntro: boolean;
  setShowShoppingIntro: React.Dispatch<React.SetStateAction<boolean>>;
  setSkipShoppingIntro: React.Dispatch<React.SetStateAction<boolean>>;
  cookStep: number;
  setCookStep: React.Dispatch<React.SetStateAction<number>>;
  cookScrollRef: React.RefObject<ScrollView | null>;
};

type RouteAuthSection = {
  handleSignOut: () => Promise<void>;
  handleDeleteAccount: () => void;
  handleSaveProfile: () => Promise<void>;
};

type RouteDashboardSection = {
  selectedShoppingPlan: Plan | null;
  selectedShoppingPlanData: any;
  selectedBalancePlan: Plan | null;
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

type RouteBuilderSection = {
  handleToggleProtein: (id: string) => Promise<void>;
  synergySummary: SynergySummaryState | null;
  localizedSynergyReason: string;
  synergyCardAnimatedStyle: any;
  autoRecommendedVeggies: string[];
  markSynergySummaryAsCustom: () => void;
  setAutoRecommendedVeggies: React.Dispatch<React.SetStateAction<string[]>>;
  handleRestoreAiRecommendation: () => void;
  currentPlanTotals: any;
  currentPlanShoppingEntries: any[];
  currentPlanSeasoningEntries: any[];
  handleFinishPlan: () => Promise<void>;
  showAutoVegMiniToast: boolean;
  autoVegMiniToastOpacity: any;
  autoVegMiniToastTranslateY: any;
  autoVegMiniToastScale: any;
  showAutoVegHud: boolean;
  autoVegHudOpacity: any;
  autoVegHudTranslateY: any;
  autoVegHudScale: any;
  showSynergyIntroHud: boolean;
  synergyIntroHudOpacity: any;
  synergyIntroHudTranslateY: any;
  synergyIntroHudScale: any;
};

type RouteShoppingSection = {
  shoppingScreenData: any;
};

type UseAppRoutesControllerParams = {
  core: RouteCoreSection;
  auth: RouteAuthSection;
  dashboard: RouteDashboardSection;
  builder: RouteBuilderSection;
  shopping: RouteShoppingSection;
};

export function useAppRoutesController(params: UseAppRoutesControllerParams) {
  const { core, auth, dashboard, builder, shopping } = params;

  return useAppRouteAssembly({
    ...core,
    ...auth,
    ...dashboard,
    ...builder,
    ...shopping,
  });
}
