import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Home, ShoppingBag, User } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type DashboardBottomNavProps = {
  t: TFunc;
  styles: any;
  androidBottomInset: number;
  onGoShopping: () => void;
  onGoStats: () => void;
};

const DashboardBottomNavComponent = ({
  t,
  styles,
  androidBottomInset,
  onGoShopping,
  onGoStats,
}: DashboardBottomNavProps) => {
  return (
    <View pointerEvents="box-none" style={[styles.bottomNav, { bottom: androidBottomInset }]}>
      <View pointerEvents="none" style={styles.navItemActive}>
        <Home size={24} color="#f97316" strokeWidth={2.5} />
        <Text style={styles.navLabelActive}>{t('ui.nav_home')}</Text>
      </View>
      <Pressable style={styles.navItem} onPress={onGoShopping} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <ShoppingBag size={24} color="#d1d5db" />
        <Text style={styles.navLabel}>{t('ui.nav_shop')}</Text>
      </Pressable>
      <Pressable style={styles.navItem} onPress={onGoStats} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <User size={24} color="#d1d5db" />
        <Text style={styles.navLabel}>{t('ui.nav_stats')}</Text>
      </Pressable>
    </View>
  );
};

export const DashboardBottomNav = memo(DashboardBottomNavComponent);
