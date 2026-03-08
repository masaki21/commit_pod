import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plan, PotBase } from '../../../../types';
import { dateKeyFromIso } from './useDashboardCalendar';

type PotHistoryEntry = {
  id: string;
  createdAt: string;
  createdAtKey: string;
  servingsTotal: number;
  servingsLeft: number;
  potBase: PotBase;
  completedAtKey?: string | null;
};

type UsePotHistoriesSyncParams = {
  plans: Plan[];
  potHistories: Record<string, PotHistoryEntry>;
  setPotHistories: Dispatch<SetStateAction<Record<string, PotHistoryEntry>>>;
  storageKey?: string;
};

export function usePotHistoriesSync({
  plans,
  potHistories,
  setPotHistories,
  storageKey = 'pot_histories_v1',
}: UsePotHistoriesSyncParams) {
  const persistDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (!mounted || !value) return;
        const parsed = JSON.parse(value) as Record<string, PotHistoryEntry>;
        setPotHistories(parsed);
      })
      .catch(() => {
        // ignore storage errors
      });
    return () => {
      mounted = false;
    };
  }, [setPotHistories, storageKey]);

  useEffect(() => {
    if (persistDebounceTimerRef.current) {
      clearTimeout(persistDebounceTimerRef.current);
      persistDebounceTimerRef.current = null;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      persistDebounceTimerRef.current = setTimeout(() => {
        AsyncStorage.setItem(storageKey, JSON.stringify(potHistories)).catch(() => {
          // ignore storage errors
        });
      }, 160);
    });

    return () => {
      task.cancel();
      if (persistDebounceTimerRef.current) {
        clearTimeout(persistDebounceTimerRef.current);
        persistDebounceTimerRef.current = null;
      }
    };
  }, [potHistories, storageKey]);

  useEffect(() => {
    if (plans.length === 0) return;
    setPotHistories((prev) => {
      let changed = false;
      const next = { ...prev };
      plans.forEach((plan) => {
        const existing = next[plan.id];
        const nextLeft = Number.isFinite(plan.remaining) ? plan.remaining : plan.servings;
        if (!existing) {
          next[plan.id] = {
            id: plan.id,
            createdAt: plan.createdAt,
            createdAtKey: dateKeyFromIso(plan.createdAt),
            servingsTotal: plan.servings,
            servingsLeft: nextLeft,
            potBase: plan.potBase,
            completedAtKey: null,
          };
          changed = true;
          return;
        }
        if (
          existing.servingsLeft !== nextLeft ||
          existing.servingsTotal !== plan.servings ||
          existing.potBase !== plan.potBase
        ) {
          next[plan.id] = {
            ...existing,
            servingsLeft: nextLeft,
            servingsTotal: plan.servings,
            potBase: plan.potBase,
          };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [plans, setPotHistories]);
}
