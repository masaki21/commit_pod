import React, { memo, useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native';
import { CookScreenContent } from '../../features/cook/components/CookScreenContent';
import { COOK_STEPS } from '../../features/cook/constants/cookSteps';
import { BaseRouterProps, CookRouteProps } from '../routeTypes';

type CookRouteViewProps = Pick<BaseRouterProps, 't' | 'styles' | 'isWeb' | 'wrapContent'> & {
  cook: CookRouteProps;
};

function CookRouteComponent({ t, styles, isWeb, wrapContent, cook }: CookRouteViewProps) {
  const { cookStep, setCookStep, setScreen } = cook;
  const currentCookData = useMemo(() => COOK_STEPS[cookStep], [cookStep]);

  const handleBack = useCallback(() => {
    if (cookStep > 0) {
      setCookStep(cookStep - 1);
      return;
    }
    setScreen('dashboard');
  }, [cookStep, setCookStep, setScreen]);

  const handleNext = useCallback(() => {
    if (cookStep < COOK_STEPS.length - 1) {
      setCookStep(cookStep + 1);
      return;
    }
    setScreen('dashboard');
  }, [cookStep, setCookStep, setScreen]);

  return (
    <SafeAreaView style={[styles.safeArea, isWeb && styles.webRoot]}>
      {wrapContent(
        <CookScreenContent
          t={t}
          styles={styles}
          cookStep={cookStep}
          totalSteps={COOK_STEPS.length}
          currentCookData={currentCookData}
          cookScrollRef={cook.cookScrollRef}
          smallButtonHitSlop={cook.smallButtonHitSlop}
          Card={cook.Card}
          ProgressBar={cook.ProgressBar}
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </SafeAreaView>
  );
}

export const CookRoute = memo(CookRouteComponent);
