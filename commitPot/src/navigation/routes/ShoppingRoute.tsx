import React, { memo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native';
import { ShoppingScreenContent } from '../../features/shopping/components/ShoppingScreenContent';
import { ShoppingIntroModal } from '../../features/shopping/components/ShoppingIntroModal';
import { BaseRouterProps, ShoppingRouteProps } from '../routeTypes';

type ShoppingRouteViewProps = Pick<BaseRouterProps, 't' | 'styles' | 'isWeb' | 'wrapContent'> & {
  shopping: ShoppingRouteProps;
};

function ShoppingRouteComponent({ t, styles, isWeb, wrapContent, shopping }: ShoppingRouteViewProps) {
  const { shoppingEntries, seasoningEntries, proteinEntries, vegEntries, carbEntries } = shopping.shoppingScreenData;
  const {
    setScreen,
    setCookStep,
    setShowShoppingIntro,
    setSkipShoppingIntro,
    skipShoppingIntro,
    showShoppingIntro,
  } = shopping;

  const handleBack = useCallback(() => {
    setScreen('dashboard');
  }, [setScreen]);

  const handleStartPrep = useCallback(() => {
    setCookStep(0);
    setScreen('cook');
  }, [setCookStep, setScreen]);

  const handleCloseIntro = useCallback(() => {
    setShowShoppingIntro(false);
  }, [setShowShoppingIntro]);

  const handleToggleSkip = useCallback(() => {
    setSkipShoppingIntro((prev) => !prev);
  }, [setSkipShoppingIntro]);

  const handleConfirmIntro = useCallback(async () => {
    setShowShoppingIntro(false);
    try {
      await AsyncStorage.setItem('shop_intro_skip', skipShoppingIntro ? 'true' : 'false');
    } catch {
      // ignore storage errors
    }
  }, [setShowShoppingIntro, skipShoppingIntro]);

  return (
    <SafeAreaView style={[styles.safeArea, styles.screenLight, isWeb && styles.webRoot]}>
      {wrapContent(
        <ShoppingScreenContent
          t={t}
          styles={styles}
          plansLength={shopping.plans.length}
          shoppingEntriesLength={shoppingEntries.length}
          seasoningEntriesLength={seasoningEntries.length}
          proteinEntries={proteinEntries}
          vegEntries={vegEntries}
          carbEntries={carbEntries}
          seasoningEntries={seasoningEntries}
          smallButtonHitSlop={shopping.smallButtonHitSlop}
          isCompactScreen={shopping.isCompactScreen}
          SectionTitle={shopping.SectionTitle}
          formatUnits={shopping.formatUnits}
          onBack={handleBack}
          onStartPrep={handleStartPrep}
        />
      )}

      {showShoppingIntro ? (
        <ShoppingIntroModal
          t={t}
          styles={styles}
          visible
          skipChecked={skipShoppingIntro}
          onRequestClose={handleCloseIntro}
          onToggleSkip={handleToggleSkip}
          onConfirm={handleConfirmIntro}
        />
      ) : null}
    </SafeAreaView>
  );
}

export const ShoppingRoute = memo(ShoppingRouteComponent);
