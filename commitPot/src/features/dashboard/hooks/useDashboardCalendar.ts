import { useMemo } from 'react';
import { PotBase } from '../../../../types';

type PotHistoryEntry = {
  id: string;
  createdAt: string;
  createdAtKey: string;
  servingsTotal: number;
  servingsLeft: number;
  potBase: PotBase;
  completedAtKey?: string | null;
};

type CalendarStat = {
  totalServings: number;
  allCompleted: boolean;
  potCount: number;
};

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const dateKeyFromIso = (iso: string) => formatDateKey(new Date(iso));

export const dateFromKey = (key: string) => {
  const [year, month, day] = key.split('-').map((value) => Number(value));
  return new Date(year, month - 1, day);
};

export const getHeatColor = (count: number) => {
  if (count <= 0) return '#f3f4f6';
  if (count === 1) return '#bbf7d0';
  if (count === 2) return '#4ade80';
  return '#16a34a';
};

export function useDashboardCalendar({
  language,
  calendarMonthOffset,
  potHistories,
}: {
  language: string;
  calendarMonthOffset: number;
  potHistories: Record<string, PotHistoryEntry>;
}) {
  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(language, { weekday: 'short' });
    return Array.from({ length: 7 }, (_, index) => formatter.format(new Date(2021, 7, 1 + index)));
  }, [language]);

  const calendarMonth = useMemo(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth() + calendarMonthOffset, 1);
  }, [calendarMonthOffset]);

  const calendarMonthLabel = useMemo(
    () =>
      calendarMonth.toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
      }),
    [calendarMonth, language]
  );

  const calendarStats = useMemo(() => {
    const entries = Object.values(potHistories);
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const stats: Record<string, CalendarStat> = {};

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);
      const dayEntries = entries.filter((entry) => entry.createdAtKey === key);
      // Calendar badge should reflect current remaining servings so it updates after "ate".
      const totalServings = dayEntries.reduce(
        (sum, entry) => sum + Math.max(0, Number(entry.servingsLeft) || 0),
        0
      );
      const allCompleted =
        dayEntries.length > 0 && dayEntries.every((entry) => Number(entry.servingsLeft) <= 0);
      stats[key] = { totalServings, allCompleted, potCount: dayEntries.length };
    }

    return stats;
  }, [calendarMonth, potHistories]);

  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const cells: Array<Date | null> = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }

    return cells;
  }, [calendarMonth]);

  return {
    weekdayLabels,
    calendarMonthLabel,
    calendarStats,
    calendarCells,
  };
}
