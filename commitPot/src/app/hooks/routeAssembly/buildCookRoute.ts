type BuildCookRouteParams = {
  cookStep: number;
  setCookStep: any;
  setScreen: any;
  cookScrollRef: any;
  smallButtonHitSlop: any;
  Card: any;
  ProgressBar: any;
};

export function buildCookRoute(params: BuildCookRouteParams) {
  return {
    cookStep: params.cookStep,
    setCookStep: params.setCookStep,
    setScreen: params.setScreen,
    cookScrollRef: params.cookScrollRef,
    smallButtonHitSlop: params.smallButtonHitSlop,
    Card: params.Card,
    ProgressBar: params.ProgressBar,
  };
}
