import { Dispatch, SetStateAction, useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { Plan, UserProfile } from '../../../../types';
import { supabase } from '../../../../supabase';

type UseUserDataBootstrapParams = {
  session: Session | null;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  setPlans: Dispatch<SetStateAction<Plan[]>>;
};

export function useUserDataBootstrap({
  session,
  setProfile,
  setPlans,
}: UseUserDataBootstrapParams) {
  useEffect(() => {
    if (!session?.user) return;
    let isDisposed = false;
    const profileAbortController = new AbortController();
    const plansAbortController = new AbortController();

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('height, weight, age, gender, activity_level, goal')
        .eq('user_id', session.user.id)
        .abortSignal(profileAbortController.signal)
        .single();

      if (!data || isDisposed) return;

      setProfile({
        height: data.height,
        weight: data.weight,
        age: data.age,
        gender: data.gender === 'male' || data.gender === 'female' ? data.gender : null,
        activityLevel: data.activity_level,
        goal: data.goal,
      });
    };

    const loadPlans = async () => {
      const { data } = await supabase
        .from('plans')
        .select('id, servings, remaining, pot_base, proteins, veggies, carb, created_at, target_pfc')
        .eq('user_id', session.user.id)
        .abortSignal(plansAbortController.signal)
        .order('created_at', { ascending: false });

      if (!data || isDisposed) return;

      setPlans(
        data.map((row) => ({
          id: row.id,
          servings: row.servings,
          remaining: typeof row.remaining === 'number' ? row.remaining : row.servings,
          potBase: row.pot_base,
          proteins: row.proteins,
          veggies: row.veggies,
          carb: row.carb,
          createdAt: row.created_at,
          targetPFC: row.target_pfc,
        }))
      );
    };

    void loadProfile();
    const planLoadTask = InteractionManager.runAfterInteractions(() => {
      void loadPlans();
    });

    return () => {
      isDisposed = true;
      profileAbortController.abort();
      plansAbortController.abort();
      planLoadTask.cancel();
    };
  }, [session?.user, setPlans, setProfile]);
}
