import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, ScrollView, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppLanguage } from '../../features/common/hooks/useAppLanguage';
import { useAppFlowState } from '../../features/common/hooks/useAppFlowState';
import { useLanguageUiElements } from '../../features/common/hooks/useLanguageUiElements';
import {
  calculateBMR,
  calculateTargetPFC,
  calculateTDEE,
} from '../../features/onboarding/utils/nutritionTargets';
import { styles } from '../../styles/appStyles';
import { useAppAuthController } from './useAppAuthController';
import { useAppBootstrapEffects } from './useAppBootstrapEffects';
import { useAppBuilderFlowController } from './useAppBuilderFlowController';
import { useAppDashboardController } from './useAppDashboardController';
import { useAppNutritionTargets } from './useAppNutritionTargets';
import { useAppPlanDataController } from './useAppPlanDataController';
import { useAppRoutesController } from './useAppRoutesController';
import { perfScreenTransition } from '../../features/common/utils/perfLogger';

export function useAppController() {
  const isWeb = Platform.OS === 'web';
  const { width: windowWidth } = useWindowDimensions();
  const isCompactScreen = windowWidth < 390;
  const { t, i18n } = useTranslation();
  const {
    languageMode,
    showLanguageModal,
    setShowLanguageModal,
    languageOptions,
    handleSelectLanguage,
  } = useAppLanguage({ t, i18n });

  const {
    screen,
    setScreen,
    step,
    setStep,
    cookStep,
    setCookStep,
    authReady,
    setAuthReady,
    session,
    setSession,
    authMode,
    setAuthMode,
    email,
    setEmail,
    password,
    setPassword,
    authLoading,
    setAuthLoading,
    accountDeleting,
    setAccountDeleting,
    authError,
    setAuthError,
    showPlanConfirm,
    setShowPlanConfirm,
    showShoppingIntro,
    setShowShoppingIntro,
    showPlanShopping,
    setShowPlanShopping,
    showPlanBalance,
    setShowPlanBalance,
    showStockCalendar,
    setShowStockCalendar,
    showFiveServingsModal,
    setShowFiveServingsModal,
    skipFiveServingsModal,
    setSkipFiveServingsModal,
    skipPlanConfirm,
    setSkipPlanConfirm,
    skipShoppingIntro,
    setSkipShoppingIntro,
    shoppingPlanId,
    setShoppingPlanId,
    balancePlanId,
    setBalancePlanId,
    potHistories,
    setPotHistories,
    calendarMonthOffset,
    setCalendarMonthOffset,
    showCalendarDetail,
    setShowCalendarDetail,
    calendarDetailDateKey,
    setCalendarDetailDateKey,
    showValidationErrors,
    setShowValidationErrors,
    profile,
    setProfile,
    onboardingStep,
    setOnboardingStep,
    plans,
    setPlans,
    currentPlan,
    setCurrentPlan,
    setReplacingIngredientId,
    synergySummary,
    setSynergySummary,
  } = useAppFlowState();
  const prevScreenRef = useRef(screen);
  const prevStepRef = useRef(step);

  const cookScrollRef = useRef<ScrollView | null>(null);
  useEffect(() => {
    if (prevScreenRef.current !== screen) {
      perfScreenTransition(prevScreenRef.current, screen, { step, prevStep: prevStepRef.current });
      prevScreenRef.current = screen;
    }
    if (prevStepRef.current !== step) {
      perfScreenTransition(`${screen}:step${prevStepRef.current}`, `${screen}:step${step}`);
      prevStepRef.current = step;
    }
  }, [screen, step]);

  useEffect(() => {
    if (screen === 'onboarding') {
      setShowValidationErrors(false);
    }
  }, [screen, onboardingStep, setShowValidationErrors]);

  const wrapContent = useCallback(
    (children: React.ReactNode) =>
      isWeb ? <View style={styles.webContent}>{children}</View> : <>{children}</>,
    [isWeb],
  );

  const { tdee, targetPFC } = useAppNutritionTargets(profile);

  const { languageButton, languageModal } = useLanguageUiElements({
    t,
    styles,
    showLanguageModal,
    setShowLanguageModal,
    languageMode,
    languageOptions,
    handleSelectLanguage,
  });

  const {
    handleToggleProtein,
    handleRestoreAiRecommendation,
    autoRecommendedVeggies,
    setAutoRecommendedVeggies,
    showAutoVegMiniToast,
    showAutoVegHud,
    showSynergyIntroHud,
    autoVegMiniToastOpacity,
    autoVegMiniToastTranslateY,
    autoVegMiniToastScale,
    autoVegHudOpacity,
    autoVegHudTranslateY,
    autoVegHudScale,
    synergyIntroHudOpacity,
    synergyIntroHudTranslateY,
    synergyIntroHudScale,
    localizedSynergyReason,
    synergyCardAnimatedStyle,
    markSynergySummaryAsCustom,
  } = useAppBuilderFlowController({
    screen,
    step,
    currentPlan,
    setCurrentPlan,
    profileGoal: profile.goal,
    language: i18n.language,
    resolvedLanguage: i18n.resolvedLanguage,
    t,
    synergySummary,
    setSynergySummary,
    setReplacingIngredientId,
  });

  const {
    formatUnits,
    selectedShoppingPlan,
    selectedBalancePlan,
    selectedShoppingPlanData,
    selectedBalancePlanTotals,
    currentPlanShoppingEntries,
    currentPlanSeasoningEntries,
    currentPlanTotals,
    shoppingScreenData,
  } = useAppPlanDataController({
    plans,
    shoppingPlanId,
    balancePlanId,
    screen,
    step,
    currentPlan,
    targetPFC,
    goal: profile.goal,
    t,
  });

  useAppBootstrapEffects({
    screen,
    cookStep,
    cookScrollRef,
    authReady,
    session,
    setSession,
    setAuthReady,
    skipShoppingIntro,
    setShowShoppingIntro,
    setSkipFiveServingsModal,
    setSkipPlanConfirm,
    setSkipShoppingIntro,
    plans,
    potHistories,
    setPotHistories,
    setScreen,
    setProfile,
    setPlans,
  });

  const {
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
  } = useAppDashboardController({
    language: i18n.language,
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
  });

  const { handleSignOut, handleSaveProfile, handleDeleteAccount, authGateScreen } =
    useAppAuthController({
      authReady,
      session,
      t,
      styles,
      isWeb,
      wrapContent,
      languageButton,
      languageModal,
      email,
      setEmail,
      password,
      setPassword,
      authError,
      authMode,
      setAuthMode,
      authLoading,
      setAuthLoading,
      setAuthError,
      setScreen,
      profile,
      setAccountDeleting,
      setPlans,
      setPotHistories,
      setCurrentPlan,
      setProfile,
      setOnboardingStep,
      calculateBMR,
      calculateTDEE,
      calculateTargetPFC,
    });

  const {
    onboarding: onboardingRouteProps,
    dashboard: dashboardRouteProps,
    builder: builderRouteProps,
    cards: cardsRouteProps,
    shopping: shoppingRouteProps,
    cook: cookRouteProps,
  } = useAppRoutesController({
    core: {
      profile,
      setProfile,
      showValidationErrors,
      setShowValidationErrors,
      onboardingStep,
      setOnboardingStep,
      tdee,
      targetPFC,
      accountDeleting,
      plans,
      isCompactScreen,
      showPlanShopping,
      showPlanBalance,
      showStockCalendar,
      showCalendarDetail,
      step,
      setStep,
      setScreen,
      currentPlan,
      setCurrentPlan,
      skipPlanConfirm,
      showPlanConfirm,
      setShowPlanConfirm,
      showFiveServingsModal,
      setShowFiveServingsModal,
      skipFiveServingsModal,
      setSkipFiveServingsModal,
      setSkipPlanConfirm,
      showShoppingIntro,
      skipShoppingIntro,
      setShowShoppingIntro,
      setSkipShoppingIntro,
      cookStep,
      setCookStep,
      cookScrollRef,
    },
    auth: {
      handleSignOut,
      handleDeleteAccount,
      handleSaveProfile,
    },
    dashboard: {
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
    builder: {
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
      handleFinishPlan,
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
    },
    shopping: {
      shoppingScreenData,
    },
  });

  return {
    screen,
    t,
    language: i18n.language,
    isWeb,
    wrapContent,
    languageButton,
    languageModal,
    onboardingRouteProps,
    dashboardRouteProps,
    builderRouteProps,
    cardsRouteProps,
    shoppingRouteProps,
    cookRouteProps,
    authGateScreen,
  };
}
