import React from 'react';
import { BuilderScreenContent } from '../../features/plan-builder/components/BuilderScreenContent';
import { BaseRouterProps, BuilderRouteProps } from '../routeTypes';

type BuilderRouteViewProps = Pick<BaseRouterProps, 't' | 'styles' | 'isWeb' | 'wrapContent'> & {
  builder: BuilderRouteProps;
};

export function BuilderRoute({ t, styles, isWeb, wrapContent, builder }: BuilderRouteViewProps) {
  return (
    <BuilderScreenContent
      t={t}
      styles={styles}
      isWeb={isWeb}
      wrapContent={wrapContent}
      step={builder.step}
      setStep={builder.setStep}
      setScreen={builder.setScreen}
      smallButtonHitSlop={builder.smallButtonHitSlop}
      ProgressBar={builder.ProgressBar}
      SectionTitle={builder.SectionTitle}
      currentPlan={builder.currentPlan}
      setCurrentPlan={builder.setCurrentPlan}
      normalizePlanForPotBase={builder.normalizePlanForPotBase}
      potBaseImages={builder.potBaseImages}
      getIngredientsForPotBase={builder.getIngredientsForPotBase}
      onToggleProtein={builder.onToggleProtein}
      mushroomIds={builder.mushroomIds}
      synergySummary={builder.synergySummary}
      localizedSynergyReason={builder.localizedSynergyReason}
      synergyCardAnimatedStyle={builder.synergyCardAnimatedStyle}
      autoRecommendedVeggies={builder.autoRecommendedVeggies}
      onMarkCustom={builder.onMarkCustom}
      onSetAutoRecommendedVeggies={builder.onSetAutoRecommendedVeggies}
      onRestoreAiRecommendation={builder.onRestoreAiRecommendation}
      getEffectLead={builder.getEffectLead}
      Card={builder.Card}
      mealShare={builder.mealShare}
      targetPFC={builder.targetPFC}
      currentPlanTotals={builder.currentPlanTotals}
      currentPlanShoppingEntries={builder.currentPlanShoppingEntries}
      currentPlanSeasoningEntries={builder.currentPlanSeasoningEntries}
      isCompactScreen={builder.isCompactScreen}
      formatUnits={builder.formatUnits}
      skipPlanConfirm={builder.skipPlanConfirm}
      showPlanConfirm={builder.showPlanConfirm}
      setShowPlanConfirm={builder.setShowPlanConfirm}
      onFinishPlan={builder.onFinishPlan}
      showFiveServingsModal={builder.showFiveServingsModal}
      setShowFiveServingsModal={builder.setShowFiveServingsModal}
      skipFiveServingsModal={builder.skipFiveServingsModal}
      setSkipFiveServingsModal={builder.setSkipFiveServingsModal}
      setSkipPlanConfirm={builder.setSkipPlanConfirm}
      fiveServingsPotImage={builder.fiveServingsPotImage}
      showAutoVegMiniToast={builder.showAutoVegMiniToast}
      autoVegMiniToastOpacity={builder.autoVegMiniToastOpacity}
      autoVegMiniToastTranslateY={builder.autoVegMiniToastTranslateY}
      autoVegMiniToastScale={builder.autoVegMiniToastScale}
      showAutoVegHud={builder.showAutoVegHud}
      autoVegHudOpacity={builder.autoVegHudOpacity}
      autoVegHudTranslateY={builder.autoVegHudTranslateY}
      autoVegHudScale={builder.autoVegHudScale}
      showSynergyIntroHud={builder.showSynergyIntroHud}
      synergyIntroHudOpacity={builder.synergyIntroHudOpacity}
      synergyIntroHudTranslateY={builder.synergyIntroHudTranslateY}
      synergyIntroHudScale={builder.synergyIntroHudScale}
    />
  );
}
