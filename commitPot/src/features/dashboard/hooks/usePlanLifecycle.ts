import { Alert, Platform } from 'react-native';
import { useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Dispatch, SetStateAction } from 'react';
import type { PFC, Plan, PotBase } from '../../../../types';
import { supabase } from '../../../../supabase';
import { perfMeasureAsync, perfTap } from '../../common/utils/perfLogger';

type PotHistoryEntry = {
  id: string;
  createdAt: string;
  createdAtKey: string;
  servingsTotal: number;
  servingsLeft: number;
  potBase: PotBase;
  completedAtKey?: string | null;
};

type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';

type Params = {
  session: Session | null;
  plans: Plan[];
  currentPlan: Partial<Plan>;
  targetPFC: PFC;
  setPlans: Dispatch<SetStateAction<Plan[]>>;
  setPotHistories: Dispatch<SetStateAction<Record<string, PotHistoryEntry>>>;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  t: (key: string) => string;
  dateKeyFromIso: (iso: string) => string;
  formatDateKey: (date: Date) => string;
};

export const usePlanLifecycle = ({
  session,
  plans,
  currentPlan,
  targetPFC,
  setPlans,
  setPotHistories,
  setScreen,
  t,
  dateKeyFromIso,
  formatDateKey,
}: Params) => {
  const handleFinishPlan = useCallback(async () => {
    perfTap('builder.finishPlan');
    const newPlan: Plan = {
      id: Math.random().toString(36).slice(2, 11),
      servings: currentPlan.servings as 2 | 5,
      remaining: currentPlan.servings as 2 | 5,
      potBase: currentPlan.potBase as PotBase,
      proteins: currentPlan.proteins!,
      veggies: currentPlan.veggies!,
      carb: currentPlan.carb!,
      createdAt: new Date().toISOString(),
      targetPFC,
    };

    if (session?.user) {
      const { data, error } = await perfMeasureAsync(
        'dashboard.finishPlan.insert',
        () =>
          supabase
            .from('plans')
            .insert({
              user_id: session.user.id,
              servings: newPlan.servings,
              remaining: newPlan.remaining,
              pot_base: newPlan.potBase,
              proteins: newPlan.proteins,
              veggies: newPlan.veggies,
              carb: newPlan.carb,
              target_pfc: newPlan.targetPFC,
            })
            .select()
            .single(),
        { planId: newPlan.id },
        { logAll: true }
      );

      if (!error && data) {
        setPotHistories((prev) => ({
          ...prev,
          [data.id]: {
            id: data.id,
            createdAt: data.created_at,
            createdAtKey: dateKeyFromIso(data.created_at),
            servingsTotal: data.servings,
            servingsLeft: data.remaining ?? data.servings,
            potBase: data.pot_base,
            completedAtKey: null,
          },
        }));
        setPlans([
          {
            id: data.id,
            servings: data.servings,
            remaining: data.remaining ?? data.servings,
            potBase: data.pot_base,
            proteins: data.proteins,
            veggies: data.veggies,
            carb: data.carb,
            createdAt: data.created_at,
            targetPFC: data.target_pfc,
          },
          ...plans,
        ]);
      } else {
        setPotHistories((prev) => ({
          ...prev,
          [newPlan.id]: {
            id: newPlan.id,
            createdAt: newPlan.createdAt,
            createdAtKey: dateKeyFromIso(newPlan.createdAt),
            servingsTotal: newPlan.servings,
            servingsLeft: newPlan.remaining,
            potBase: newPlan.potBase,
            completedAtKey: null,
          },
        }));
        setPlans([newPlan, ...plans]);
      }
    } else {
      setPotHistories((prev) => ({
        ...prev,
        [newPlan.id]: {
          id: newPlan.id,
          createdAt: newPlan.createdAt,
          createdAtKey: dateKeyFromIso(newPlan.createdAt),
          servingsTotal: newPlan.servings,
          servingsLeft: newPlan.remaining,
          potBase: newPlan.potBase,
          completedAtKey: null,
        },
      }));
      setPlans([newPlan, ...plans]);
    }

    setScreen('dashboard');
  }, [
    currentPlan.carb,
    currentPlan.potBase,
    currentPlan.proteins,
    currentPlan.servings,
    currentPlan.veggies,
    dateKeyFromIso,
    plans,
    session?.user,
    setPlans,
    setPotHistories,
    setScreen,
    targetPFC,
  ]);

  const consumeServing = useCallback(
    async (planId: string) => {
      perfTap('dashboard.consumeServing', { planId });
      const targetPlan = plans.find((plan) => plan.id === planId);
      if (!targetPlan) return;

      const currentRemaining = Number.isFinite(targetPlan.remaining)
        ? targetPlan.remaining
        : targetPlan.servings;
      const nextRemaining = Math.max(currentRemaining - 1, 0);

      if (!session?.user) {
        Alert.alert(t('alerts.login_required_title'), t('alerts.login_required_body'));
        return;
      }

      if (nextRemaining === 0) {
        const { error } = await perfMeasureAsync(
          'dashboard.consumeServing.deletePlan',
          () =>
            supabase
              .from('plans')
              .delete()
              .eq('id', planId)
              .eq('user_id', session.user.id),
          { planId },
          { logAll: true }
        );
        if (error) {
          Alert.alert(t('alerts.update_failed'), error.message);
          return;
        }

        const completedAtKey = formatDateKey(new Date());
        setPotHistories((prev) => {
          const existing = prev[planId];
          return {
            ...prev,
            [planId]: {
              ...(existing ?? {
                id: planId,
                createdAt: new Date().toISOString(),
                createdAtKey: completedAtKey,
                servingsTotal: targetPlan.servings,
                servingsLeft: 0,
                potBase: targetPlan.potBase,
              }),
              servingsLeft: 0,
              completedAtKey,
            },
          };
        });
        setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      } else {
        const { data, error } = await perfMeasureAsync(
          'dashboard.consumeServing.updateRemaining',
          () =>
            supabase
              .from('plans')
              .update({ remaining: nextRemaining })
              .eq('id', planId)
              .eq('user_id', session.user.id)
              .select('id, remaining')
              .single(),
          { planId, nextRemaining },
          { logAll: true }
        );
        if (error) {
          Alert.alert(t('alerts.update_failed'), error.message);
          return;
        }
        setPlans((prev) =>
          prev.map((plan) => (plan.id === planId ? { ...plan, remaining: data.remaining } : plan))
        );
        setPotHistories((prev) => {
          const existing = prev[planId];
          if (!existing) return prev;
          return {
            ...prev,
            [planId]: {
              ...existing,
              servingsLeft: data.remaining,
            },
          };
        });
      }

      Alert.alert(t('alerts.energy_done_title'), t('alerts.energy_done_body'));
    },
    [formatDateKey, plans, session?.user, setPlans, setPotHistories, t]
  );

  const handleDeletePlan = useCallback(
    (planId: string) => {
      perfTap('dashboard.deletePlan', { planId });
      const performDelete = async () => {
        if (session?.user) {
          await perfMeasureAsync(
            'dashboard.deletePlan.remoteDelete',
            () => supabase.from('plans').delete().eq('id', planId).eq('user_id', session.user.id),
            { planId },
            { logAll: true }
          );
        }
        const completedAtKey = formatDateKey(new Date());
        setPotHistories((prev) => {
          const existing = prev[planId];
          return {
            ...prev,
            [planId]: {
              ...(existing ?? {
                id: planId,
                createdAt: new Date().toISOString(),
                createdAtKey: completedAtKey,
                servingsTotal: 0,
                servingsLeft: 0,
                potBase: 'yose',
              }),
              servingsLeft: 0,
              completedAtKey,
            },
          };
        });
        setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      };

      if (Platform.OS === 'web') {
        const ok = window.confirm(t('alerts.delete_pot_confirm'));
        if (ok) void performDelete();
        return;
      }

      Alert.alert(t('alerts.delete_pot_title'), t('alerts.delete_pot_body'), [
        { text: t('alerts.cancel'), style: 'cancel' },
        { text: t('alerts.delete'), style: 'destructive', onPress: performDelete },
      ]);
    },
    [formatDateKey, session?.user, setPlans, setPotHistories, t]
  );

  return {
    handleFinishPlan,
    consumeServing,
    handleDeletePlan,
  };
};
