import { useMemo } from 'react';

type PotHistoryEntry = {
  id: string;
  createdAt: string;
  createdAtKey: string;
  servingsTotal: number;
  servingsLeft: number;
  potBase: string;
  completedAtKey?: string | null;
};

type UseCalendarDetailEntriesParams = {
  calendarDetailDateKey: string | null;
  potHistories: Record<string, PotHistoryEntry>;
};

export function useCalendarDetailEntries({
  calendarDetailDateKey,
  potHistories,
}: UseCalendarDetailEntriesParams) {
  return useMemo(() => {
    if (!calendarDetailDateKey) return [] as PotHistoryEntry[];
    return Object.values(potHistories)
      .filter((entry) => entry.createdAtKey === calendarDetailDateKey)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [calendarDetailDateKey, potHistories]);
}
