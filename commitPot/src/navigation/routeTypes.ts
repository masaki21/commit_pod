import React from 'react';

export type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';

export type BaseRouterProps = {
  screen: AppScreen;
  t: (key: string, options?: Record<string, unknown>) => string;
  language: string;
  styles: any;
  isWeb: boolean;
  wrapContent: (content: React.ReactNode) => React.ReactNode;
  languageButton: React.ReactNode;
  languageModal: React.ReactNode;
};

export type OnboardingRouteProps = {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  parseNumericInput: (text: string) => number;
  profileLimits: any;
  showValidationErrors: boolean;
  setShowValidationErrors: React.Dispatch<React.SetStateAction<boolean>>;
  onboardingStep: 1 | 2;
  setOnboardingStep: React.Dispatch<React.SetStateAction<1 | 2>>;
  tdee: number;
  targetPFC: any;
  accountDeleting: boolean;
  onSignOut: () => Promise<void>;
  onDeleteAccount: () => void;
  onSaveProfile: () => Promise<void>;
};

export type DashboardRouteProps = {
  plans: any[];
  potBaseImages: Record<string, any>;
  smallButtonHitSlop: Readonly<{ top: number; right: number; bottom: number; left: number }>;
  cardButtonHitSlop: Readonly<{ top: number; right: number; bottom: number; left: number }>;
  cardPressRetention: Readonly<{ top: number; right: number; bottom: number; left: number }>;
  isCompactScreen: boolean;
  mealShare: number;
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
  Card: React.ComponentType<{ children: React.ReactNode; style?: object }>;
  SectionTitle: React.ComponentType<{ children: React.ReactNode; subtitle?: string }>;
  formatUnits: (units: number | null, unitName?: string) => string;
  onOpenOnboarding: () => void;
  onStartBuilder: () => void;
  onOpenCards: () => void;
  onOpenBalance: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onOpenShopping: (planId: string) => void;
  onConsumeServing: (planId: string) => void;
  onOpenCalendar: () => void;
  onGoShopping: () => void;
  onGoStats: () => void;
  onClosePlanShopping: () => void;
  onClosePlanBalance: () => void;
  onCloseStockCalendar: () => void;
  onPrevCalendarMonth: () => void;
  onNextCalendarMonth: () => void;
  onOpenCalendarDetail: (dateKey: string) => void;
  onCloseCalendarDetail: () => void;
};

export type BuilderRouteProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  currentPlan: any;
  setCurrentPlan: React.Dispatch<React.SetStateAction<any>>;
  normalizePlanForPotBase: (plan: any, potBase: any) => any;
  getIngredientsForPotBase: (potBase: any, category: any) => any[];
  onToggleProtein: (id: string) => Promise<void>;
  mushroomIds: Set<string>;
  synergySummary: any;
  localizedSynergyReason: string;
  synergyCardAnimatedStyle: any;
  autoRecommendedVeggies: string[];
  onMarkCustom: (options?: { skipEvent?: boolean }) => void;
  onSetAutoRecommendedVeggies: React.Dispatch<React.SetStateAction<string[]>>;
  onRestoreAiRecommendation: () => void;
  getEffectLead: (effect: string) => string;
  currentPlanTotals: any;
  currentPlanShoppingEntries: any[];
  currentPlanSeasoningEntries: any[];
  skipPlanConfirm: boolean;
  showPlanConfirm: boolean;
  setShowPlanConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  onFinishPlan: () => Promise<void>;
  showFiveServingsModal: boolean;
  setShowFiveServingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  skipFiveServingsModal: boolean;
  setSkipFiveServingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSkipPlanConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  fiveServingsPotImage: any;
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
  potBaseImages: Record<string, any>;
  smallButtonHitSlop: Readonly<{ top: number; right: number; bottom: number; left: number }>;
  ProgressBar: React.ComponentType<{ current: number; total: number }>;
  SectionTitle: React.ComponentType<{ children: React.ReactNode; subtitle?: string }>;
  Card: React.ComponentType<{ children: React.ReactNode; style?: object }>;
  mealShare: number;
  targetPFC: any;
  isCompactScreen: boolean;
  formatUnits: (units: number | null, unitName?: string) => string;
};

export type CardsRouteProps = {
  setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  smallButtonHitSlop: Readonly<{ top: number; right: number; bottom: number; left: number }>;
  Card: React.ComponentType<{ children: React.ReactNode; style?: object }>;
  parseEffectSections: (effect: string, fallbackTitle: string) => { title: string; body: string }[];
};

export type ShoppingRouteProps = {
  plans: any[];
  shoppingScreenData: any;
  smallButtonHitSlop: Readonly<{ top: number; right: number; bottom: number; left: number }>;
  isCompactScreen: boolean;
  SectionTitle: React.ComponentType<{ children: React.ReactNode; subtitle?: string }>;
  formatUnits: (units: number | null, unitName?: string) => string;
  setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  setCookStep: React.Dispatch<React.SetStateAction<number>>;
  showShoppingIntro: boolean;
  skipShoppingIntro: boolean;
  setShowShoppingIntro: React.Dispatch<React.SetStateAction<boolean>>;
  setSkipShoppingIntro: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CookRouteProps = {
  cookStep: number;
  setCookStep: React.Dispatch<React.SetStateAction<number>>;
  setScreen: React.Dispatch<React.SetStateAction<AppScreen>>;
  cookScrollRef: React.RefObject<any>;
  smallButtonHitSlop: Readonly<{ top: number; right: number; bottom: number; left: number }>;
  Card: React.ComponentType<{ children: React.ReactNode; style?: object }>;
  ProgressBar: React.ComponentType<{ current: number; total: number }>;
};

export type AppScreenRouterProps = BaseRouterProps & {
  onboarding: OnboardingRouteProps;
  dashboard: DashboardRouteProps;
  builder: BuilderRouteProps;
  cards: CardsRouteProps;
  shopping: ShoppingRouteProps;
  cook: CookRouteProps;
};
