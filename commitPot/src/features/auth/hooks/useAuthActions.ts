import { Dispatch, SetStateAction, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../../supabase';

type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';

type UseAuthActionsParams = {
  authMode: 'signIn' | 'signUp';
  email: string;
  password: string;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  setAuthError: Dispatch<SetStateAction<string | null>>;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  session: Session | null;
};

export function useAuthActions({
  authMode,
  email,
  password,
  setAuthLoading,
  setAuthError,
  setScreen,
  session,
}: UseAuthActionsParams) {
  const handleAuth = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (authMode === 'signIn') {
      const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email: normalizedEmail, password });
      if (error) setAuthError(error.message);
    }
    setAuthLoading(false);
  }, [authMode, email, password, setAuthError, setAuthLoading]);

  const handleSignOut = useCallback(async () => {
    if (!session) return;
    await supabase.auth.signOut();
    setScreen('splash');
  }, [session, setScreen]);

  return {
    handleAuth,
    handleSignOut,
  };
}
