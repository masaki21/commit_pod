import React from 'react';
import { POT_BASES } from '../../../constants';
import { DashboardScreenContent } from '../../features/dashboard/components/DashboardScreenContent';
import { dateFromKey, formatDateKey, getHeatColor } from '../../features/dashboard/hooks/useDashboardCalendar';
import { BaseRouterProps, DashboardRouteProps } from '../routeTypes';

type DashboardRouteViewProps = Pick<
  BaseRouterProps,
  't' | 'language' | 'styles' | 'isWeb' | 'wrapContent' | 'languageButton' | 'languageModal'
> & {
  dashboard: DashboardRouteProps;
};

export function DashboardRoute({
  t,
  language,
  styles,
  isWeb,
  wrapContent,
  languageButton,
  languageModal,
  dashboard,
}: DashboardRouteViewProps) {
  return (
    <DashboardScreenContent
      t={t}
      language={language}
      styles={styles}
      isWeb={isWeb}
      wrapContent={wrapContent}
      languageButton={languageButton}
      languageModal={languageModal}
      plans={dashboard.plans}
      potBases={POT_BASES}
      potBaseImages={dashboard.potBaseImages}
      smallButtonHitSlop={dashboard.smallButtonHitSlop}
      cardButtonHitSlop={dashboard.cardButtonHitSlop}
      cardPressRetention={dashboard.cardPressRetention}
      isCompactScreen={dashboard.isCompactScreen}
      mealShare={dashboard.mealShare}
      showPlanShopping={dashboard.showPlanShopping}
      showPlanBalance={dashboard.showPlanBalance}
      showStockCalendar={dashboard.showStockCalendar}
      showCalendarDetail={dashboard.showCalendarDetail}
      selectedShoppingPlan={dashboard.selectedShoppingPlan}
      selectedShoppingPlanData={dashboard.selectedShoppingPlanData}
      selectedBalancePlan={dashboard.selectedBalancePlan}
      selectedBalancePlanTotals={dashboard.selectedBalancePlanTotals}
      calendarMonthLabel={dashboard.calendarMonthLabel}
      weekdayLabels={dashboard.weekdayLabels}
      calendarCells={dashboard.calendarCells}
      calendarStats={dashboard.calendarStats}
      calendarDetailDateKey={dashboard.calendarDetailDateKey}
      calendarDetailEntries={dashboard.calendarDetailEntries}
      Card={dashboard.Card}
      SectionTitle={dashboard.SectionTitle}
      formatUnits={dashboard.formatUnits}
      formatDateKey={formatDateKey}
      dateFromKey={dateFromKey}
      getHeatColor={getHeatColor}
      onOpenOnboarding={dashboard.onOpenOnboarding}
      onStartBuilder={dashboard.onStartBuilder}
      onOpenCards={dashboard.onOpenCards}
      onOpenBalance={dashboard.onOpenBalance}
      onDeletePlan={dashboard.onDeletePlan}
      onOpenShopping={dashboard.onOpenShopping}
      onConsumeServing={dashboard.onConsumeServing}
      onOpenCalendar={dashboard.onOpenCalendar}
      onGoShopping={dashboard.onGoShopping}
      onGoStats={dashboard.onGoStats}
      onClosePlanShopping={dashboard.onClosePlanShopping}
      onClosePlanBalance={dashboard.onClosePlanBalance}
      onCloseStockCalendar={dashboard.onCloseStockCalendar}
      onPrevCalendarMonth={dashboard.onPrevCalendarMonth}
      onNextCalendarMonth={dashboard.onNextCalendarMonth}
      onOpenCalendarDetail={dashboard.onOpenCalendarDetail}
      onCloseCalendarDetail={dashboard.onCloseCalendarDetail}
    />
  );
}
