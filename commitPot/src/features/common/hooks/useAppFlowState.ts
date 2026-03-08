import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Plan, PotBase, UserProfile } from '../../../../types';

export type PotHistoryEntry = {
  id: string;
  createdAt: string;
  createdAtKey: string;
  servingsTotal: number;
  servingsLeft: number;
  potBase: PotBase;
  completedAtKey?: string | null;
};

export type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';
export type AuthMode = 'signIn' | 'signUp';

export type SynergySummaryState = {
  nutritionCategory: string;
  reason: string;
  source: 'matrix' | 'ai' | 'fallback';
  recommendedVeggies: string[];
};

export function useAppFlowState() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [step, setStep] = useState(0);
  const [cookStep, setCookStep] = useState(0);
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [accountDeleting, setAccountDeleting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [showPlanConfirm, setShowPlanConfirm] = useState(false);
  const [showShoppingIntro, setShowShoppingIntro] = useState(false);
  const [showPlanShopping, setShowPlanShopping] = useState(false);
  const [showPlanBalance, setShowPlanBalance] = useState(false);
  const [showStockCalendar, setShowStockCalendar] = useState(false);
  const [showFiveServingsModal, setShowFiveServingsModal] = useState(false);
  const [skipFiveServingsModal, setSkipFiveServingsModal] = useState(false);
  const [skipPlanConfirm, setSkipPlanConfirm] = useState(false);
  const [skipShoppingIntro, setSkipShoppingIntro] = useState(false);

  const [shoppingPlanId, setShoppingPlanId] = useState<string | null>(null);
  const [balancePlanId, setBalancePlanId] = useState<string | null>(null);
  const [potHistories, setPotHistories] = useState<Record<string, PotHistoryEntry>>({});
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [showCalendarDetail, setShowCalendarDetail] = useState(false);
  const [calendarDetailDateKey, setCalendarDetailDateKey] = useState<string | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    height: 175,
    weight: 75,
    age: 28,
    gender: null,
    activityLevel: 'normal',
    goal: 'recomp',
  });
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({
    servings: 5,
    potBase: 'yose',
    proteins: [],
    veggies: [],
    carb: '',
  });
  const [replacingIngredientId, setReplacingIngredientId] = useState<string | null>(null);
  const [synergySummary, setSynergySummary] = useState<SynergySummaryState | null>(null);

  return {
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
    replacingIngredientId,
    setReplacingIngredientId,
    synergySummary,
    setSynergySummary,
  };
}
