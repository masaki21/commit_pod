import { Dispatch, SetStateAction, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../../supabase';

type UseAuthSessionParams = {
  setSession: Dispatch<SetStateAction<Session | null>>;
  setAuthReady: Dispatch<SetStateAction<boolean>>;
};

export function useAuthSession({ setSession, setAuthReady }: UseAuthSessionParams) {
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
        setAuthReady(true);
      })
      .catch(() => setAuthReady(true));

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, [setAuthReady, setSession]);
}
