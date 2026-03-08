import React from 'react';
import { AppScreenRouter } from './src/navigation/AppScreenRouter';
import { styles } from './src/styles/appStyles';
import { useAppController } from './src/app/hooks/useAppController';

export default function App() {
  const {
    screen,
    t,
    language,
    isWeb,
    wrapContent,
    languageButton,
    languageModal,
    onboardingRouteProps,
    dashboardRouteProps,
    builderRouteProps,
    cardsRouteProps,
    shoppingRouteProps,
    cookRouteProps,
    authGateScreen,
  } = useAppController();

  if (authGateScreen) return authGateScreen;

  return (
    <AppScreenRouter
      screen={screen}
      t={t}
      language={language}
      styles={styles}
      isWeb={isWeb}
      wrapContent={wrapContent}
      languageButton={languageButton}
      languageModal={languageModal}
      onboarding={onboardingRouteProps}
      dashboard={dashboardRouteProps}
      builder={builderRouteProps}
      cards={cardsRouteProps}
      shopping={shoppingRouteProps}
      cook={cookRouteProps}
    />
  );
}
