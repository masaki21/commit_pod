import { Dispatch, SetStateAction, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';

type UseInitialScreenRoutingParams = {
  screen: AppScreen;
  authReady: boolean;
  session: Session | null;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  delayMs?: number;
};

export function useInitialScreenRouting({
  screen,
  authReady,
  session,
  setScreen,
  delayMs = 2000,
}: UseInitialScreenRoutingParams) {
  useEffect(() => {
    if (screen !== 'splash' || !authReady) return;
    const timer = setTimeout(() => {
      setScreen(session?.user ? 'dashboard' : 'onboarding');
    }, delayMs);
    return () => clearTimeout(timer);
  }, [authReady, delayMs, screen, session?.user, setScreen]);
}
