import type React from 'react';
import {
  AppScreen,
  OnboardingRouteProps,
  DashboardRouteProps,
  BuilderRouteProps,
  CardsRouteProps,
  ShoppingRouteProps,
  CookRouteProps,
} from './routeTypes';

export type AppScreenRouterGroups = {
  onboarding: OnboardingRouteProps;
  dashboard: DashboardRouteProps;
  builder: BuilderRouteProps;
  cards: CardsRouteProps;
  shopping: ShoppingRouteProps;
  cook: CookRouteProps;
};

export type BuildAppScreenRouterParams = {
  onboarding: Omit<OnboardingRouteProps, 'onSignOut' | 'onDeleteAccount' | 'onSaveProfile'> & {
    handleSignOut: () => Promise<void>;
    handleDeleteAccount: () => void;
    handleSaveProfile: () => Promise<void>;
  };
  dashboard: Omit<
    DashboardRouteProps,
    | 'onOpenOnboarding'
    | 'onStartBuilder'
    | 'onOpenCards'
    | 'onOpenBalance'
    | 'onDeletePlan'
    | 'onOpenShopping'
    | 'onConsumeServing'
    | 'onOpenCalendar'
    | 'onGoShopping'
    | 'onGoStats'
    | 'onClosePlanShopping'
    | 'onClosePlanBalance'
    | 'onCloseStockCalendar'
    | 'onPrevCalendarMonth'
    | 'onNextCalendarMonth'
    | 'onOpenCalendarDetail'
    | 'onCloseCalendarDetail'
  > & {
    handleOpenOnboarding: () => void;
    handleStartBuilder: () => void;
    handleOpenCards: () => void;
    handleOpenBalance: (planId: string) => void;
    handleDeletePlan: (planId: string) => void;
    handleOpenShopping: (planId: string) => void;
    consumeServing: (planId: string) => void;
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
  builder: Omit<
    BuilderRouteProps,
    | 'onToggleProtein'
    | 'onMarkCustom'
    | 'onSetAutoRecommendedVeggies'
    | 'onRestoreAiRecommendation'
    | 'onFinishPlan'
    | 'setScreen'
  > & {
    setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
    handleToggleProtein: (id: string) => Promise<void>;
    markSynergySummaryAsCustom: (options?: { skipEvent?: boolean }) => void;
    setAutoRecommendedVeggies: React.Dispatch<React.SetStateAction<string[]>>;
    handleRestoreAiRecommendation: () => void;
    handleFinishPlan: () => Promise<void>;
  };
  cards: Omit<CardsRouteProps, 'setScreen'> & {
    setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  };
  shopping: Omit<ShoppingRouteProps, 'setScreen'> & {
    setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  };
  cook: Omit<CookRouteProps, 'setScreen'> & {
    setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  };
};

function buildOnboardingRouteProps(
  params: BuildAppScreenRouterParams['onboarding']
): OnboardingRouteProps {
  return {
    profile: params.profile,
    setProfile: params.setProfile,
    parseNumericInput: params.parseNumericInput,
    profileLimits: params.profileLimits,
    showValidationErrors: params.showValidationErrors,
    setShowValidationErrors: params.setShowValidationErrors,
    onboardingStep: params.onboardingStep,
    setOnboardingStep: params.setOnboardingStep,
    tdee: params.tdee,
    targetPFC: params.targetPFC,
    accountDeleting: params.accountDeleting,
    onSignOut: params.handleSignOut,
    onDeleteAccount: params.handleDeleteAccount,
    onSaveProfile: params.handleSaveProfile,
  };
}

function buildDashboardRouteProps(
  params: BuildAppScreenRouterParams['dashboard']
): DashboardRouteProps {
  return {
    plans: params.plans,
    potBaseImages: params.potBaseImages,
    smallButtonHitSlop: params.smallButtonHitSlop,
    cardButtonHitSlop: params.cardButtonHitSlop,
    cardPressRetention: params.cardPressRetention,
    isCompactScreen: params.isCompactScreen,
    mealShare: params.mealShare,
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
    Card: params.Card,
    SectionTitle: params.SectionTitle,
    formatUnits: params.formatUnits,
    onOpenOnboarding: params.handleOpenOnboarding,
    onStartBuilder: params.handleStartBuilder,
    onOpenCards: params.handleOpenCards,
    onOpenBalance: params.handleOpenBalance,
    onDeletePlan: params.handleDeletePlan,
    onOpenShopping: params.handleOpenShopping,
    onConsumeServing: params.consumeServing,
    onOpenCalendar: params.handleOpenCalendar,
    onGoShopping: params.handleGoShopping,
    onGoStats: params.handleGoStats,
    onClosePlanShopping: params.handleClosePlanShopping,
    onClosePlanBalance: params.handleClosePlanBalance,
    onCloseStockCalendar: params.handleCloseStockCalendar,
    onPrevCalendarMonth: params.handlePrevCalendarMonth,
    onNextCalendarMonth: params.handleNextCalendarMonth,
    onOpenCalendarDetail: params.handleOpenCalendarDetail,
    onCloseCalendarDetail: params.handleCloseCalendarDetail,
  };
}

function buildBuilderRouteProps(params: BuildAppScreenRouterParams['builder']): BuilderRouteProps {
  return {
    step: params.step,
    setStep: params.setStep,
    setScreen: params.setScreen,
    currentPlan: params.currentPlan,
    setCurrentPlan: params.setCurrentPlan,
    normalizePlanForPotBase: params.normalizePlanForPotBase,
    getIngredientsForPotBase: params.getIngredientsForPotBase,
    onToggleProtein: params.handleToggleProtein,
    mushroomIds: params.mushroomIds,
    synergySummary: params.synergySummary,
    localizedSynergyReason: params.localizedSynergyReason,
    synergyCardAnimatedStyle: params.synergyCardAnimatedStyle,
    autoRecommendedVeggies: params.autoRecommendedVeggies,
    onMarkCustom: params.markSynergySummaryAsCustom,
    onSetAutoRecommendedVeggies: params.setAutoRecommendedVeggies,
    onRestoreAiRecommendation: params.handleRestoreAiRecommendation,
    getEffectLead: params.getEffectLead,
    currentPlanTotals: params.currentPlanTotals,
    currentPlanShoppingEntries: params.currentPlanShoppingEntries,
    currentPlanSeasoningEntries: params.currentPlanSeasoningEntries,
    skipPlanConfirm: params.skipPlanConfirm,
    showPlanConfirm: params.showPlanConfirm,
    setShowPlanConfirm: params.setShowPlanConfirm,
    onFinishPlan: params.handleFinishPlan,
    showFiveServingsModal: params.showFiveServingsModal,
    setShowFiveServingsModal: params.setShowFiveServingsModal,
    skipFiveServingsModal: params.skipFiveServingsModal,
    setSkipFiveServingsModal: params.setSkipFiveServingsModal,
    setSkipPlanConfirm: params.setSkipPlanConfirm,
    fiveServingsPotImage: params.fiveServingsPotImage,
    showAutoVegMiniToast: params.showAutoVegMiniToast,
    autoVegMiniToastOpacity: params.autoVegMiniToastOpacity,
    autoVegMiniToastTranslateY: params.autoVegMiniToastTranslateY,
    autoVegMiniToastScale: params.autoVegMiniToastScale,
    showAutoVegHud: params.showAutoVegHud,
    autoVegHudOpacity: params.autoVegHudOpacity,
    autoVegHudTranslateY: params.autoVegHudTranslateY,
    autoVegHudScale: params.autoVegHudScale,
    showSynergyIntroHud: params.showSynergyIntroHud,
    synergyIntroHudOpacity: params.synergyIntroHudOpacity,
    synergyIntroHudTranslateY: params.synergyIntroHudTranslateY,
    synergyIntroHudScale: params.synergyIntroHudScale,
    potBaseImages: params.potBaseImages,
    smallButtonHitSlop: params.smallButtonHitSlop,
    ProgressBar: params.ProgressBar,
    SectionTitle: params.SectionTitle,
    Card: params.Card,
    mealShare: params.mealShare,
    targetPFC: params.targetPFC,
    isCompactScreen: params.isCompactScreen,
    formatUnits: params.formatUnits,
  };
}

function buildCardsRouteProps(params: BuildAppScreenRouterParams['cards']): CardsRouteProps {
  return {
    setScreen: params.setScreen,
    smallButtonHitSlop: params.smallButtonHitSlop,
    Card: params.Card,
    parseEffectSections: params.parseEffectSections,
  };
}

function buildShoppingRouteProps(
  params: BuildAppScreenRouterParams['shopping']
): ShoppingRouteProps {
  return {
    plans: params.plans,
    shoppingScreenData: params.shoppingScreenData,
    smallButtonHitSlop: params.smallButtonHitSlop,
    isCompactScreen: params.isCompactScreen,
    SectionTitle: params.SectionTitle,
    formatUnits: params.formatUnits,
    setScreen: params.setScreen,
    setCookStep: params.setCookStep,
    showShoppingIntro: params.showShoppingIntro,
    skipShoppingIntro: params.skipShoppingIntro,
    setShowShoppingIntro: params.setShowShoppingIntro,
    setSkipShoppingIntro: params.setSkipShoppingIntro,
  };
}

function buildCookRouteProps(params: BuildAppScreenRouterParams['cook']): CookRouteProps {
  return {
    cookStep: params.cookStep,
    setCookStep: params.setCookStep,
    setScreen: params.setScreen,
    cookScrollRef: params.cookScrollRef,
    smallButtonHitSlop: params.smallButtonHitSlop,
    Card: params.Card,
    ProgressBar: params.ProgressBar,
  };
}

export function buildAppScreenRouterProps(params: BuildAppScreenRouterParams): AppScreenRouterGroups {
  return {
    onboarding: buildOnboardingRouteProps(params.onboarding),
    dashboard: buildDashboardRouteProps(params.dashboard),
    builder: buildBuilderRouteProps(params.builder),
    cards: buildCardsRouteProps(params.cards),
    shopping: buildShoppingRouteProps(params.shopping),
    cook: buildCookRouteProps(params.cook),
  };
}
