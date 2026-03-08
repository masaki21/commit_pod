import { Dispatch, SetStateAction, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseUiPreferenceFlagsParams = {
  setSkipFiveServingsModal: Dispatch<SetStateAction<boolean>>;
  setSkipPlanConfirm: Dispatch<SetStateAction<boolean>>;
  setSkipShoppingIntro: Dispatch<SetStateAction<boolean>>;
};

export function useUiPreferenceFlags({
  setSkipFiveServingsModal,
  setSkipPlanConfirm,
  setSkipShoppingIntro,
}: UseUiPreferenceFlagsParams) {
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('five_servings_modal_skip')
      .then((value) => {
        if (!mounted) return;
        setSkipFiveServingsModal(value === 'true');
      })
      .catch(() => {
        // ignore storage errors
      });
    return () => {
      mounted = false;
    };
  }, [setSkipFiveServingsModal]);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem('plan_confirm_skip')
      .then((value) => {
        if (!mounted) return;
        setSkipPlanConfirm(value === 'true');
      })
      .catch(() => {
        // ignore storage errors
      });
    AsyncStorage.getItem('shop_intro_skip')
      .then((value) => {
        if (!mounted) return;
        setSkipShoppingIntro(value === 'true');
      })
      .catch(() => {
        // ignore storage errors
      });
    return () => {
      mounted = false;
    };
  }, [setSkipPlanConfirm, setSkipShoppingIntro]);
}
