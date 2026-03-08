import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { CommitListRow } from '../../common/components/CommitListRow';

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

type PFCLike = {
  protein: number;
  fat: number;
  carbs: number;
};

type PlanTotalsLike = {
  servings: number;
  totalP: number;
  totalF: number;
  totalC: number;
  totalKcal: number;
} | null;

type CardComponent = (props: { children: React.ReactNode; style?: object }) => React.ReactElement;

type StepPlanSummaryProps = {
  t: TFunc;
  styles: any;
  Card: CardComponent;
  mealShare: number;
  targetPFC: PFCLike;
  currentPlanTotals: PlanTotalsLike;
  currentPlanShoppingEntries: ShoppingEntryLike[];
  currentPlanSeasoningEntries: SeasoningEntryLike[];
  isCompactScreen: boolean;
  formatUnits: (units: number | null, unitName?: string) => string;
  onConfirmPlan: () => void;
  onRedoPlan: () => void;
};

const StepPlanSummaryComponent = ({
  t,
  styles,
  Card,
  mealShare,
  targetPFC,
  currentPlanTotals,
  currentPlanShoppingEntries,
  currentPlanSeasoningEntries,
  isCompactScreen,
  formatUnits,
  onConfirmPlan,
  onRedoPlan,
}: StepPlanSummaryProps) => {
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.commitTitle}>{t('ui.commit_pot_title')}</Text>

      <Card style={styles.darkCard}>
        <View style={styles.labelRow}>
          <ShoppingBag size={12} color="#f97316" />
          <Text style={styles.darkPanelLabelText}>{t('ui.ingredient_amounts')}</Text>
        </View>
        {currentPlanShoppingEntries.map((entry) => (
          <CommitListRow
            key={entry.id}
            styles={styles}
            isCompactScreen={isCompactScreen}
            title={entry.name}
            amount={`${entry.roundedGrams}g`}
            detail={entry.units ? formatUnits(entry.units, entry.unitName) : undefined}
          />
        ))}
        <Text style={styles.listSectionLabel}>{t('ui.seasonings')}</Text>
        {currentPlanSeasoningEntries.map((seasoning) => (
          <CommitListRow
            key={seasoning.id}
            styles={styles}
            isCompactScreen={isCompactScreen}
            title={seasoning.name}
            amount={seasoning.amountLabel ?? `${seasoning.grams}g`}
            detail={seasoning.note}
          />
        ))}
      </Card>

      <View style={styles.cardStack}>
        <Card style={styles.sideCard}>
          <Text style={styles.sideCardTitle}>{t('ui.ideal_balance_title')}</Text>
          <Text style={styles.sideCardNote}>{t('ui.ideal_balance_note')}</Text>
          <View style={styles.pfcRow}>
            <View style={styles.pfcCell}>
              <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
              <Text style={styles.pfcValueDark}>{Math.round(targetPFC.protein * mealShare)}g</Text>
            </View>
            <View style={styles.pfcCell}>
              <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
              <Text style={styles.pfcValueDark}>{Math.round(targetPFC.fat * mealShare)}g</Text>
            </View>
            <View style={styles.pfcCell}>
              <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
              <Text style={styles.pfcValueDark}>{Math.round(targetPFC.carbs * mealShare)}g</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.sideCardAccent}>
          <Text style={styles.sideCardTitleAccent}>{t('ui.actual_balance_title')}</Text>
          {currentPlanTotals ? (
            <>
              <View style={styles.pfcRow}>
                <View style={styles.pfcCell}>
                  <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
                  <Text style={styles.pfcValueAccent}>{Math.round(currentPlanTotals.totalP / currentPlanTotals.servings)}g</Text>
                </View>
                <View style={styles.pfcCell}>
                  <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                  <Text style={styles.pfcValueAccent}>{Math.round(currentPlanTotals.totalF / currentPlanTotals.servings)}g</Text>
                </View>
                <View style={styles.pfcCell}>
                  <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                  <Text style={styles.pfcValueAccent}>{Math.round(currentPlanTotals.totalC / currentPlanTotals.servings)}g</Text>
                </View>
              </View>
              <View style={styles.pfcRow}>
                <View style={styles.pfcCell}>
                  <Text style={styles.pfcLabel}>{t('ui.stat_calories')}</Text>
                  <Text style={styles.pfcValueAccent}>{Math.round(currentPlanTotals.totalKcal / currentPlanTotals.servings)}kcal</Text>
                </View>
              </View>
            </>
          ) : null}
        </Card>
      </View>

      <View style={styles.sectionBlock}>
        <Pressable onPress={onConfirmPlan} style={styles.primaryButtonInline}>
          <Text style={styles.primaryButtonText}>{t('ui.confirm_plan')}</Text>
        </Pressable>
        <Pressable onPress={onRedoPlan} style={styles.linkButton}>
          <Text style={styles.linkButtonText}>{t('ui.redo_plan')}</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const StepPlanSummary = memo(StepPlanSummaryComponent);
