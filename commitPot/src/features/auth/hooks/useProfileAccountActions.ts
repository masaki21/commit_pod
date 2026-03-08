import { Dispatch, SetStateAction, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { Plan, PotBase, UserProfile } from '../../../../types';
import { supabase } from '../../../../supabase';

type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';

type PotHistoryEntry = {
  id: string;
  createdAt: string;
  createdAtKey: string;
  servingsTotal: number;
  servingsLeft: number;
  potBase: PotBase;
  completedAtKey?: string | null;
};

type Translate = (key: string, options?: Record<string, unknown>) => string;

type UseProfileAccountActionsParams = {
  session: Session | null;
  profile: UserProfile;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  setAccountDeleting: Dispatch<SetStateAction<boolean>>;
  setPlans: Dispatch<SetStateAction<Plan[]>>;
  setPotHistories: Dispatch<SetStateAction<Record<string, PotHistoryEntry>>>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  setOnboardingStep: Dispatch<SetStateAction<1 | 2>>;
  t: Translate;
  calculateBMR: (profile: UserProfile) => number;
  calculateTDEE: (profile: UserProfile) => number;
  calculateTargetPFC: (profile: UserProfile, tdee: number) => Plan['targetPFC'];
};

export function useProfileAccountActions({
  session,
  profile,
  setScreen,
  setAccountDeleting,
  setPlans,
  setPotHistories,
  setCurrentPlan,
  setProfile,
  setOnboardingStep,
  t,
  calculateBMR,
  calculateTDEE,
  calculateTargetPFC,
}: UseProfileAccountActionsParams) {
  const handleSaveProfile = useCallback(async () => {
    if (!session?.user) {
      setScreen('dashboard');
      return;
    }

    const computedBmr = calculateBMR(profile);
    const computedTdee = calculateTDEE(profile);
    const computedTarget = calculateTargetPFC(profile, computedTdee);

    await supabase.from('profiles').upsert({
      user_id: session.user.id,
      height: profile.height,
      weight: profile.weight,
      age: profile.age,
      gender: profile.gender,
      activity_level: profile.activityLevel,
      goal: profile.goal,
      bmr: computedBmr,
      tdee: computedTdee,
      target_calories: computedTarget.calories,
      target_pfc: computedTarget,
    });

    setScreen('dashboard');
  }, [calculateBMR, calculateTDEE, calculateTargetPFC, profile, session, setScreen]);

  const handleDeleteAccount = useCallback(() => {
    const performDeleteAccount = async () => {
      if (!session?.user) return;
      setAccountDeleting(true);
      try {
        const { error } = await supabase.rpc('delete_account');
        if (error) throw error;
        await supabase.auth.signOut();
        setPlans([]);
        setPotHistories({});
        setCurrentPlan({ servings: 5, potBase: 'yose', proteins: [], veggies: [], carb: '' });
        setProfile({
          height: 175,
          weight: 75,
          age: 28,
          gender: null,
          activityLevel: 'normal',
          goal: 'recomp',
        });
        setOnboardingStep(1);
        setScreen('splash');
        Alert.alert(
          t('alerts.delete_account_success_title', { defaultValue: '削除完了' }),
          t('alerts.delete_account_success_body', {
            defaultValue: 'アカウントを削除しました。',
          })
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : t('alerts.update_failed');
        Alert.alert(
          t('alerts.delete_account_failed_title', { defaultValue: '削除に失敗しました' }),
          message
        );
      } finally {
        setAccountDeleting(false);
      }
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm(
        t('alerts.delete_account_confirm', {
          defaultValue:
            'アカウントを完全に削除しますか？\nこの操作は取り消せず、保存データも削除されます。',
        })
      );
      if (ok) void performDeleteAccount();
      return;
    }

    Alert.alert(
      t('alerts.delete_account_title', { defaultValue: 'アカウントを削除しますか？' }),
      t('alerts.delete_account_body', {
        defaultValue: 'この操作は取り消せず、保存データも削除されます。',
      }),
      [
        { text: t('alerts.cancel'), style: 'cancel' },
        {
          text: t('alerts.delete'),
          style: 'destructive',
          onPress: () => {
            void performDeleteAccount();
          },
        },
      ]
    );
  }, [
    session,
    setAccountDeleting,
    setCurrentPlan,
    setOnboardingStep,
    setPlans,
    setPotHistories,
    setProfile,
    setScreen,
    t,
  ]);

  return {
    handleSaveProfile,
    handleDeleteAccount,
  };
}
