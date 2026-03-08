import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BookOpen, Plus, User, Utensils } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type DashboardHeaderActionsProps = {
  t: TFunc;
  styles: any;
  languageButton: React.ReactNode;
  smallButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  cardButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  cardPressRetention: { top: number; right: number; bottom: number; left: number };
  onOpenOnboarding: () => void;
  onStartBuilder: () => void;
  onOpenCards: () => void;
};

const DashboardHeaderActionsComponent = ({
  t,
  styles,
  languageButton,
  smallButtonHitSlop,
  cardButtonHitSlop,
  cardPressRetention,
  onOpenOnboarding,
  onStartBuilder,
  onOpenCards,
}: DashboardHeaderActionsProps) => {
  return (
    <>
      <View style={styles.dashboardHeader}>
        <View style={styles.dashboardTitleRow}>
          <View style={styles.dashboardIcon}>
            <Utensils size={20} color="#ffffff" strokeWidth={3} />
          </View>
          <Text style={styles.dashboardTitle}>{t('ui.dashboard')}</Text>
        </View>
        <View style={styles.dashboardActions}>
          {languageButton}
          <Pressable onPress={onOpenOnboarding} style={styles.roundButton} hitSlop={smallButtonHitSlop}>
            <User size={20} color="#9ca3af" />
          </Pressable>
        </View>
      </View>

      <View style={styles.grid2}>
        <Pressable
          onPress={onStartBuilder}
          style={[styles.actionCard, styles.actionPrimary]}
          hitSlop={cardButtonHitSlop}
          pressRetentionOffset={cardPressRetention}
        >
          <View style={styles.actionIconWrap}>
            <Plus size={30} color="#ffffff" strokeWidth={3} />
          </View>
          <Text style={styles.actionText}>{t('ui.make_new_pot')}</Text>
        </Pressable>
        <Pressable
          onPress={onOpenCards}
          style={[styles.actionCard, styles.actionSecondary]}
          hitSlop={cardButtonHitSlop}
          pressRetentionOffset={cardPressRetention}
        >
          <View style={styles.actionIconWrapSecondary}>
            <BookOpen size={30} color="#9ca3af" />
          </View>
          <Text style={styles.actionTextDark}>{t('ui.food_dictionary')}</Text>
        </Pressable>
      </View>
    </>
  );
};

export const DashboardHeaderActions = memo(DashboardHeaderActionsComponent);
