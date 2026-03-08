type BuildCardsRouteParams = {
  setScreen: any;
  smallButtonHitSlop: any;
  Card: any;
  parseEffectSections: (effectText: string) => string[];
};

export function buildCardsRoute(params: BuildCardsRouteParams) {
  return {
    setScreen: params.setScreen,
    smallButtonHitSlop: params.smallButtonHitSlop,
    Card: params.Card,
    parseEffectSections: params.parseEffectSections,
  };
}
