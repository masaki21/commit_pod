import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { Plan, UserProfile } from '../../../types';
import { useAuthSession } from '../../features/auth/hooks/useAuthSession';
import { useUiPreferenceFlags } from '../../features/common/hooks/useUiPreferenceFlags';
import { AppScreen, PotHistoryEntry } from '../../features/common/hooks/useAppFlowState';
import { usePotHistoriesSync } from '../../features/dashboard/hooks/usePotHistoriesSync';
import { useUserDataBootstrap } from '../../features/dashboard/hooks/useUserDataBootstrap';
import { useInitialScreenRouting } from '../../features/onboarding/hooks/useInitialScreenRouting';
import { useShoppingIntroRouting } from '../../features/shopping/hooks/useShoppingIntroRouting';

type BootstrapEffectsParams = {
  screen: AppScreen;
  cookStep: number;
  cookScrollRef: MutableRefObject<ScrollView | null>;
  authReady: boolean;
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
  setAuthReady: Dispatch<SetStateAction<boolean>>;
  skipShoppingIntro: boolean;
  setShowShoppingIntro: Dispatch<SetStateAction<boolean>>;
  setSkipFiveServingsModal: Dispatch<SetStateAction<boolean>>;
  setSkipPlanConfirm: Dispatch<SetStateAction<boolean>>;
  setSkipShoppingIntro: Dispatch<SetStateAction<boolean>>;
  plans: Plan[];
  potHistories: Record<string, PotHistoryEntry>;
  setPotHistories: Dispatch<SetStateAction<Record<string, PotHistoryEntry>>>;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  setPlans: Dispatch<SetStateAction<Plan[]>>;
};

export function useAppBootstrapEffects({
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
}: BootstrapEffectsParams) {
  useAuthSession({ setSession, setAuthReady });

  useUiPreferenceFlags({
    setSkipFiveServingsModal,
    setSkipPlanConfirm,
    setSkipShoppingIntro,
  });

  usePotHistoriesSync({
    plans,
    potHistories,
    setPotHistories,
  });

  useInitialScreenRouting({
    screen,
    authReady,
    session,
    setScreen,
  });

  useShoppingIntroRouting({
    screen,
    skipShoppingIntro,
    setShowShoppingIntro,
  });

  useUserDataBootstrap({
    session,
    setProfile,
    setPlans,
  });

  useEffect(() => {
    if (screen !== 'cook') return;
    const id = requestAnimationFrame(() => {
      cookScrollRef.current?.scrollTo({ y: 0, animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, [cookStep, screen, cookScrollRef]);
}
