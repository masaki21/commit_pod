import React, { memo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react-native';
import { ShoppingListCard } from '../../common/components/ShoppingListCard';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type SectionTitleComponent = (props: { children: React.ReactNode; subtitle?: string }) => React.ReactElement;

type ShoppingEntry = {
  id: string;
  name: string;
  roundedGrams?: number;
  units?: number;
  unitName?: string;
  amountLabel?: string;
  grams?: number;
  note?: string;
};

type ShoppingScreenContentProps = {
  t: TFunc;
  styles: any;
  plansLength: number;
  shoppingEntriesLength: number;
  seasoningEntriesLength: number;
  proteinEntries: ShoppingEntry[];
  vegEntries: ShoppingEntry[];
  carbEntries: ShoppingEntry[];
  seasoningEntries: ShoppingEntry[];
  smallButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  isCompactScreen: boolean;
  SectionTitle: SectionTitleComponent;
  formatUnits: (units: number, unitName?: string) => string;
  onBack: () => void;
  onStartPrep: () => void;
};

type ShoppingCategorySectionProps = {
  t: TFunc;
  styles: any;
  titleKey: string;
  entries: ShoppingEntry[];
  isCompactScreen: boolean;
  SectionTitle: SectionTitleComponent;
  formatUnits: (units: number, unitName?: string) => string;
  isSeasoning?: boolean;
};

const ShoppingCategorySectionComponent = ({
  t,
  styles,
  titleKey,
  entries,
  isCompactScreen,
  SectionTitle,
  formatUnits,
  isSeasoning = false,
}: ShoppingCategorySectionProps) => (
  <View>
    <SectionTitle>{t(titleKey)}</SectionTitle>
    <View style={styles.cardStack}>
      {entries.map((entry) => (
        <ShoppingListCard
          key={entry.id}
          styles={styles}
          isCompactScreen={isCompactScreen}
          title={entry.name}
          amount={
            isSeasoning ? (entry.amountLabel ?? `${entry.grams ?? 0}g`) : `${entry.roundedGrams ?? 0}g`
          }
          detail={
            isSeasoning ? entry.note : entry.units ? formatUnits(entry.units, entry.unitName) : undefined
          }
        />
      ))}
    </View>
  </View>
);

const ShoppingCategorySection = memo(ShoppingCategorySectionComponent);

const ShoppingScreenContentComponent = ({
  t,
  styles,
  plansLength,
  shoppingEntriesLength,
  seasoningEntriesLength,
  proteinEntries,
  vegEntries,
  carbEntries,
  seasoningEntries,
  smallButtonHitSlop,
  isCompactScreen,
  SectionTitle,
  formatUnits,
  onBack,
  onStartPrep,
}: ShoppingScreenContentProps) => {
  const isEmpty = plansLength === 0 || (shoppingEntriesLength === 0 && seasoningEntriesLength === 0);

  return (
    <ScrollView
      contentContainerStyle={styles.screenPad}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <View style={styles.pageTitleRow}>
        <Pressable onPress={onBack} style={styles.squareButtonLight} hitSlop={smallButtonHitSlop}>
          <ChevronLeft size={24} color="#111827" strokeWidth={3} />
        </Pressable>
        <Text style={styles.pageTitleSimple}>{t('ui.shopping_list_title')}</Text>
      </View>

      {isEmpty ? (
        <View style={styles.emptyState}>
          <ShoppingBag size={80} color="#d1d5db" />
          <Text style={styles.emptyTitleLarge}>{t('ui.shopping_empty_title')}</Text>
        </View>
      ) : (
        <View style={styles.cardStack}>
          <ShoppingCategorySection
            t={t}
            styles={styles}
            titleKey="ui.tab_protein"
            entries={proteinEntries}
            isCompactScreen={isCompactScreen}
            SectionTitle={SectionTitle}
            formatUnits={formatUnits}
          />

          <ShoppingCategorySection
            t={t}
            styles={styles}
            titleKey="ui.tab_veg"
            entries={vegEntries}
            isCompactScreen={isCompactScreen}
            SectionTitle={SectionTitle}
            formatUnits={formatUnits}
          />

          <ShoppingCategorySection
            t={t}
            styles={styles}
            titleKey="ui.tab_carb"
            entries={carbEntries}
            isCompactScreen={isCompactScreen}
            SectionTitle={SectionTitle}
            formatUnits={formatUnits}
          />

          <ShoppingCategorySection
            t={t}
            styles={styles}
            titleKey="ui.tab_seasoning"
            entries={seasoningEntries}
            isCompactScreen={isCompactScreen}
            SectionTitle={SectionTitle}
            formatUnits={formatUnits}
            isSeasoning
          />

          <Pressable onPress={onStartPrep} style={styles.primaryButtonInline}>
            <Text style={styles.primaryButtonText}>{t('ui.start_prep_mode')}</Text>
            <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export const ShoppingScreenContent = memo(ShoppingScreenContentComponent);
