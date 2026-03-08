import React from 'react';
import { SplashScreen } from '../features/onboarding/components/SplashScreen';
import { OnboardingScreen } from '../features/onboarding/components/OnboardingScreen';
import { DashboardRoute } from './routes/DashboardRoute';
import { BuilderRoute } from './routes/BuilderRoute';
import { CardsRoute } from './routes/CardsRoute';
import { ShoppingRoute } from './routes/ShoppingRoute';
import { CookRoute } from './routes/CookRoute';
import { AppScreenRouterProps } from './routeTypes';

export function AppScreenRouter({
  screen,
  t,
  language,
  styles,
  isWeb,
  wrapContent,
  languageButton,
  languageModal,
  onboarding,
  dashboard,
  builder,
  cards,
  shopping,
  cook,
}: AppScreenRouterProps) {
  if (screen === 'splash') {
    return <SplashScreen t={t} styles={styles} isWeb={isWeb} wrapContent={wrapContent} />;
  }

  if (screen === 'onboarding') {
    return (
      <OnboardingScreen
        t={t}
        styles={styles}
        isWeb={isWeb}
        wrapContent={wrapContent}
        languageButton={languageButton}
        languageModal={languageModal}
        profile={onboarding.profile}
        setProfile={onboarding.setProfile}
        parseNumericInput={onboarding.parseNumericInput}
        profileLimits={onboarding.profileLimits}
        showValidationErrors={onboarding.showValidationErrors}
        setShowValidationErrors={onboarding.setShowValidationErrors}
        onboardingStep={onboarding.onboardingStep}
        setOnboardingStep={onboarding.setOnboardingStep}
        tdee={onboarding.tdee}
        targetPFC={onboarding.targetPFC}
        accountDeleting={onboarding.accountDeleting}
        onSignOut={onboarding.onSignOut}
        onDeleteAccount={onboarding.onDeleteAccount}
        onSaveProfile={onboarding.onSaveProfile}
      />
    );
  }

  if (screen === 'dashboard') {
    return (
      <DashboardRoute
        t={t}
        language={language}
        styles={styles}
        isWeb={isWeb}
        wrapContent={wrapContent}
        languageButton={languageButton}
        languageModal={languageModal}
        dashboard={dashboard}
      />
    );
  }

  if (screen === 'builder') {
    return <BuilderRoute t={t} styles={styles} isWeb={isWeb} wrapContent={wrapContent} builder={builder} />;
  }

  if (screen === 'cards') {
    return <CardsRoute t={t} styles={styles} isWeb={isWeb} wrapContent={wrapContent} cards={cards} />;
  }

  if (screen === 'shopping') {
    return <ShoppingRoute t={t} styles={styles} isWeb={isWeb} wrapContent={wrapContent} shopping={shopping} />;
  }

  if (screen === 'cook') {
    return <CookRoute t={t} styles={styles} isWeb={isWeb} wrapContent={wrapContent} cook={cook} />;
  }

  return null;
}
