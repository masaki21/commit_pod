import React, { memo } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Trash2 } from 'lucide-react-native';
import { Plan, PotBase } from '../../../../types';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type CardComponent = (props: { children: React.ReactNode; style?: object }) => React.ReactElement;
type SectionTitleComponent = (props: { children: React.ReactNode; subtitle?: string }) => React.ReactElement;

type DashboardStockSectionProps = {
  t: TFunc;
  styles: any;
  plans: Plan[];
  potBases: Array<{ id: PotBase; name: string }>;
  potBaseImages: Record<PotBase, any>;
  cardButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  smallButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  cardPressRetention: { top: number; right: number; bottom: number; left: number };
  Card: CardComponent;
  SectionTitle: SectionTitleComponent;
  onOpenBalance: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onOpenShopping: (planId: string) => void;
  onConsumeServing: (planId: string) => void;
  onOpenCalendar: () => void;
};

const DashboardStockSectionComponent = ({
  t,
  styles,
  plans,
  potBases,
  potBaseImages,
  cardButtonHitSlop,
  smallButtonHitSlop,
  cardPressRetention,
  Card,
  SectionTitle,
  onOpenBalance,
  onDeletePlan,
  onOpenShopping,
  onConsumeServing,
  onOpenCalendar,
}: DashboardStockSectionProps) => {
  const { width } = useWindowDimensions();
  const isNarrowScreen = width <= 375;

  return (
    <View>
      <View style={styles.dashboardSectionSpacer}>
        <SectionTitle>{t('ui.stock_status')}</SectionTitle>
      </View>
      {plans.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>{t('ui.stock_empty_title')}</Text>
          <Text style={styles.emptyText}>{t('ui.stock_empty_text')}</Text>
        </View>
      ) : (
        <View style={styles.cardStack}>
          {plans.map((plan) => (
            <Card key={plan.id}>
              <View style={[styles.planRow, isNarrowScreen && styles.planRowCompact]}>
                <Pressable
                  onPress={() => onOpenBalance(plan.id)}
                  style={[styles.planSummaryButton, isNarrowScreen && styles.planSummaryButtonCompact]}
                  hitSlop={cardButtonHitSlop}
                  pressRetentionOffset={cardPressRetention}
                >
                  <Image
                    source={potBaseImages[(plan.potBase || 'yose') as PotBase]}
                    style={[styles.planBaseImage, isNarrowScreen && styles.planBaseImageCompact]}
                    contentFit="cover"
                    transition={150}
                  />
                  <View style={styles.planInfo}>
                    <View style={[styles.planTagRow, isNarrowScreen && styles.planTagRowCompact]}>
                      <Text
                        style={[styles.planTag, isNarrowScreen && styles.planTagCompact]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {t(potBases.find((b) => b.id === plan.potBase)?.name || '')}
                      </Text>
                      <Text
                        style={[styles.planDate, isNarrowScreen && styles.planDateCompact]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[styles.planTitle, isNarrowScreen && styles.planTitleCompact]}
                      numberOfLines={isNarrowScreen ? 1 : 2}
                      ellipsizeMode="tail"
                    >
                      {t('ui.remaining_meals', {
                        remaining: Number.isFinite(plan.remaining) ? plan.remaining : plan.servings,
                        total: plan.servings,
                      })}
                    </Text>
                  </View>
                </Pressable>
                <View style={[styles.planActions, isNarrowScreen && styles.planActionsCompact]}>
                  <Pressable
                    onPress={() => onDeletePlan(plan.id)}
                    style={[styles.lightButton, isNarrowScreen && styles.lightButtonCompact]}
                    hitSlop={smallButtonHitSlop}
                    pressRetentionOffset={cardPressRetention}
                  >
                    <Trash2 size={16} color="#6b7280" />
                  </Pressable>
                  <Pressable
                    onPress={() => onOpenShopping(plan.id)}
                    style={[styles.shopButton, isNarrowScreen && styles.shopButtonCompact]}
                    hitSlop={smallButtonHitSlop}
                    pressRetentionOffset={cardPressRetention}
                  >
                    <Text
                      style={[styles.shopButtonText, isNarrowScreen && styles.shopButtonTextCompact]}
                      numberOfLines={1}
                    >
                      {t('ui.shop_label')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onConsumeServing(plan.id)}
                    style={[styles.darkButton, isNarrowScreen && styles.darkButtonCompact]}
                    hitSlop={smallButtonHitSlop}
                    pressRetentionOffset={cardPressRetention}
                  >
                    <Text style={[styles.darkButtonText, isNarrowScreen && styles.darkButtonTextCompact]}>
                      {t('ui.ate')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
      <Pressable
        style={styles.calendarButton}
        onPress={onOpenCalendar}
        hitSlop={cardButtonHitSlop}
        pressRetentionOffset={cardPressRetention}
      >
        <Text style={styles.calendarButtonText}>{t('ui.calendar_view')}</Text>
      </Pressable>
    </View>
  );
};

export const DashboardStockSection = memo(DashboardStockSectionComponent);
