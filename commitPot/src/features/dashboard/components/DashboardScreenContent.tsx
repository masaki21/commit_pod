import React, { memo } from 'react';
import { Platform, SafeAreaView, ScrollView } from 'react-native';
import { Plan, PotBase } from '../../../../types';
import { DashboardHeaderActions } from './DashboardHeaderActions';
import { DashboardStockSection } from './DashboardStockSection';
import { DashboardBottomNav } from './DashboardBottomNav';
import { DashboardModals } from './DashboardModals';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type CardComponent = (props: { children: React.ReactNode; style?: object }) => React.ReactElement;
type SectionTitleComponent = (props: { children: React.ReactNode; subtitle?: string }) => React.ReactElement;

type ShoppingEntryLike = {
  id: string;
  name: string;
  roundedGrams: number;
  units: number | null;
  unitName?: string;
};

type SeasoningEntryLike = {
  id: string;
  name: string;
  grams: number;
  amountLabel?: string;
  note?: string;
};

type SelectedShoppingPlanData = {
  shoppingEntries: ShoppingEntryLike[];
  seasoningEntries: SeasoningEntryLike[];
  proteinEntries: ShoppingEntryLike[];
  vegEntries: ShoppingEntryLike[];
  carbEntries: ShoppingEntryLike[];
};

type BalanceTotals = {
  planTargetPFC: { protein: number; fat: number; carbs: number };
  totals: { totalP: number; totalF: number; totalC: number; totalKcal: number; servings: number };
} | null;

type CalendarStat = { totalServings: number; allCompleted: boolean; potCount: number };

type PotHistoryEntryLike = {
  id: string;
  potBase: PotBase;
  servingsLeft: number;
  servingsTotal: number;
};

type DashboardScreenContentProps = {
  t: TFunc;
  language: string;
  styles: any;
  isWeb: boolean;
  wrapContent: (content: React.ReactNode) => React.ReactNode;
  languageButton: React.ReactNode;
  languageModal: React.ReactNode;
  plans: Plan[];
  potBases: Array<{ id: PotBase; name: string }>;
  potBaseImages: Record<PotBase, any>;
  smallButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  cardButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  cardPressRetention: { top: number; right: number; bottom: number; left: number };
  mealShare: number;
  showPlanShopping: boolean;
  showPlanBalance: boolean;
  showStockCalendar: boolean;
  showCalendarDetail: boolean;
  selectedShoppingPlan: Plan | null;
  selectedShoppingPlanData: SelectedShoppingPlanData;
  selectedBalancePlan: Plan | null;
  selectedBalancePlanTotals: BalanceTotals;
  calendarMonthLabel: string;
  weekdayLabels: string[];
  calendarCells: Array<Date | null>;
  calendarStats: Record<string, CalendarStat>;
  calendarDetailDateKey: string | null;
  calendarDetailEntries: PotHistoryEntryLike[];
  isCompactScreen: boolean;
  Card: CardComponent;
  SectionTitle: SectionTitleComponent;
  formatUnits: (units: number | null, unitName?: string) => string;
  formatDateKey: (date: Date) => string;
  dateFromKey: (key: string) => Date;
  getHeatColor: (count: number) => string;
  onOpenOnboarding: () => void;
  onStartBuilder: () => void;
  onOpenCards: () => void;
  onOpenBalance: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onOpenShopping: (planId: string) => void;
  onConsumeServing: (planId: string) => void;
  onOpenCalendar: () => void;
  onGoShopping: () => void;
  onGoStats: () => void;
  onClosePlanShopping: () => void;
  onClosePlanBalance: () => void;
  onCloseStockCalendar: () => void;
  onPrevCalendarMonth: () => void;
  onNextCalendarMonth: () => void;
  onOpenCalendarDetail: (dateKey: string) => void;
  onCloseCalendarDetail: () => void;
};

const DashboardScreenContentComponent = ({
  t,
  language,
  styles,
  isWeb,
  wrapContent,
  languageButton,
  languageModal,
  plans,
  potBases,
  potBaseImages,
  smallButtonHitSlop,
  cardButtonHitSlop,
  cardPressRetention,
  mealShare,
  showPlanShopping,
  showPlanBalance,
  showStockCalendar,
  showCalendarDetail,
  selectedShoppingPlan,
  selectedShoppingPlanData,
  selectedBalancePlan,
  selectedBalancePlanTotals,
  calendarMonthLabel,
  weekdayLabels,
  calendarCells,
  calendarStats,
  calendarDetailDateKey,
  calendarDetailEntries,
  isCompactScreen,
  Card,
  SectionTitle,
  formatUnits,
  formatDateKey,
  dateFromKey,
  getHeatColor,
  onOpenOnboarding,
  onStartBuilder,
  onOpenCards,
  onOpenBalance,
  onDeletePlan,
  onOpenShopping,
  onConsumeServing,
  onOpenCalendar,
  onGoShopping,
  onGoStats,
  onClosePlanShopping,
  onClosePlanBalance,
  onCloseStockCalendar,
  onPrevCalendarMonth,
  onNextCalendarMonth,
  onOpenCalendarDetail,
  onCloseCalendarDetail,
}: DashboardScreenContentProps) => {
  const androidBottomInset = Platform.OS === 'android' ? 24 : 0;
  const dashboardBottomPadding = 120 + androidBottomInset + 24;
  const showAnyDashboardModal =
    showPlanShopping || showPlanBalance || showStockCalendar || showCalendarDetail;

  return (
    <SafeAreaView style={[styles.safeArea, styles.screenLight, isWeb && styles.webRoot]}>
      {wrapContent(
        <ScrollView
          contentContainerStyle={[styles.dashboardPad, { paddingBottom: dashboardBottomPadding }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <DashboardHeaderActions
            t={t}
            styles={styles}
            languageButton={languageButton}
            smallButtonHitSlop={smallButtonHitSlop}
            cardButtonHitSlop={cardButtonHitSlop}
            cardPressRetention={cardPressRetention}
            onOpenOnboarding={onOpenOnboarding}
            onStartBuilder={onStartBuilder}
            onOpenCards={onOpenCards}
          />

          <DashboardStockSection
            t={t}
            styles={styles}
            plans={plans}
            potBases={potBases}
            potBaseImages={potBaseImages}
            cardButtonHitSlop={cardButtonHitSlop}
            smallButtonHitSlop={smallButtonHitSlop}
            cardPressRetention={cardPressRetention}
            Card={Card}
            SectionTitle={SectionTitle}
            onOpenBalance={onOpenBalance}
            onDeletePlan={onDeletePlan}
            onOpenShopping={onOpenShopping}
            onConsumeServing={onConsumeServing}
            onOpenCalendar={onOpenCalendar}
          />
        </ScrollView>
      )}

      <DashboardBottomNav
        t={t}
        styles={styles}
        androidBottomInset={androidBottomInset}
        onGoShopping={onGoShopping}
        onGoStats={onGoStats}
      />

      {showAnyDashboardModal ? (
        <DashboardModals
          t={t}
          styles={styles}
          language={language}
          mealShare={mealShare}
          potBases={potBases}
          showPlanShopping={showPlanShopping}
          showPlanBalance={showPlanBalance}
          showStockCalendar={showStockCalendar}
          showCalendarDetail={showCalendarDetail}
          selectedShoppingPlan={selectedShoppingPlan}
          selectedShoppingPlanData={selectedShoppingPlanData}
          selectedBalancePlan={selectedBalancePlan}
          selectedBalancePlanTotals={selectedBalancePlanTotals}
          calendarMonthLabel={calendarMonthLabel}
          weekdayLabels={weekdayLabels}
          calendarCells={calendarCells}
          calendarStats={calendarStats}
          calendarDetailDateKey={calendarDetailDateKey}
          calendarDetailEntries={calendarDetailEntries}
          isCompactScreen={isCompactScreen}
          Card={Card}
          SectionTitle={SectionTitle}
          formatUnits={formatUnits}
          formatDateKey={formatDateKey}
          dateFromKey={dateFromKey}
          getHeatColor={getHeatColor}
          onClosePlanShopping={onClosePlanShopping}
          onClosePlanBalance={onClosePlanBalance}
          onCloseStockCalendar={onCloseStockCalendar}
          onPrevCalendarMonth={onPrevCalendarMonth}
          onNextCalendarMonth={onNextCalendarMonth}
          onOpenCalendarDetail={onOpenCalendarDetail}
          onCloseCalendarDetail={onCloseCalendarDetail}
        />
      ) : null}

      {languageModal}
    </SafeAreaView>
  );
};

export const DashboardScreenContent = memo(DashboardScreenContentComponent);
