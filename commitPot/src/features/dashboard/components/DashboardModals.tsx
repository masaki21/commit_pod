import React, { memo } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { ChefHat, ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react-native';
import { Plan, PotBase } from '../../../../types';
import { ShoppingListCard } from '../../common/components/ShoppingListCard';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

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

type CardComponent = (props: { children: React.ReactNode; style?: object }) => React.ReactElement;
type SectionTitleComponent = (props: { children: React.ReactNode; subtitle?: string }) => React.ReactElement;

type DashboardModalsProps = {
  t: TFunc;
  styles: any;
  language: string;
  mealShare: number;
  potBases: Array<{ id: PotBase; name: string }>;
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
  getHeatColor: (servings: number) => string;
  onClosePlanShopping: () => void;
  onClosePlanBalance: () => void;
  onCloseStockCalendar: () => void;
  onPrevCalendarMonth: () => void;
  onNextCalendarMonth: () => void;
  onOpenCalendarDetail: (dateKey: string) => void;
  onCloseCalendarDetail: () => void;
};

const DashboardModalsComponent = ({
  t,
  styles,
  language,
  mealShare,
  potBases,
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
  onClosePlanShopping,
  onClosePlanBalance,
  onCloseStockCalendar,
  onPrevCalendarMonth,
  onNextCalendarMonth,
  onOpenCalendarDetail,
  onCloseCalendarDetail,
}: DashboardModalsProps) => {
  return (
    <>
      {showPlanShopping ? (
        <Modal visible transparent animationType="fade" onRequestClose={onClosePlanShopping}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, styles.modalCardLarge]}>
              <View style={styles.modalTitleRow}>
                <ShoppingBag size={16} color="#f97316" strokeWidth={2.5} />
                <Text style={styles.modalTitle}>{t('ui.shopping_list_title')}</Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {!selectedShoppingPlan ||
                (selectedShoppingPlanData.shoppingEntries.length === 0 &&
                  selectedShoppingPlanData.seasoningEntries.length === 0) ? (
                  <View style={styles.emptyState}>
                    <ShoppingBag size={60} color="#d1d5db" />
                    <Text style={styles.emptyTitleLarge}>{t('ui.shopping_empty_title')}</Text>
                  </View>
                ) : (
                  <View style={styles.cardStack}>
                    <View>
                      <SectionTitle>{t('ui.tab_protein')}</SectionTitle>
                      <View style={styles.cardStack}>
                        {selectedShoppingPlanData.proteinEntries.map((entry) => (
                          <ShoppingListCard
                            key={entry.id}
                            styles={styles}
                            isCompactScreen={isCompactScreen}
                            title={entry.name}
                            amount={`${entry.roundedGrams}g`}
                            detail={entry.units ? formatUnits(entry.units, entry.unitName) : undefined}
                          />
                        ))}
                      </View>
                    </View>

                    <View>
                      <SectionTitle>{t('ui.tab_veg')}</SectionTitle>
                      <View style={styles.cardStack}>
                        {selectedShoppingPlanData.vegEntries.map((entry) => (
                          <ShoppingListCard
                            key={entry.id}
                            styles={styles}
                            isCompactScreen={isCompactScreen}
                            title={entry.name}
                            amount={`${entry.roundedGrams}g`}
                            detail={entry.units ? formatUnits(entry.units, entry.unitName) : undefined}
                          />
                        ))}
                      </View>
                    </View>

                    <View>
                      <SectionTitle>{t('ui.tab_carb')}</SectionTitle>
                      <View style={styles.cardStack}>
                        {selectedShoppingPlanData.carbEntries.map((entry) => (
                          <ShoppingListCard
                            key={entry.id}
                            styles={styles}
                            isCompactScreen={isCompactScreen}
                            title={entry.name}
                            amount={`${entry.roundedGrams}g`}
                            detail={entry.units ? formatUnits(entry.units, entry.unitName) : undefined}
                          />
                        ))}
                      </View>
                    </View>

                    <View>
                      <SectionTitle>{t('ui.tab_seasoning')}</SectionTitle>
                      <View style={styles.cardStack}>
                        {selectedShoppingPlanData.seasoningEntries.map((entry) => (
                          <ShoppingListCard
                            key={entry.id}
                            styles={styles}
                            isCompactScreen={isCompactScreen}
                            title={entry.name}
                            amount={entry.amountLabel ?? `${entry.grams}g`}
                            detail={entry.note}
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
              <Pressable style={styles.modalButton} onPress={onClosePlanShopping}>
                <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}

      {showPlanBalance ? (
        <Modal visible transparent animationType="fade" onRequestClose={onClosePlanBalance}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, styles.modalCardLarge]}>
              <View style={styles.modalTitleRow}>
                <ChefHat size={16} color="#f97316" strokeWidth={2.5} />
                <Text style={styles.modalTitle}>
                  {selectedBalancePlan
                    ? t(potBases.find((b) => b.id === selectedBalancePlan.potBase)?.name || '')
                    : t('ui.ideal_balance_title')}
                </Text>
              </View>
              {!selectedBalancePlan || !selectedBalancePlanTotals ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitleLarge}>{t('ui.shopping_empty_title')}</Text>
                </View>
              ) : (
                <View style={styles.cardStack}>
                  <Card style={styles.sideCard}>
                    <Text style={styles.sideCardTitle}>{t('ui.ideal_balance_title')}</Text>
                    <Text style={styles.sideCardNote}>{t('ui.ideal_balance_note')}</Text>
                    <View style={styles.pfcRow}>
                      <View style={styles.pfcCell}>
                        <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
                        <Text style={styles.pfcValueDark}>
                          {Math.round(selectedBalancePlanTotals.planTargetPFC.protein * mealShare)}g
                        </Text>
                      </View>
                      <View style={styles.pfcCell}>
                        <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                        <Text style={styles.pfcValueDark}>
                          {Math.round(selectedBalancePlanTotals.planTargetPFC.fat * mealShare)}g
                        </Text>
                      </View>
                      <View style={styles.pfcCell}>
                        <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                        <Text style={styles.pfcValueDark}>
                          {Math.round(selectedBalancePlanTotals.planTargetPFC.carbs * mealShare)}g
                        </Text>
                      </View>
                    </View>
                  </Card>

                  <Card style={styles.sideCardAccent}>
                    <Text style={styles.sideCardTitleAccent}>{t('ui.actual_balance_title')}</Text>
                    <View style={styles.pfcRow}>
                      <View style={styles.pfcCell}>
                        <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
                        <Text style={styles.pfcValueAccent}>
                          {Math.round(
                            selectedBalancePlanTotals.totals.totalP / selectedBalancePlanTotals.totals.servings
                          )}
                          g
                        </Text>
                      </View>
                      <View style={styles.pfcCell}>
                        <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                        <Text style={styles.pfcValueAccent}>
                          {Math.round(
                            selectedBalancePlanTotals.totals.totalF / selectedBalancePlanTotals.totals.servings
                          )}
                          g
                        </Text>
                      </View>
                      <View style={styles.pfcCell}>
                        <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                        <Text style={styles.pfcValueAccent}>
                          {Math.round(
                            selectedBalancePlanTotals.totals.totalC / selectedBalancePlanTotals.totals.servings
                          )}
                          g
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pfcRow}>
                      <View style={styles.pfcCell}>
                        <Text style={styles.pfcLabel}>{t('ui.stat_calories')}</Text>
                        <Text style={styles.pfcValueAccent}>
                          {Math.round(
                            selectedBalancePlanTotals.totals.totalKcal / selectedBalancePlanTotals.totals.servings
                          )}
                          kcal
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
              )}
              <Pressable style={styles.modalButton} onPress={onClosePlanBalance}>
                <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : null}

      {showStockCalendar ? (
        <Modal visible transparent animationType="fade" onRequestClose={onCloseStockCalendar}>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, styles.calendarModalCard]}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>{t('ui.calendar_title')}</Text>
                <Pressable onPress={onCloseStockCalendar} style={styles.iconButton}>
                  <X size={18} color="#6b7280" />
                </Pressable>
              </View>
              <View style={styles.calendarNav}>
                <Pressable onPress={onPrevCalendarMonth} style={styles.calendarNavButton}>
                  <ChevronLeft size={18} color="#6b7280" />
                </Pressable>
                <Text style={styles.calendarMonthText}>{calendarMonthLabel}</Text>
                <Pressable onPress={onNextCalendarMonth} style={styles.calendarNavButton}>
                  <ChevronRight size={18} color="#6b7280" />
                </Pressable>
              </View>
              <View style={styles.calendarWeekRow}>
                {weekdayLabels.map((label) => (
                  <Text key={label} style={styles.calendarWeekText}>
                    {label}
                  </Text>
                ))}
              </View>
              <View style={styles.calendarGrid}>
                {calendarCells.map((date, index) => {
                  if (!date) {
                    return <View key={`empty-${index}`} style={styles.calendarCellEmpty} />;
                  }
                  const key = formatDateKey(date);
                  const stat = calendarStats[key];
                  const totalServings = stat?.totalServings ?? 0;
                  const allCompleted = stat?.allCompleted ?? false;
                  const hasAnyPot = (stat?.potCount ?? 0) > 0;
                  const label = hasAnyPot ? (allCompleted ? t('ui.calendar_muscle') : `${totalServings}`) : '';
                  return (
                    <Pressable
                      key={key}
                      style={styles.calendarCell}
                      onPress={() => {
                        if (totalServings <= 0) return;
                        onOpenCalendarDetail(key);
                      }}
                    >
                      <View style={[styles.calendarBadge, { backgroundColor: getHeatColor(totalServings) }]}>
                        <Text style={styles.calendarBadgeText}>{label}</Text>
                      </View>
                      <Text style={styles.calendarDayText}>{date.getDate()}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      {showCalendarDetail ? (
        <Modal visible transparent animationType="slide" onRequestClose={onCloseCalendarDetail}>
          <Pressable style={styles.drawerBackdrop} onPress={onCloseCalendarDetail}>
            <Pressable style={styles.drawerCard} onPress={() => null}>
              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>
                  {calendarDetailDateKey
                    ? dateFromKey(calendarDetailDateKey).toLocaleDateString(language)
                    : t('ui.calendar_title')}
                </Text>
                <Pressable onPress={onCloseCalendarDetail} style={styles.iconButton}>
                  <X size={18} color="#6b7280" />
                </Pressable>
              </View>
              {calendarDetailEntries.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitleLarge}>{t('ui.calendar_empty')}</Text>
                </View>
              ) : (
                <View style={styles.calendarDetailList}>
                  {calendarDetailEntries.map((entry) => {
                    const baseName = t(potBases.find((b) => b.id === entry.potBase)?.name || '');
                    return (
                      <View key={entry.id} style={styles.calendarDetailRow}>
                        <View style={styles.calendarDetailInfo}>
                          <Text style={styles.calendarDetailTitle}>{baseName}</Text>
                          <Text style={styles.calendarDetailHint}>
                            {t('ui.remaining_meals', {
                              remaining: entry.servingsLeft,
                              total: entry.servingsTotal,
                            })}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </>
  );
};

export const DashboardModals = memo(DashboardModalsComponent);
