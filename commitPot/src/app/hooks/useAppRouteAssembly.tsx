import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { Plan, UserProfile } from '../../../types';
import { SMALL_BUTTON_HIT_SLOP } from '../../features/common/constants/appUiConfig';
import { parseEffectSections } from '../../features/plan-builder/utils/effectText';
import { styles } from '../../styles/appStyles';
import { useAppRouteProps } from '../../navigation/hooks/useAppRouteProps';
import { AppScreen, SynergySummaryState } from '../../features/common/hooks/useAppFlowState';
import { buildDashboardRoute } from './routeAssembly/buildDashboardRoute';
import { buildBuilderRoute } from './routeAssembly/buildBuilderRoute';
import { createRouteUiAdapters, parseNumericInput } from './routeAssembly/routeUiAdapters';
import { buildOnboardingRoute } from './routeAssembly/buildOnboardingRoute';
import { buildCardsRoute } from './routeAssembly/buildCardsRoute';
import { buildShoppingRoute } from './routeAssembly/buildShoppingRoute';
import { buildCookRoute } from './routeAssembly/buildCookRoute';

type FormatUnitsFn = (
  amount: number | null,
  unit?: string,
  category?: string,
  unitName?: string,
) => string;

export type UseAppRouteAssemblyParams = {
  profile: UserProfile;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  showValidationErrors: boolean;
  setShowValidationErrors: Dispatch<SetStateAction<boolean>>;
  onboardingStep: 1 | 2;
  setOnboardingStep: Dispatch<SetStateAction<1 | 2>>;
  tdee: number;
  targetPFC: Plan['targetPFC'];
  accountDeleting: boolean;
  handleSignOut: () => Promise<void>;
  handleDeleteAccount: () => void;
  handleSaveProfile: () => Promise<void>;
  plans: Plan[];
  isCompactScreen: boolean;
  showPlanShopping: boolean;
  showPlanBalance: boolean;
  showStockCalendar: boolean;
  showCalendarDetail: boolean;
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
  formatUnits: FormatUnitsFn;
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
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  currentPlan: Partial<Plan>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  handleToggleProtein: (id: string) => Promise<void>;
  synergySummary: SynergySummaryState | null;
  localizedSynergyReason: string;
  synergyCardAnimatedStyle: any;
  autoRecommendedVeggies: string[];
  markSynergySummaryAsCustom: () => void;
  setAutoRecommendedVeggies: Dispatch<SetStateAction<string[]>>;
  handleRestoreAiRecommendation: () => void;
  currentPlanTotals: any;
  currentPlanShoppingEntries: any[];
  currentPlanSeasoningEntries: any[];
  skipPlanConfirm: boolean;
  showPlanConfirm: boolean;
  setShowPlanConfirm: Dispatch<SetStateAction<boolean>>;
  handleFinishPlan: () => Promise<void>;
  showFiveServingsModal: boolean;
  setShowFiveServingsModal: Dispatch<SetStateAction<boolean>>;
  skipFiveServingsModal: boolean;
  setSkipFiveServingsModal: Dispatch<SetStateAction<boolean>>;
  setSkipPlanConfirm: Dispatch<SetStateAction<boolean>>;
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
  shoppingScreenData: any;
  setCookStep: Dispatch<SetStateAction<number>>;
  showShoppingIntro: boolean;
  skipShoppingIntro: boolean;
  setShowShoppingIntro: Dispatch<SetStateAction<boolean>>;
  setSkipShoppingIntro: Dispatch<SetStateAction<boolean>>;
  cookStep: number;
  cookScrollRef: React.RefObject<ScrollView | null>;
};

export function useAppRouteAssembly(params: UseAppRouteAssemblyParams) {
  const { ProgressBar, Card, SectionTitle } = useMemo(() => createRouteUiAdapters(styles), []);
  const {
    profile,
    setProfile,
    showValidationErrors,
    setShowValidationErrors,
    onboardingStep,
    setOnboardingStep,
    tdee,
    targetPFC,
    accountDeleting,
    handleSignOut,
    handleDeleteAccount,
    handleSaveProfile,
    plans,
    isCompactScreen,
    showPlanShopping,
    showPlanBalance,
    showStockCalendar,
    showCalendarDetail,
    selectedShoppingPlan,
    selectedShoppingPlanData,
    selectedBalancePlan,
    selectedBalancePlanTotals,
    calendarMonthLabel,
    weekdayLabels,
    calendarCells,
    calendarStats,
    calendarDetailDateKey,
    calendarDetailEntries,
    formatUnits,
    handleOpenOnboarding,
    handleStartBuilder,
    handleOpenCards,
    handleOpenBalance,
    handleDeletePlan,
    handleOpenShopping,
    consumeServing,
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
    step,
    setStep,
    setScreen,
    currentPlan,
    setCurrentPlan,
    handleToggleProtein,
    synergySummary,
    localizedSynergyReason,
    synergyCardAnimatedStyle,
    autoRecommendedVeggies,
    markSynergySummaryAsCustom,
    setAutoRecommendedVeggies,
    handleRestoreAiRecommendation,
    currentPlanTotals,
    currentPlanShoppingEntries,
    currentPlanSeasoningEntries,
    skipPlanConfirm,
    showPlanConfirm,
    setShowPlanConfirm,
    handleFinishPlan,
    showFiveServingsModal,
    setShowFiveServingsModal,
    skipFiveServingsModal,
    setSkipFiveServingsModal,
    setSkipPlanConfirm,
    showAutoVegMiniToast,
    autoVegMiniToastOpacity,
    autoVegMiniToastTranslateY,
    autoVegMiniToastScale,
    showAutoVegHud,
    autoVegHudOpacity,
    autoVegHudTranslateY,
    autoVegHudScale,
    showSynergyIntroHud,
    synergyIntroHudOpacity,
    synergyIntroHudTranslateY,
    synergyIntroHudScale,
    shoppingScreenData,
    setCookStep,
    showShoppingIntro,
    skipShoppingIntro,
    setShowShoppingIntro,
    setSkipShoppingIntro,
    cookStep,
    cookScrollRef,
  } = params;

  const onboardingRoute = useMemo(
    () =>
      buildOnboardingRoute({
        profile,
        setProfile,
        parseNumericInput,
        showValidationErrors,
        setShowValidationErrors,
        onboardingStep,
        setOnboardingStep,
        tdee,
        targetPFC,
        accountDeleting,
        handleSignOut,
        handleDeleteAccount,
        handleSaveProfile,
      }),
    [
      accountDeleting,
      handleDeleteAccount,
      handleSaveProfile,
      handleSignOut,
      onboardingStep,
      profile,
      setOnboardingStep,
      setProfile,
      setShowValidationErrors,
      targetPFC,
      tdee,
      showValidationErrors,
    ],
  );

  const dashboardRoute = useMemo(
    () =>
      buildDashboardRoute(
        {
          plans,
          isCompactScreen,
          showPlanShopping,
          showPlanBalance,
          showStockCalendar,
          showCalendarDetail,
          selectedShoppingPlan,
          selectedShoppingPlanData,
          selectedBalancePlan,
          selectedBalancePlanTotals,
          calendarMonthLabel,
          weekdayLabels,
          calendarCells,
          calendarStats,
          calendarDetailDateKey,
          calendarDetailEntries,
          formatUnits,
          handleOpenOnboarding,
          handleStartBuilder,
          handleOpenCards,
          handleOpenBalance,
          handleDeletePlan,
          handleOpenShopping,
          consumeServing,
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
        },
        { Card, SectionTitle },
      ),
    [
      Card,
      SectionTitle,
      calendarCells,
      calendarDetailDateKey,
      calendarDetailEntries,
      calendarMonthLabel,
      calendarStats,
      consumeServing,
      formatUnits,
      handleCloseCalendarDetail,
      handleClosePlanBalance,
      handleClosePlanShopping,
      handleCloseStockCalendar,
      handleDeletePlan,
      handleGoShopping,
      handleGoStats,
      handleNextCalendarMonth,
      handleOpenBalance,
      handleOpenCalendar,
      handleOpenCalendarDetail,
      handleOpenCards,
      handleOpenOnboarding,
      handleOpenShopping,
      handlePrevCalendarMonth,
      handleStartBuilder,
      isCompactScreen,
      plans,
      selectedBalancePlan,
      selectedBalancePlanTotals,
      selectedShoppingPlan,
      selectedShoppingPlanData,
      showCalendarDetail,
      showPlanBalance,
      showPlanShopping,
      showStockCalendar,
      weekdayLabels,
    ],
  );

  const builderRoute = useMemo(
    () =>
      buildBuilderRoute(
        {
          step,
          setStep,
          setScreen,
          currentPlan,
          setCurrentPlan,
          handleToggleProtein,
          synergySummary,
          localizedSynergyReason,
          synergyCardAnimatedStyle,
          autoRecommendedVeggies,
          markSynergySummaryAsCustom,
          setAutoRecommendedVeggies,
          handleRestoreAiRecommendation,
          currentPlanTotals,
          currentPlanShoppingEntries,
          currentPlanSeasoningEntries,
          skipPlanConfirm,
          showPlanConfirm,
          setShowPlanConfirm,
          handleFinishPlan,
          showFiveServingsModal,
          setShowFiveServingsModal,
          skipFiveServingsModal,
          setSkipFiveServingsModal,
          setSkipPlanConfirm,
          showAutoVegMiniToast,
          autoVegMiniToastOpacity,
          autoVegMiniToastTranslateY,
          autoVegMiniToastScale,
          showAutoVegHud,
          autoVegHudOpacity,
          autoVegHudTranslateY,
          autoVegHudScale,
          showSynergyIntroHud,
          synergyIntroHudOpacity,
          synergyIntroHudTranslateY,
          synergyIntroHudScale,
          targetPFC,
          isCompactScreen,
          formatUnits,
        },
        { ProgressBar, SectionTitle, Card },
      ),
    [
      Card,
      ProgressBar,
      SectionTitle,
      autoRecommendedVeggies,
      autoVegHudOpacity,
      autoVegHudScale,
      autoVegHudTranslateY,
      autoVegMiniToastOpacity,
      autoVegMiniToastScale,
      autoVegMiniToastTranslateY,
      currentPlan,
      currentPlanSeasoningEntries,
      currentPlanShoppingEntries,
      currentPlanTotals,
      formatUnits,
      handleFinishPlan,
      handleRestoreAiRecommendation,
      handleToggleProtein,
      isCompactScreen,
      localizedSynergyReason,
      markSynergySummaryAsCustom,
      setAutoRecommendedVeggies,
      setCurrentPlan,
      setScreen,
      setShowFiveServingsModal,
      setShowPlanConfirm,
      setSkipFiveServingsModal,
      setSkipPlanConfirm,
      setStep,
      showAutoVegHud,
      showAutoVegMiniToast,
      showFiveServingsModal,
      showPlanConfirm,
      showSynergyIntroHud,
      skipFiveServingsModal,
      skipPlanConfirm,
      step,
      synergyCardAnimatedStyle,
      synergyIntroHudOpacity,
      synergyIntroHudScale,
      synergyIntroHudTranslateY,
      synergySummary,
      targetPFC,
    ],
  );

  const cardsRoute = useMemo(
    () =>
      buildCardsRoute({
        setScreen,
        smallButtonHitSlop: SMALL_BUTTON_HIT_SLOP,
        Card,
        parseEffectSections,
      }),
    [Card, setScreen],
  );

  const shoppingRoute = useMemo(
    () =>
      buildShoppingRoute({
        plans,
        shoppingScreenData,
        smallButtonHitSlop: SMALL_BUTTON_HIT_SLOP,
        isCompactScreen,
        SectionTitle,
        formatUnits,
        setScreen,
        setCookStep,
        showShoppingIntro,
        skipShoppingIntro,
        setShowShoppingIntro,
        setSkipShoppingIntro,
      }),
    [
      SectionTitle,
      formatUnits,
      isCompactScreen,
      plans,
      setCookStep,
      setScreen,
      setShowShoppingIntro,
      setSkipShoppingIntro,
      shoppingScreenData,
      showShoppingIntro,
      skipShoppingIntro,
    ],
  );

  const cookRoute = useMemo(
    () =>
      buildCookRoute({
        cookStep,
        setCookStep,
        setScreen,
        cookScrollRef,
        smallButtonHitSlop: SMALL_BUTTON_HIT_SLOP,
        Card,
        ProgressBar,
      }),
    [Card, ProgressBar, cookScrollRef, cookStep, setCookStep, setScreen],
  );

  return useAppRouteProps({
    onboarding: onboardingRoute,
    dashboard: dashboardRoute,
    builder: builderRoute,
    cards: cardsRoute,
    shopping: shoppingRoute,
    cook: cookRoute,
  });
}
