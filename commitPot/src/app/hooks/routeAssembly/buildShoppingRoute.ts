type BuildShoppingRouteParams = {
  plans: any;
  shoppingScreenData: any;
  smallButtonHitSlop: any;
  isCompactScreen: boolean;
  SectionTitle: any;
  formatUnits: (...args: any[]) => string;
  setScreen: any;
  setCookStep: any;
  showShoppingIntro: boolean;
  skipShoppingIntro: boolean;
  setShowShoppingIntro: any;
  setSkipShoppingIntro: any;
};

export function buildShoppingRoute(params: BuildShoppingRouteParams) {
  return {
    plans: params.plans,
    shoppingScreenData: params.shoppingScreenData,
    smallButtonHitSlop: params.smallButtonHitSlop,
    isCompactScreen: params.isCompactScreen,
    SectionTitle: params.SectionTitle,
    formatUnits: params.formatUnits,
    setScreen: params.setScreen,
    setCookStep: params.setCookStep,
    showShoppingIntro: params.showShoppingIntro,
    skipShoppingIntro: params.skipShoppingIntro,
    setShowShoppingIntro: params.setShowShoppingIntro,
    setSkipShoppingIntro: params.setSkipShoppingIntro,
  };
}
