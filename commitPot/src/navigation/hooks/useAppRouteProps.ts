import { useMemo } from 'react';
import {
  buildAppScreenRouterProps,
  BuildAppScreenRouterParams,
} from '../buildAppScreenRouterProps';

export function useAppRouteProps(params: BuildAppScreenRouterParams) {
  const { onboarding, dashboard, builder, cards, shopping, cook } = params;
  return useMemo(
    () => buildAppScreenRouterProps(params),
    [onboarding, dashboard, builder, cards, shopping, cook]
  );
}
