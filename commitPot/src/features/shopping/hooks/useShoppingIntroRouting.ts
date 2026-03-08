import { Dispatch, SetStateAction, useEffect } from 'react';

type AppScreen = 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';

type UseShoppingIntroRoutingParams = {
  screen: AppScreen;
  skipShoppingIntro: boolean;
  setShowShoppingIntro: Dispatch<SetStateAction<boolean>>;
};

export function useShoppingIntroRouting({
  screen,
  skipShoppingIntro,
  setShowShoppingIntro,
}: UseShoppingIntroRoutingParams) {
  useEffect(() => {
    if (screen === 'shopping' && !skipShoppingIntro) {
      setShowShoppingIntro(true);
    }
  }, [screen, skipShoppingIntro, setShowShoppingIntro]);
}
