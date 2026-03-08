import React from 'react';
import { SafeAreaView } from 'react-native';
import { INGREDIENTS } from '../../../constants';
import { CardsScreenContent } from '../../features/cards/components/CardsScreenContent';
import { BaseRouterProps, CardsRouteProps } from '../routeTypes';

type CardsRouteViewProps = Pick<BaseRouterProps, 't' | 'styles' | 'isWeb' | 'wrapContent'> & {
  cards: CardsRouteProps;
};

export function CardsRoute({ t, styles, isWeb, wrapContent, cards }: CardsRouteViewProps) {
  return (
    <SafeAreaView style={[styles.safeArea, styles.screenLight, isWeb && styles.webRoot]}>
      {wrapContent(
        <CardsScreenContent
          t={t}
          styles={styles}
          ingredients={INGREDIENTS}
          smallButtonHitSlop={cards.smallButtonHitSlop}
          Card={cards.Card}
          parseEffectSections={cards.parseEffectSections}
          onBack={() => cards.setScreen('dashboard')}
        />
      )}
    </SafeAreaView>
  );
}
