import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Animated } from 'react-native';
import { normalizeLanguage } from '../../../../i18n';

type SynergySummaryMode = 'ai' | 'custom';

type SynergySummaryState = {
  reason: string;
  mode: SynergySummaryMode;
  recommendedVeggies: string[];
};

type Params = {
  screen: 'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards';
  step: number;
  synergySummary: SynergySummaryState | null;
  setSynergySummary: Dispatch<SetStateAction<SynergySummaryState | null>>;
  language: string;
  resolvedLanguage?: string;
  t: (key: string) => string;
  reasonMap: Record<
    string,
    { en: string; vi: string; es: string; it: string; pt: string; ko: string; zh: string; id: string }
  >;
};

export const useRecommendationFeedback = ({
  screen,
  step,
  synergySummary,
  setSynergySummary,
  language,
  resolvedLanguage,
  t,
  reasonMap,
}: Params) => {
  const [autoRecommendedVeggies, setAutoRecommendedVeggies] = useState<string[]>([]);
  const hasShownAutoVegHudRef = useRef(false);
  const [showAutoVegMiniToast, setShowAutoVegMiniToast] = useState(false);
  const [showAutoVegHud, setShowAutoVegHud] = useState(false);
  const autoVegMiniToastOpacity = useRef(new Animated.Value(0)).current;
  const autoVegMiniToastTranslateY = useRef(new Animated.Value(-12)).current;
  const autoVegMiniToastScale = useRef(new Animated.Value(0.97)).current;
  const autoVegHudOpacity = useRef(new Animated.Value(0)).current;
  const autoVegHudTranslateY = useRef(new Animated.Value(20)).current;
  const autoVegHudScale = useRef(new Animated.Value(0.96)).current;

  const hasShownSynergyIntroHudRef = useRef(false);
  const [showSynergyIntroHud, setShowSynergyIntroHud] = useState(false);
  const synergyIntroHudOpacity = useRef(new Animated.Value(0)).current;
  const synergyIntroHudTranslateY = useRef(new Animated.Value(20)).current;
  const synergyIntroHudScale = useRef(new Animated.Value(0.96)).current;

  const autoVegToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const synergyIntroHudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const synergyCardOpacity = useRef(new Animated.Value(0)).current;
  const synergyCardScale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    return () => {
      if (autoVegToastTimerRef.current) {
        clearTimeout(autoVegToastTimerRef.current);
      }
      if (synergyIntroHudTimerRef.current) {
        clearTimeout(synergyIntroHudTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (screen === 'builder') return;
    hasShownAutoVegHudRef.current = false;
    hasShownSynergyIntroHudRef.current = false;
    setShowAutoVegMiniToast(false);
    setShowAutoVegHud(false);
    setShowSynergyIntroHud(false);
  }, [screen]);

  useEffect(() => {
    if (screen === 'builder' && step === 4) return;
    hasShownSynergyIntroHudRef.current = false;
    setShowSynergyIntroHud(false);
    if (synergyIntroHudTimerRef.current) {
      clearTimeout(synergyIntroHudTimerRef.current);
      synergyIntroHudTimerRef.current = null;
    }
  }, [screen, step]);

  const triggerSynergyIntroHud = useCallback(() => {
    if (synergyIntroHudTimerRef.current) {
      clearTimeout(synergyIntroHudTimerRef.current);
      synergyIntroHudTimerRef.current = null;
    }

    setShowSynergyIntroHud(true);
    synergyIntroHudOpacity.stopAnimation();
    synergyIntroHudTranslateY.stopAnimation();
    synergyIntroHudScale.stopAnimation();
    synergyIntroHudOpacity.setValue(0);
    synergyIntroHudTranslateY.setValue(20);
    synergyIntroHudScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(synergyIntroHudOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(synergyIntroHudTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(synergyIntroHudScale, {
        toValue: 1,
        damping: 12,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();

    synergyIntroHudTimerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(synergyIntroHudOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(synergyIntroHudScale, {
          toValue: 0.95,
          damping: 16,
          stiffness: 220,
          mass: 0.9,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowSynergyIntroHud(false);
      });
    }, 2000);
  }, [synergyIntroHudOpacity, synergyIntroHudScale, synergyIntroHudTranslateY]);

  useEffect(() => {
    const shouldShow =
      screen === 'builder' &&
      step === 4 &&
      synergySummary?.mode === 'ai' &&
      Boolean(synergySummary.reason);
    if (!shouldShow || hasShownSynergyIntroHudRef.current) return;
    hasShownSynergyIntroHudRef.current = true;
    triggerSynergyIntroHud();
  }, [screen, step, synergySummary?.mode, synergySummary?.reason, triggerSynergyIntroHud]);

  const localizedSynergyReason = useMemo(() => {
    const reason = synergySummary?.reason;
    if (!reason) return '';

    const lang = normalizeLanguage(resolvedLanguage || language || 'ja');
    if (lang === 'ja') return reason;

    const mapped = reasonMap[reason];
    if (mapped) return mapped[lang] ?? mapped.en;

    if (reason.startsWith('fallback:')) {
      return t('ui.synergy_reason_fallback');
    }

    return t('ui.synergy_reason_generic');
  }, [language, reasonMap, resolvedLanguage, synergySummary?.reason, t]);

  const synergyCardAnimatedStyle = useMemo(
    () => ({
      opacity: synergyCardOpacity,
      transform: [{ scale: synergyCardScale }],
    }),
    [synergyCardOpacity, synergyCardScale]
  );

  const animateSynergySummaryCard = useCallback(() => {
    synergyCardOpacity.stopAnimation();
    synergyCardScale.stopAnimation();
    synergyCardOpacity.setValue(0);
    synergyCardScale.setValue(0.98);
    Animated.parallel([
      Animated.timing(synergyCardOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(synergyCardScale, {
        toValue: 1,
        damping: 14,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [synergyCardOpacity, synergyCardScale]);

  const markSynergySummaryAsCustom = useCallback(() => {
    setSynergySummary((prev) => {
      if (!prev || prev.mode === 'custom') return prev;
      return { ...prev, mode: 'custom' };
    });
  }, [setSynergySummary]);

  const triggerAutoVegFeedback = useCallback(
    (recommendedIds: string[]) => {
      setAutoRecommendedVeggies(recommendedIds);

      if (autoVegToastTimerRef.current) {
        clearTimeout(autoVegToastTimerRef.current);
      }

      const shouldShowHud = !hasShownAutoVegHudRef.current;
      if (shouldShowHud) {
        hasShownAutoVegHudRef.current = true;
        setShowAutoVegMiniToast(false);
        setShowAutoVegHud(true);
        autoVegMiniToastOpacity.stopAnimation();
        autoVegMiniToastTranslateY.stopAnimation();
        autoVegMiniToastScale.stopAnimation();
        autoVegHudOpacity.stopAnimation();
        autoVegHudTranslateY.stopAnimation();
        autoVegHudScale.stopAnimation();
        autoVegHudOpacity.setValue(0);
        autoVegHudTranslateY.setValue(20);
        autoVegHudScale.setValue(0.96);

        Animated.parallel([
          Animated.timing(autoVegHudOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(autoVegHudTranslateY, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.spring(autoVegHudScale, {
            toValue: 1,
            damping: 12,
            stiffness: 220,
            mass: 0.8,
            useNativeDriver: true,
          }),
        ]).start();

        autoVegToastTimerRef.current = setTimeout(() => {
          Animated.parallel([
            Animated.timing(autoVegHudOpacity, {
              toValue: 0,
              duration: 220,
              useNativeDriver: true,
            }),
            Animated.spring(autoVegHudScale, {
              toValue: 0.95,
              damping: 16,
              stiffness: 220,
              mass: 0.9,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowAutoVegHud(false);
          });
        }, 1500);
        return;
      }

      setShowAutoVegHud(false);
      setShowAutoVegMiniToast(true);
      autoVegHudOpacity.stopAnimation();
      autoVegHudTranslateY.stopAnimation();
      autoVegHudScale.stopAnimation();
      autoVegMiniToastOpacity.stopAnimation();
      autoVegMiniToastTranslateY.stopAnimation();
      autoVegMiniToastScale.stopAnimation();
      autoVegMiniToastOpacity.setValue(0);
      autoVegMiniToastTranslateY.setValue(-12);
      autoVegMiniToastScale.setValue(0.97);

      Animated.parallel([
        Animated.timing(autoVegMiniToastOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(autoVegMiniToastTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(autoVegMiniToastScale, {
          toValue: 1,
          damping: 12,
          stiffness: 220,
          mass: 0.8,
          useNativeDriver: true,
        }),
      ]).start();

      autoVegToastTimerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(autoVegMiniToastOpacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(autoVegMiniToastTranslateY, {
            toValue: -8,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowAutoVegMiniToast(false);
        });
      }, 1500);
    },
    [
      autoVegHudOpacity,
      autoVegHudScale,
      autoVegHudTranslateY,
      autoVegMiniToastOpacity,
      autoVegMiniToastScale,
      autoVegMiniToastTranslateY,
    ]
  );

  return {
    autoRecommendedVeggies,
    setAutoRecommendedVeggies,
    showAutoVegMiniToast,
    showAutoVegHud,
    showSynergyIntroHud,
    autoVegMiniToastOpacity,
    autoVegMiniToastTranslateY,
    autoVegMiniToastScale,
    autoVegHudOpacity,
    autoVegHudTranslateY,
    autoVegHudScale,
    synergyIntroHudOpacity,
    synergyIntroHudTranslateY,
    synergyIntroHudScale,
    localizedSynergyReason,
    synergyCardAnimatedStyle,
    animateSynergySummaryCard,
    markSynergySummaryAsCustom,
    triggerAutoVegFeedback,
  };
};
