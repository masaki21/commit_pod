import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Droplets,
  Flame,
  Globe,
  Home,
  Layers,
  Plus,
  Scissors,
  ShoppingBag,
  Snowflake,
  Target,
  Trash2,
  User,
  Utensils,
  Zap,
  X,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { INGREDIENTS, POT_BASES } from './constants';
import {
  SupportedLanguage,
  clearStoredLanguage,
  getDeviceLanguage,
  loadStoredLanguage,
  saveStoredLanguage,
} from './i18n';
import { ActivityLevel, Gender, Goal, PFC, Plan, PotBase, UserProfile } from './types';
import { supabase } from './supabase';

type IngredientCategory = 'protein' | 'veg' | 'carb';
type ServingCount = 2 | 5;

type NutritionPer100g = {
  kcalPer100g: number;
  pPer100g: number;
  fPer100g: number;
  cPer100g: number;
};

type PotHistoryEntry = {
  id: string;
  createdAt: string;
  createdAtKey: string;
  servingsTotal: number;
  servingsLeft: number;
  potBase: PotBase;
  completedAtKey?: string | null;
};

type SeasoningDefinition = {
  id: string;
  name: string;
  gramsByServings: Record<ServingCount, number>;
  nutrition: NutritionPer100g;
  note?: string;
  noteByServings?: Partial<Record<ServingCount, string>>;
  amountLabelByServings?: Partial<Record<ServingCount, string>>;
};

const POT_BASE_INGREDIENT_IDS: Partial<Record<PotBase, Record<IngredientCategory, string[]>>> = {
  miso: {
    protein: ['p1', 'p2', 'p6', 'p4', 'p7'],
    veg: ['v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10'],
    carb: ['c3', 'c4', 'c5'],
  },
  kimchi: {
    protein: ['p1', 'p8', 'p9', 'p4', 'p7'],
    veg: ['v1', 'v5', 'v11', 'v7', 'v8', 'v3', 'v10'],
    carb: ['c3', 'c6', 'c7'],
  },
  yose: {
    protein: ['p1', 'p10', 'p3', 'p2', 'p4'],
    veg: ['v1', 'v12', 'v11', 'v13', 'v8', 'v3', 'v9'],
    carb: ['c3', 'c2', 'c5'],
  },
};

const POT_BASE_IMAGES: Record<PotBase, import('react-native').ImageSourcePropType> = {
  miso: require('./assets/nabe_base/miso.jpg'),
  kimchi: require('./assets/nabe_base/kimchi.jpg'),
  yose: require('./assets/nabe_base/yose.jpg'),
};
const FIVE_SERVINGS_POT_IMAGE = require('./assets/nabe_base/five_servings_pot.jpg');

const SHIMAYA_POWDER_NUTRITION: NutritionPer100g = {
  kcalPer100g: 205,
  pPer100g: 14.25,
  fPer100g: 0.125,
  cPer100g: 36.875,
};

const POT_BASE_SEASONINGS: Record<PotBase, SeasoningDefinition[]> = {
  miso: [
    {
      id: 's_miso',
      name: 'seasonings.miso_mix',
      gramsByServings: { 2: 70, 5: 175 },
      nutrition: { kcalPer100g: 194, pPer100g: 10.8, fPer100g: 4.1, cPer100g: 27.1 },
      noteByServings: {
        2: 'seasonings.note_miso_2',
        5: 'seasonings.note_miso_5',
      },
    },
    {
      id: 's_chicken',
      name: 'seasonings.chicken_stock',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_chicken_2',
        5: 'seasonings.note_chicken_5',
      },
    },
    {
      id: 's_ginger',
      name: 'seasonings.ginger_tube',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_ginger_2',
        5: 'seasonings.note_ginger_5',
      },
    },
  ],
  kimchi: [
    {
      id: 's_kimchi_soup',
      name: 'seasonings.shimaya_kimchi',
      gramsByServings: { 2: 20, 5: 50 },
      nutrition: SHIMAYA_POWDER_NUTRITION,
      amountLabelByServings: {
        2: 'seasonings.amount_label_2',
        5: 'seasonings.amount_label_5',
      },
      noteByServings: {
        2: 'seasonings.note_nabe_2',
        5: 'seasonings.note_nabe_5',
      },
    },
    {
      id: 's_chicken',
      name: 'seasonings.chicken_stock',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_chicken_2',
        5: 'seasonings.note_chicken_5',
      },
    },
  ],
  yose: [
    {
      id: 's_yose_soup',
      name: 'seasonings.shimaya_yose',
      gramsByServings: { 2: 20, 5: 50 },
      nutrition: SHIMAYA_POWDER_NUTRITION,
      amountLabelByServings: {
        2: 'seasonings.amount_label_2',
        5: 'seasonings.amount_label_5',
      },
      noteByServings: {
        2: 'seasonings.note_nabe_2',
        5: 'seasonings.note_nabe_5',
      },
    },
    {
      id: 's_chicken',
      name: 'seasonings.chicken_stock',
      gramsByServings: { 2: 2, 5: 5 },
      nutrition: { kcalPer100g: 0, pPer100g: 0, fPer100g: 0, cPer100g: 0 },
      noteByServings: {
        2: 'seasonings.note_chicken_2',
        5: 'seasonings.note_chicken_5',
      },
    },
  ],
};

const getIngredientsForPotBase = (potBase: PotBase, category: IngredientCategory) => {
  const allowed = POT_BASE_INGREDIENT_IDS[potBase]?.[category];
  return INGREDIENTS.filter(
    (ing) => ing.category === category && (!allowed || allowed.includes(ing.id))
  );
};

const normalizePlanForPotBase = (
  plan: { proteins: string[]; veggies: string[]; carb: string },
  potBase: PotBase
) => {
  const allowedProtein = POT_BASE_INGREDIENT_IDS[potBase]?.protein;
  const allowedVeg = POT_BASE_INGREDIENT_IDS[potBase]?.veg;
  const allowedCarb = POT_BASE_INGREDIENT_IDS[potBase]?.carb;
  return {
    proteins: allowedProtein ? plan.proteins.filter((id) => allowedProtein.includes(id)) : plan.proteins,
    veggies: allowedVeg ? plan.veggies.filter((id) => allowedVeg.includes(id)) : plan.veggies,
    carb: allowedCarb && plan.carb && !allowedCarb.includes(plan.carb) ? '' : plan.carb,
  };
};

const parseEffectSections = (
  effect: string,
  fallbackTitle: string
): { title: string; body: string }[] => {
  const sections = effect
    .split(/[。.]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) return null;
      const title = line.slice(0, separatorIndex).trim();
      const body = line.slice(separatorIndex + 1).trim();
      if (!title || !body) return null;
      return { title, body };
    })
    .filter((item): item is { title: string; body: string } => item !== null);

  return sections.length > 0 ? sections : [{ title: fallbackTitle, body: effect }];
};

const getEffectLead = (effect: string): string => {
  const firstSentence = effect.split(/[。.]/).find((line) => line.trim().length > 0);
  return firstSentence?.trim() || effect;
};

const MUSHROOM_IDS = new Set(['v3', 'v9', 'v10']);

type ShoppingEntry = {
  id: string;
  name: string;
  category: IngredientCategory;
  roundedGrams: number;
  units: number | null;
  unitName: string | undefined;
};

type SeasoningEntry = {
  id: string;
  name: string;
  grams: number;
  amountLabel?: string;
  note?: string;
  nutrition: NutritionPer100g;
};

const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  return Math.round(bmr);
};

const calculateTDEE = (profile: UserProfile): number => {
  const { activityLevel } = profile;
  const bmr = calculateBMR(profile);
  const factors = { low: 1.2, normal: 1.55, high: 1.725 };
  return Math.round(bmr * factors[activityLevel]);
};

const calculateTargetPFC = (profile: UserProfile, tdee: number): PFC => {
  const multipliers = { bulk: 1.1, recomp: 1.0, cut: 0.88 };
  let targetCalories = Math.round(tdee * multipliers[profile.goal]);
  const pFactor = profile.goal === 'bulk' ? 2.2 : 2.3;
  const fFactor = profile.goal === 'bulk' ? 0.95 : profile.goal === 'recomp' ? 1.8 : 2.0;
  const protein = Math.round(profile.weight * pFactor);
  const baseFat = Math.round(profile.weight * fFactor);

  const minFat = 60;
  const minCarbs = 50;

  let fat = baseFat;
  let carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);

  const applyMinimumOrder = () => {
    if (fat < minFat) {
      fat = minFat;
      carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);
    }
    if (carbs < minCarbs) {
      carbs = minCarbs;
      fat = Math.round((targetCalories - protein * 4 - carbs * 4) / 9);
    }
  };

  applyMinimumOrder();

  if (fat < minFat || carbs < minCarbs) {
    const minCalories = protein * 4 + minFat * 9 + minCarbs * 4;
    if (targetCalories < minCalories) {
      targetCalories = Math.ceil(minCalories);
    }
    fat = baseFat;
    carbs = Math.round((targetCalories - protein * 4 - fat * 9) / 4);
    applyMinimumOrder();
  }

  return { protein, fat, carbs, calories: targetCalories };
};

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.progressTrack}>
    <View style={[styles.progressFill, { width: `${(current / total) * 100}%` }]} />
  </View>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <View style={styles.sectionTitleWrap}>
    <Text style={styles.sectionTitle}>{children}</Text>
    {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
  </View>
);

const COOK_STEPS = [
  {
    titleKey: 'cook.steps.step1.title',
    descriptionKey: 'cook.steps.step1.description',
    tipKey: 'cook.tips.tip1',
    photo: require('./assets/cook_steps_optimized/step1.jpg'),
    icon: <Flame size={40} color="#dc2626" />,
    bgColor: '#fee2e2',
  },
  {
    titleKey: 'cook.steps.step2.title',
    descriptionKey: 'cook.steps.step2.description',
    tipKey: 'cook.tips.tip2',
    photo: require('./assets/cook_steps_optimized/step2.jpg'),
    icon: <Scissors size={40} color="#16a34a" />,
    bgColor: '#dcfce7',
  },
  {
    titleKey: 'cook.steps.step3.title',
    descriptionKey: 'cook.steps.step3.description',
    tipKey: 'cook.tips.tip3',
    photo: require('./assets/cook_steps_optimized/step3.jpg'),
    icon: <Layers size={40} color="#ea580c" />,
    bgColor: '#ffedd5',
  },
  {
    titleKey: 'cook.steps.step4.title',
    descriptionKey: 'cook.steps.step4.description',
    tipKey: 'cook.tips.tip4',
    photo: require('./assets/cook_steps_optimized/step4.jpg'),
    icon: <ChefHat size={40} color="#dc2626" />,
    bgColor: '#fee2e2',
  },
  {
    titleKey: 'cook.steps.step5.title',
    descriptionKey: 'cook.steps.step5.description',
    tipKey: 'cook.tips.tip5',
    photo: require('./assets/cook_steps_optimized/step5.jpg'),
    icon: <Droplets size={40} color="#2563eb" />,
    bgColor: '#dbeafe',
  },
  {
    titleKey: 'cook.steps.step6.title',
    descriptionKey: 'cook.steps.step6.description',
    tipKey: 'cook.tips.tip6',
    photo: require('./assets/cook_steps_optimized/step6.jpg'),
    icon: <CheckCircle2 size={40} color="#10b981" />,
    bgColor: '#d1fae5',
  },
  {
    titleKey: 'cook.steps.step7.title',
    descriptionKey: 'cook.steps.step7.description',
    tipKey: 'cook.tips.tip7',
    photo: require('./assets/cook_steps_optimized/step7.jpg'),
    icon: <Snowflake size={40} color="#4f46e5" />,
    bgColor: '#e0e7ff',
  },
];

export default function App() {
  const isWeb = Platform.OS === 'web';
  const { t, i18n } = useTranslation();
  const [languageMode, setLanguageMode] = useState<'auto' | SupportedLanguage>('auto');
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncLanguage = async () => {
      const stored = await loadStoredLanguage();
      if (!isMounted) return;
      if (stored) {
        setLanguageMode(stored);
        if (i18n.language !== stored) {
          await i18n.changeLanguage(stored);
        }
        return;
      }

      setLanguageMode('auto');
      const nextLanguage = getDeviceLanguage();
      if (i18n.language !== nextLanguage) {
        await i18n.changeLanguage(nextLanguage);
      }
    };

    void syncLanguage();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncLanguage();
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [i18n]);
  const [screen, setScreen] = useState<
    'splash' | 'onboarding' | 'dashboard' | 'builder' | 'shopping' | 'cook' | 'cards'
  >('splash');
  const [step, setStep] = useState(0);
  const [cookStep, setCookStep] = useState(0);
  const [authReady, setAuthReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPlanConfirm, setShowPlanConfirm] = useState(false);
  const [showShoppingIntro, setShowShoppingIntro] = useState(false);
  const [showPlanShopping, setShowPlanShopping] = useState(false);
  const [showPlanBalance, setShowPlanBalance] = useState(false);
  const [showStockCalendar, setShowStockCalendar] = useState(false);
  const [showFiveServingsModal, setShowFiveServingsModal] = useState(false);
  const [skipFiveServingsModal, setSkipFiveServingsModal] = useState(false);
  const [skipPlanConfirm, setSkipPlanConfirm] = useState(false);
  const [skipShoppingIntro, setSkipShoppingIntro] = useState(false);
  const [shoppingPlanId, setShoppingPlanId] = useState<string | null>(null);
  const [balancePlanId, setBalancePlanId] = useState<string | null>(null);
  const [potHistories, setPotHistories] = useState<Record<string, PotHistoryEntry>>({});
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [showCalendarDetail, setShowCalendarDetail] = useState(false);
  const [calendarDetailDateKey, setCalendarDetailDateKey] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    height: 175,
    weight: 75,
    age: 28,
    gender: 'male',
    activityLevel: 'normal',
    goal: 'recomp',
  });
  const [onboardingStep, setOnboardingStep] = useState<1 | 2>(1);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({
    servings: 5,
    potBase: 'yose',
    proteins: [],
    veggies: [],
    carb: '',
  });
  const cookScrollRef = useRef<ScrollView | null>(null);

  const POT_HISTORY_KEY = 'pot_histories_v1';

  const wrapContent = (children: React.ReactNode) =>
    isWeb ? <View style={styles.webContent}>{children}</View> : <>{children}</>;

  const tdee = useMemo(() => calculateTDEE(profile), [profile]);
  const targetPFC = useMemo(() => calculateTargetPFC(profile, tdee), [profile, tdee]);
  const MEAL_SHARE = 0.3; // 1食 = 1日の10分の3
  const languageOptions: Array<{ value: 'auto' | SupportedLanguage; label: string }> = [
    { value: 'auto', label: t('ui.language_auto') },
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'es', label: 'Español' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' },
    { value: 'ko', label: '한국어' },
    { value: 'zh', label: '中文' },
    { value: 'id', label: 'Bahasa Indonesia' },
  ];

  const handleSelectLanguage = async (value: 'auto' | SupportedLanguage) => {
    if (value === 'auto') {
      await clearStoredLanguage();
      const nextLanguage = getDeviceLanguage();
      await i18n.changeLanguage(nextLanguage);
      setLanguageMode('auto');
      setShowLanguageModal(false);
      return;
    }

    await saveStoredLanguage(value);
    await i18n.changeLanguage(value);
    setLanguageMode(value);
    setShowLanguageModal(false);
  };

  const formatUnits = (units: number | null, unitName?: string) => {
    if (!units || !unitName) return '';
    const fractionMatch = unitName.match(/^1\/(\d+)(.+)$/);
    if (fractionMatch) {
      const denominator = fractionMatch[1];
      const suffix = fractionMatch[2];
      return `${units}/${denominator}${suffix}`;
    }
    const needsSpace = /[A-Za-z]/.test(unitName);
    return `${units}${needsSpace ? ' ' : ''}${unitName}`;
  };

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const dateNumberFromKey = (key: string) => Number(key.replace(/-/g, ''));

  const dateKeyFromIso = (iso: string) => formatDateKey(new Date(iso));

  const dateFromKey = (key: string) => {
    const [year, month, day] = key.split('-').map((value) => Number(value));
    return new Date(year, month - 1, day);
  };

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' });
    return Array.from({ length: 7 }, (_, index) => formatter.format(new Date(2021, 7, 1 + index)));
  }, [i18n.language]);

  const calendarMonth = useMemo(() => {
    const base = new Date();
    return new Date(base.getFullYear(), base.getMonth() + calendarMonthOffset, 1);
  }, [calendarMonthOffset]);

  const calendarMonthLabel = useMemo(
    () =>
      calendarMonth.toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'long',
      }),
    [calendarMonth, i18n.language]
  );

  const calendarStats = useMemo(() => {
    const entries = Object.values(potHistories);
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const stats: Record<string, { totalServings: number; allCompleted: boolean; potCount: number }> = {};
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);
      const dayEntries = entries.filter((entry) => entry.createdAtKey === key);
      const totalServings = dayEntries.reduce((sum, entry) => sum + entry.servingsTotal, 0);
      const allCompleted =
        dayEntries.length > 0 && dayEntries.every((entry) => Number(entry.servingsLeft) <= 0);
      stats[key] = { totalServings, allCompleted, potCount: dayEntries.length };
    }
    return stats;
  }, [calendarMonth, potHistories]);

  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }
    return cells;
  }, [calendarMonth]);

  const getHeatColor = (count: number) => {
    if (count <= 0) return '#f3f4f6';
    if (count === 1) return '#bbf7d0';
    if (count === 2) return '#4ade80';
    return '#16a34a';
  };

  const calendarDetailEntries = useMemo(() => {
    if (!calendarDetailDateKey) return [] as PotHistoryEntry[];
    return Object.values(potHistories)
      .filter((entry) => entry.createdAtKey === calendarDetailDateKey)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }, [calendarDetailDateKey, potHistories]);

  const languageButton = (
    <Pressable style={styles.languageButton} onPress={() => setShowLanguageModal(true)}>
      <Globe size={16} color="#6b7280" />
      <Text style={styles.languageButtonText}>{t('ui.language')}</Text>
    </Pressable>
  );

  const languageModal = (
    <Modal visible={showLanguageModal} transparent animationType="fade">
      <Pressable style={styles.languageBackdrop} onPress={() => setShowLanguageModal(false)}>
        <Pressable style={styles.languageModalCard} onPress={() => null}>
          <Text style={styles.languageModalTitle}>{t('ui.language_title')}</Text>
          <View style={styles.languageList}>
            {languageOptions.map((option) => {
              const active = languageMode === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelectLanguage(option.value)}
                  style={[styles.languageOptionRow, active && styles.languageOptionActive]}
                >
                  <Text style={styles.languageOptionText}>{option.label}</Text>
                  {active ? <Check size={16} color="#f97316" strokeWidth={3} /> : null}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  useEffect(() => {
    if (screen !== 'cook') return;
    const id = requestAnimationFrame(() => {
      cookScrollRef.current?.scrollTo({ y: 0, animated: false });
    });
    return () => cancelAnimationFrame(id);
  }, [cookStep, screen]);

  const buildShoppingEntries = (plan: Partial<Plan>): ShoppingEntry[] => {
    const servings = plan.servings || 5;
    const totalTargetP = targetPFC.protein * MEAL_SHARE * servings;
    const totalTargetC = targetPFC.carbs * MEAL_SHARE * servings;
    const vegPerMeal = profile.goal === 'bulk' ? 200 : profile.goal === 'recomp' ? 250 : 300;
    const totalVegG = vegPerMeal * servings;

    const proteinIds = plan.proteins || [];
    const vegIds = plan.veggies || [];
    const carbId = plan.carb || '';

    const proteinShare = proteinIds.length > 0 ? totalTargetP / 2 : 0;
    const vegShare = vegIds.length > 0 ? totalVegG / 3 : 0;

    const entries: { id: string; grams: number }[] = [];

    proteinIds.forEach((id) => {
      const ing = INGREDIENTS.find((i) => i.id === id);
      if (!ing || ing.pPer100g === 0) return;
      const grams = Math.round(proteinShare / (ing.pPer100g / 100));
      entries.push({ id, grams });
    });

    vegIds.forEach((id) => {
      const ing = INGREDIENTS.find((i) => i.id === id);
      if (!ing) return;
      const grams = Math.round(vegShare);
      entries.push({ id, grams });
    });

    if (carbId) {
      const ing = INGREDIENTS.find((i) => i.id === carbId);
      if (ing && ing.cPer100g !== 0) {
        const grams = Math.round(totalTargetC / (ing.cPer100g / 100));
        entries.push({ id: carbId, grams });
      }
    }

    return entries
      .map(({ id, grams }) => {
        const ing = INGREDIENTS.find((i) => i.id === id);
        if (!ing) return null;
        const roundedGrams = Math.round(grams / 10) * 10;
        const units =
          ing.unitWeight && ing.unitName ? Math.ceil(roundedGrams / ing.unitWeight) : null;
        return {
          id,
          name: t(ing.name),
          category: proteinIds.includes(id) ? 'protein' : vegIds.includes(id) ? 'veg' : 'carb',
          roundedGrams,
          units,
          unitName: ing.unitName ? t(ing.unitName) : undefined,
        };
      })
      .filter((entry): entry is ShoppingEntry => Boolean(entry));
  };

  const getSeasoningEntries = (plan: Partial<Plan>): SeasoningEntry[] => {
    const potBase = (plan.potBase || 'yose') as PotBase;
    const servings = (plan.servings === 2 ? 2 : 5) as ServingCount;
    return (POT_BASE_SEASONINGS[potBase] || []).map((seasoning) => {
      const amountLabelKey = seasoning.amountLabelByServings?.[servings];
      return {
        id: seasoning.id,
        name: t(seasoning.name),
        grams: seasoning.gramsByServings[servings],
        amountLabel: amountLabelKey ? t(amountLabelKey) : undefined,
        note: seasoning.noteByServings?.[servings]
          ? t(seasoning.noteByServings[servings] as string)
          : seasoning.note
            ? t(seasoning.note)
            : undefined,
        nutrition: seasoning.nutrition,
      };
    });
  };

  const calculatePlanTotals = (
    plan: Partial<Plan>,
    overrideTargetPFC: typeof targetPFC = targetPFC
  ) => {
    const servings = plan.servings || 5;
    const totalTargetP = overrideTargetPFC.protein * MEAL_SHARE * servings;
    const totalTargetC = overrideTargetPFC.carbs * MEAL_SHARE * servings;
    const vegPerMeal = profile.goal === 'bulk' ? 200 : profile.goal === 'recomp' ? 225 : 250;
    const totalVegG = vegPerMeal * servings;

    const proteinIds = plan.proteins || [];
    const vegIds = plan.veggies || [];
    const carbId = plan.carb || '';

    const proteinShare = proteinIds.length > 0 ? totalTargetP / 2 : 0;
    const vegShare = vegIds.length > 0 ? totalVegG / 3 : 0;

    let totalP = 0;
    let totalF = 0;
    let totalC = 0;
    let totalKcal = 0;

    proteinIds.forEach((id) => {
      const ing = INGREDIENTS.find((i) => i.id === id);
      if (!ing || ing.pPer100g === 0) return;
      const grams = proteinShare / (ing.pPer100g / 100);
      totalP += (grams * ing.pPer100g) / 100;
      totalF += (grams * ing.fPer100g) / 100;
      totalC += (grams * ing.cPer100g) / 100;
      totalKcal += (grams * ing.kcalPer100g) / 100;
    });

    vegIds.forEach((id) => {
      const ing = INGREDIENTS.find((i) => i.id === id);
      if (!ing) return;
      const grams = vegShare;
      totalP += (grams * ing.pPer100g) / 100;
      totalF += (grams * ing.fPer100g) / 100;
      totalC += (grams * ing.cPer100g) / 100;
      totalKcal += (grams * ing.kcalPer100g) / 100;
    });

    getSeasoningEntries(plan).forEach((seasoning) => {
      const grams = seasoning.grams;
      totalP += (grams * seasoning.nutrition.pPer100g) / 100;
      totalF += (grams * seasoning.nutrition.fPer100g) / 100;
      totalC += (grams * seasoning.nutrition.cPer100g) / 100;
      totalKcal += (grams * seasoning.nutrition.kcalPer100g) / 100;
    });

    if (carbId) {
      const ing = INGREDIENTS.find((i) => i.id === carbId);
      if (ing && ing.cPer100g !== 0) {
        const grams = totalTargetC / (ing.cPer100g / 100);
        totalP += (grams * ing.pPer100g) / 100;
        totalF += (grams * ing.fPer100g) / 100;
        totalC += (grams * ing.cPer100g) / 100;
        totalKcal += (grams * ing.kcalPer100g) / 100;
      }
    }
    return { servings, totalP, totalF, totalC, totalKcal };
  };

  const selectedShoppingPlan = shoppingPlanId
    ? plans.find((plan) => plan.id === shoppingPlanId)
    : null;
  const selectedBalancePlan = balancePlanId
    ? plans.find((plan) => plan.id === balancePlanId)
    : null;

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
        setAuthReady(true);
      })
      .catch(() => setAuthReady(true));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

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
  }, []);

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
  }, []);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(POT_HISTORY_KEY)
      .then((value) => {
        if (!mounted) return;
        if (!value) return;
        const parsed = JSON.parse(value) as Record<string, PotHistoryEntry>;
        setPotHistories(parsed);
      })
      .catch(() => {
        // ignore storage errors
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(POT_HISTORY_KEY, JSON.stringify(potHistories)).catch(() => {
      // ignore storage errors
    });
  }, [potHistories]);

  useEffect(() => {
    if (screen !== 'splash') return;
    if (!authReady) return;
    const timer = setTimeout(() => {
      setScreen(session?.user ? 'dashboard' : 'onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [screen, authReady, session?.user]);

  useEffect(() => {
    if (screen === 'shopping' && !skipShoppingIntro) {
      setShowShoppingIntro(true);
    }
  }, [screen, skipShoppingIntro]);

  useEffect(() => {
    if (!session?.user) return;
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('height, weight, age, gender, activity_level, goal')
        .eq('user_id', session.user.id)
        .single();
      if (data) {
        setProfile({
          height: data.height,
          weight: data.weight,
          age: data.age,
          gender: data.gender,
          activityLevel: data.activity_level,
          goal: data.goal,
        });
      }
    };
    const loadPlans = async () => {
      const { data } = await supabase
        .from('plans')
        .select('id, servings, remaining, pot_base, proteins, veggies, carb, created_at, target_pfc')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (data) {
        setPlans(
          data.map((row) => ({
            id: row.id,
            servings: row.servings,
            remaining: typeof row.remaining === 'number' ? row.remaining : row.servings,
            potBase: row.pot_base,
            proteins: row.proteins,
            veggies: row.veggies,
            carb: row.carb,
            createdAt: row.created_at,
            targetPFC: row.target_pfc,
          }))
        );
      }
    };
    loadProfile();
    loadPlans();
  }, [session?.user]);

  useEffect(() => {
    if (plans.length === 0) return;
    setPotHistories((prev) => {
      let changed = false;
      const next = { ...prev };
      plans.forEach((plan) => {
        const existing = next[plan.id];
        const nextLeft = Number.isFinite(plan.remaining) ? plan.remaining : plan.servings;
        if (!existing) {
          next[plan.id] = {
            id: plan.id,
            createdAt: plan.createdAt,
            createdAtKey: dateKeyFromIso(plan.createdAt),
            servingsTotal: plan.servings,
            servingsLeft: nextLeft,
            potBase: plan.potBase,
            completedAtKey: null,
          };
          changed = true;
          return;
        }
        if (
          existing.servingsLeft !== nextLeft ||
          existing.servingsTotal !== plan.servings ||
          existing.potBase !== plan.potBase
        ) {
          next[plan.id] = {
            ...existing,
            servingsLeft: nextLeft,
            servingsTotal: plan.servings,
            potBase: plan.potBase,
          };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [plans]);

  const handleStartBuilder = () => {
    setStep(1);
    setCurrentPlan({ servings: 5, potBase: 'yose', proteins: [], veggies: [], carb: '' });
    setScreen('builder');
  };

  const handleFinishPlan = async () => {
    const newPlan: Plan = {
      id: Math.random().toString(36).slice(2, 11),
      servings: currentPlan.servings as 2 | 5,
      remaining: currentPlan.servings as 2 | 5,
      potBase: currentPlan.potBase as PotBase,
      proteins: currentPlan.proteins!,
      veggies: currentPlan.veggies!,
      carb: currentPlan.carb!,
      createdAt: new Date().toISOString(),
      targetPFC,
    };
    if (session?.user) {
      const { data, error } = await supabase
        .from('plans')
        .insert({
          user_id: session.user.id,
          servings: newPlan.servings,
          remaining: newPlan.remaining,
          pot_base: newPlan.potBase,
          proteins: newPlan.proteins,
          veggies: newPlan.veggies,
          carb: newPlan.carb,
          target_pfc: newPlan.targetPFC,
        })
        .select()
        .single();
      if (!error && data) {
        setPotHistories((prev) => ({
          ...prev,
          [data.id]: {
            id: data.id,
            createdAt: data.created_at,
            createdAtKey: dateKeyFromIso(data.created_at),
            servingsTotal: data.servings,
            servingsLeft: data.remaining ?? data.servings,
            potBase: data.pot_base,
            completedAtKey: null,
          },
        }));
        setPlans([
          {
            id: data.id,
            servings: data.servings,
            remaining: data.remaining ?? data.servings,
            potBase: data.pot_base,
            proteins: data.proteins,
            veggies: data.veggies,
            carb: data.carb,
            createdAt: data.created_at,
            targetPFC: data.target_pfc,
          },
          ...plans,
        ]);
      } else {
        setPotHistories((prev) => ({
          ...prev,
          [newPlan.id]: {
            id: newPlan.id,
            createdAt: newPlan.createdAt,
            createdAtKey: dateKeyFromIso(newPlan.createdAt),
            servingsTotal: newPlan.servings,
            servingsLeft: newPlan.remaining,
            potBase: newPlan.potBase,
            completedAtKey: null,
          },
        }));
        setPlans([newPlan, ...plans]);
      }
    } else {
      setPotHistories((prev) => ({
        ...prev,
        [newPlan.id]: {
          id: newPlan.id,
          createdAt: newPlan.createdAt,
          createdAtKey: dateKeyFromIso(newPlan.createdAt),
          servingsTotal: newPlan.servings,
          servingsLeft: newPlan.remaining,
          potBase: newPlan.potBase,
          completedAtKey: null,
        },
      }));
      setPlans([newPlan, ...plans]);
    }
    setScreen('dashboard');
  };

  const consumeServing = async (planId: string) => {
    const targetPlan = plans.find((plan) => plan.id === planId);
    if (!targetPlan) return;

    const currentRemaining = Number.isFinite(targetPlan.remaining)
      ? targetPlan.remaining
      : targetPlan.servings;
    const nextRemaining = Math.max(currentRemaining - 1, 0);

    if (!session?.user) {
      Alert.alert(t('alerts.login_required_title'), t('alerts.login_required_body'));
      return;
    }

    if (nextRemaining === 0) {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', session.user.id);
      if (error) {
        Alert.alert(t('alerts.update_failed'), error.message);
        return;
      }
      const completedAtKey = formatDateKey(new Date());
      setPotHistories((prev) => {
        const existing = prev[planId];
        return {
          ...prev,
          [planId]: {
            ...(existing ?? {
              id: planId,
              createdAt: new Date().toISOString(),
              createdAtKey: completedAtKey,
              servingsTotal: targetPlan.servings,
              servingsLeft: 0,
              potBase: targetPlan.potBase,
            }),
            servingsLeft: 0,
            completedAtKey,
          },
        };
      });
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
    } else {
      const { data, error } = await supabase
        .from('plans')
        .update({ remaining: nextRemaining })
        .eq('id', planId)
        .eq('user_id', session.user.id)
        .select('id, remaining')
        .single();
      if (error) {
        Alert.alert(t('alerts.update_failed'), error.message);
        return;
      }
      setPlans((prev) =>
        prev.map((plan) => (plan.id === planId ? { ...plan, remaining: data.remaining } : plan))
      );
      setPotHistories((prev) => {
        const existing = prev[planId];
        if (!existing) return prev;
        return {
          ...prev,
          [planId]: {
            ...existing,
            servingsLeft: data.remaining,
          },
        };
      });
    }

    Alert.alert(t('alerts.energy_done_title'), t('alerts.energy_done_body'));
  };

  const handleDeletePlan = (planId: string) => {
    const performDelete = async () => {
      if (session?.user) {
        await supabase.from('plans').delete().eq('id', planId).eq('user_id', session.user.id);
      }
      const completedAtKey = formatDateKey(new Date());
      setPotHistories((prev) => {
        const existing = prev[planId];
        return {
          ...prev,
          [planId]: {
            ...(existing ?? {
              id: planId,
              createdAt: new Date().toISOString(),
              createdAtKey: completedAtKey,
              servingsTotal: 0,
              servingsLeft: 0,
              potBase: 'yose',
            }),
            servingsLeft: 0,
            completedAtKey,
          },
        };
      });
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
    };

    if (Platform.OS === 'web') {
      const ok = window.confirm(t('alerts.delete_pot_confirm'));
      if (ok) void performDelete();
      return;
    }

    Alert.alert(t('alerts.delete_pot_title'), t('alerts.delete_pot_body'), [
      { text: t('alerts.cancel'), style: 'cancel' },
      { text: t('alerts.delete'), style: 'destructive', onPress: performDelete },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!session?.user) {
      setScreen('dashboard');
      return;
    }
    const computedBmr = calculateBMR(profile);
    const computedTdee = calculateTDEE(profile);
    const computedTarget = calculateTargetPFC(profile, computedTdee);
    await supabase.from('profiles').upsert({
      user_id: session.user.id,
      height: profile.height,
      weight: profile.weight,
      age: profile.age,
      gender: profile.gender,
      activity_level: profile.activityLevel,
      goal: profile.goal,
      bmr: computedBmr,
      tdee: computedTdee,
      target_calories: computedTarget.calories,
      target_pfc: computedTarget,
    });
    setScreen('dashboard');
  };

  const handleAuth = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (authMode === 'signIn') {
      const { error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) setAuthError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email: normalizedEmail, password });
      if (error) setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setScreen('splash');
  };

  if (!authReady) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.splash, isWeb && styles.webRoot]}>
        {wrapContent(
          <>
            <View style={styles.splashIconWrap}>
              <View style={styles.splashGlow} />
              <Dumbbell size={96} color="#f97316" strokeWidth={3} />
            </View>
            <Text style={styles.splashTitle}>
              COMMIT <Text style={styles.splashAccent}>POT</Text>
            </Text>
            <Text style={styles.splashSubtitle}>{t('ui.subtitle')}</Text>
          </>
        )}
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={[styles.safeArea, isWeb && styles.webRoot]}>
        {wrapContent(
          <KeyboardAvoidingView
            style={styles.authWrap}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.authTopRow}>{languageButton}</View>
            <Text style={styles.authTitle}>COMMIT POT</Text>
            <Text style={styles.authSubtitle}>{t('ui.auth_subtitle')}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.authInput}
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="password"
              secureTextEntry
              style={styles.authInput}
              placeholderTextColor="#9ca3af"
            />
            {authError ? <Text style={styles.authError}>{authError}</Text> : null}
            <Pressable onPress={handleAuth} style={styles.primaryButtonInline} disabled={authLoading}>
              <Text style={styles.primaryButtonText}>
                {authMode === 'signIn' ? t('ui.sign_in') : t('ui.sign_up')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setAuthMode(authMode === 'signIn' ? 'signUp' : 'signIn')}
              style={styles.linkButton}
            >
              <Text style={styles.linkButtonText}>
                {authMode === 'signIn' ? t('ui.first_time') : t('ui.already_have_account')}
              </Text>
            </Pressable>
          </KeyboardAvoidingView>
        )}
        {languageModal}
      </SafeAreaView>
    );
  }

  if (screen === 'splash') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.splash, isWeb && styles.webRoot]}>
        {wrapContent(
          <>
            <View style={styles.splashIconWrap}>
              <View style={styles.splashGlow} />
              <Dumbbell size={96} color="#f97316" strokeWidth={3} />
            </View>
            <Text style={styles.splashTitle}>COMMIT {''}
              <Text style={styles.splashAccent}>POT</Text>
            </Text>
            <Text style={styles.splashSubtitle}>{t('ui.subtitle')}</Text>
          </>
        )}
      </SafeAreaView>
    );
  }

  if (screen === 'onboarding') {
    const canProceedStep1 =
      profile.height > 0 && profile.weight > 0 && profile.age > 0 && profile.gender;

    return (
      <SafeAreaView style={[styles.safeArea, isWeb && styles.webRoot]}>
        {wrapContent(
          <ScrollView
            style={styles.scrollFlex}
            contentContainerStyle={styles.screenPad}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerBlock}>
              <View style={styles.headerRow}>
                <Pressable onPress={handleSignOut} style={styles.ghostButton}>
                  <Text style={styles.ghostButtonText}>{t('ui.logout')}</Text>
                </Pressable>
                {languageButton}
              </View>
              <Text style={styles.headerTitle}>
              {onboardingStep === 1 ? t('ui.onboarding_step1_title') : t('ui.onboarding_step2_title')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {onboardingStep === 1
                ? t('ui.onboarding_step1_desc')
                : t('ui.onboarding_step2_desc')}
            </Text>
            <View style={styles.stepRow}>
              <Text style={styles.stepText}>
                {t('ui.step_label', { current: onboardingStep, total: 2 })}
              </Text>
              <View style={styles.stepDots}>
                <View
                  style={[
                    styles.stepDot,
                    onboardingStep === 1 ? styles.stepDotActive : styles.stepDotInactive,
                  ]}
                />
                <View
                  style={[
                    styles.stepDot,
                    onboardingStep === 2 ? styles.stepDotActive : styles.stepDotInactive,
                  ]}
                />
              </View>
            </View>
          </View>

          {onboardingStep === 1 ? (
            <>
              <View style={styles.grid2}>
                <Card style={styles.flexCard}>
                  <Text style={styles.label}>{t('ui.label_height')}</Text>
                  <TextInput
                    value={String(profile.height)}
                    onChangeText={(text) => setProfile({ ...profile, height: Number(text || 0) })}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                </Card>
                <Card style={styles.flexCard}>
                  <Text style={styles.label}>{t('ui.label_weight')}</Text>
                  <TextInput
                    value={String(profile.weight)}
                    onChangeText={(text) => setProfile({ ...profile, weight: Number(text || 0) })}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                </Card>
              </View>

              <View style={styles.grid2}>
                <Card style={styles.flexCard}>
                  <Text style={styles.label}>{t('ui.label_age')}</Text>
                  <TextInput
                    value={String(profile.age)}
                    onChangeText={(text) => setProfile({ ...profile, age: Number(text || 0) })}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                </Card>
                <Card style={styles.flexCard}>
                  <Text style={styles.label}>{t('ui.label_gender')}</Text>
                  <View style={styles.goalRow}>
                    {(['male', 'female'] as Gender[]).map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setProfile({ ...profile, gender: g })}
                        style={[
                          styles.goalButton,
                          profile.gender === g ? styles.goalButtonActive : styles.goalButtonInactive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.goalButtonText,
                            profile.gender === g && styles.goalButtonTextActive,
                          ]}
                        >
                          {g === 'male' ? t('ui.gender_male') : t('ui.gender_female')}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </Card>
              </View>
            </>
          ) : (
            <>
              <Card>
                <Text style={styles.label}>{t('ui.label_activity')}</Text>
                <View style={styles.goalRow}>
                  {(['low', 'normal', 'high'] as ActivityLevel[]).map((level) => (
                    <Pressable
                      key={level}
                      onPress={() => setProfile({ ...profile, activityLevel: level })}
                      style={[
                        styles.goalButton,
                        profile.activityLevel === level
                          ? styles.goalButtonActive
                          : styles.goalButtonInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.goalButtonText,
                          profile.activityLevel === level && styles.goalButtonTextActive,
                        ]}
                      >
                        {level === 'low'
                          ? t('ui.activity_low')
                          : level === 'normal'
                            ? t('ui.activity_normal')
                            : t('ui.activity_high')}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Card>

              <Card>
                <Text style={styles.label}>{t('ui.label_goal')}</Text>
                <View style={styles.goalRow}>
                  {(['bulk', 'recomp', 'cut'] as Goal[]).map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => setProfile({ ...profile, goal: g })}
                      style={[
                        styles.goalButton,
                        profile.goal === g ? styles.goalButtonActive : styles.goalButtonInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.goalButtonText,
                          profile.goal === g && styles.goalButtonTextActive,
                        ]}
                      >
                        {g === 'bulk'
                          ? t('ui.goal_bulk')
                          : g === 'recomp'
                            ? t('ui.goal_recomp')
                            : t('ui.goal_cut')}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Card>

              <View style={styles.darkPanel}>
                <View style={styles.darkPanelIcon}>
                  <Zap size={70} color="#ffffff" />
                </View>
                {/* <View style={styles.labelRow}>
                  <Target size={12} color="#f97316" />
                </View> */}

                <View style={styles.darkPanelRow}>
                  <View>
                    <Text style={styles.darkCaption}>{t('ui.target_calories')}</Text>
                    <Text style={styles.darkHero}>
                      {targetPFC.calories} <Text style={styles.darkHeroUnit}>kcal</Text>
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.darkCaption}>{t('ui.tdee_calories')}</Text>
                    <Text style={styles.darkSmall}>
                      {tdee} <Text style={styles.darkSmallUnit}>kcal</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.pfcRow}>
                  <View style={styles.pfcCell}>
                    <Text style={styles.pfcLabelAccent}>{t('ui.pfc_protein')}</Text>
                    <Text style={styles.pfcValue}>{targetPFC.protein}g</Text>
                  </View>
                  <View style={styles.pfcCell}>
                    <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                    <Text style={styles.pfcValue}>{targetPFC.fat}g</Text>
                  </View>
                  <View style={styles.pfcCell}>
                    <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                    <Text style={styles.pfcValue}>{targetPFC.carbs}g</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </ScrollView>
        )}

        {onboardingStep === 1 ? (
          <Pressable
            style={[styles.primaryButton, !canProceedStep1 && styles.primaryButtonDisabled]}
            onPress={() => setOnboardingStep(2)}
            disabled={!canProceedStep1}
          >
            <Text style={styles.primaryButtonText}>{t('ui.next')}</Text>
            <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
          </Pressable>
        ) : (
          <View style={styles.stepButtonRow}>
            <Pressable style={styles.secondaryButton} onPress={() => setOnboardingStep(1)}>
              <Text style={styles.secondaryButtonText}>{t('ui.back')}</Text>
            </Pressable>
            <Pressable style={styles.primaryButtonCompact} onPress={handleSaveProfile}>
              <Text style={styles.primaryButtonText}>{t('ui.commit_with_body')}</Text>
              <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
            </Pressable>
          </View>
        )}
        {languageModal}
      </SafeAreaView>
    );
  }

  if (screen === 'dashboard') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.screenLight, isWeb && styles.webRoot]}>
        {wrapContent(
          <ScrollView contentContainerStyle={styles.dashboardPad} showsVerticalScrollIndicator={false}>
            <View style={styles.dashboardHeader}>
              <View style={styles.dashboardTitleRow}>
                <View style={styles.dashboardIcon}>
                  <Utensils size={20} color="#ffffff" strokeWidth={3} />
                </View>
                <Text style={styles.dashboardTitle}>{t('ui.dashboard')}</Text>
              </View>
              <View style={styles.dashboardActions}>
                {languageButton}
                <Pressable
                  onPress={() => {
                    setOnboardingStep(1);
                    setScreen('onboarding');
                  }}
                  style={styles.roundButton}
                >
                  <User size={20} color="#9ca3af" />
                </Pressable>
              </View>
            </View>

          <View style={styles.grid2}>
            <Pressable onPress={handleStartBuilder} style={[styles.actionCard, styles.actionPrimary]}>
              <View style={styles.actionIconWrap}>
                <Plus size={30} color="#ffffff" strokeWidth={3} />
              </View>
              <Text style={styles.actionText}>{t('ui.make_new_pot')}</Text>
            </Pressable>
            <Pressable onPress={() => setScreen('cards')} style={[styles.actionCard, styles.actionSecondary]}>
              <View style={styles.actionIconWrapSecondary}>
                <BookOpen size={30} color="#9ca3af" />
              </View>
              <Text style={styles.actionTextDark}>{t('ui.food_dictionary')}</Text>
            </Pressable>
          </View>

          <View>
            <View style={styles.dashboardSectionSpacer}>
              <SectionTitle>{t('ui.stock_status')}</SectionTitle>
            </View>
            {plans.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>{t('ui.stock_empty_title')}</Text>
                <Text style={styles.emptyText}>{t('ui.stock_empty_text')}</Text>
              </View>
            ) : (
              <View style={styles.cardStack}>
                {plans.map((plan) => (
                  <Pressable
                    key={plan.id}
                    onPress={() => {
                      setBalancePlanId(plan.id);
                      setShowPlanBalance(true);
                    }}
                  >
                    <Card>
                      <View style={styles.planRow}>
                      <Image
                        source={POT_BASE_IMAGES[(plan.potBase || 'yose') as PotBase]}
                        style={styles.planBaseImage}
                        contentFit="cover"
                        transition={150}
                      />
                      <View style={styles.planInfo}>
                        <View style={styles.planTagRow}>
                          <Text style={styles.planTag}>
                            {t(POT_BASES.find((b) => b.id === plan.potBase)?.name || '')}
                          </Text>
                          <Text style={styles.planDate}>
                            {new Date(plan.createdAt).toLocaleDateString()}
                          </Text>
                        </View>
                          <Text style={styles.planTitle}>
                            {t('ui.remaining_meals', {
                              remaining: Number.isFinite(plan.remaining) ? plan.remaining : plan.servings,
                              total: plan.servings,
                            })}
                          </Text>
                      </View>
                      <View style={styles.planActions}>
                        <Pressable
                          onPress={(event) => {
                            event.stopPropagation();
                            handleDeletePlan(plan.id);
                          }}
                          style={styles.lightButton}
                        >
                          <Trash2 size={16} color="#6b7280" />
                        </Pressable>
                        <Pressable
                          onPress={(event) => {
                            event.stopPropagation();
                            setShoppingPlanId(plan.id);
                            setShowPlanShopping(true);
                          }}
                          style={styles.shopButton}
                        >
                          <Text style={styles.shopButtonText}>{t('ui.shop_label')}</Text>
                        </Pressable>
                        <Pressable
                          onPress={(event) => {
                            event.stopPropagation();
                            consumeServing(plan.id);
                          }}
                          style={styles.darkButton}
                        >
                          <Text style={styles.darkButtonText}>{t('ui.ate')}</Text>
                        </Pressable>
                      </View>
                      </View>
                    </Card>
                  </Pressable>
                ))}
              </View>
            )}
            <Pressable style={styles.calendarButton} onPress={() => setShowStockCalendar(true)}>
              <Text style={styles.calendarButtonText}>{t('ui.calendar_view')}</Text>
            </Pressable>
          </View>
          </ScrollView>
        )}

          <View style={styles.bottomNav}>
            <Pressable style={styles.navItemActive}>
              <Home size={24} color="#f97316" strokeWidth={2.5} />
              <Text style={styles.navLabelActive}>{t('ui.nav_home')}</Text>
            </Pressable>
            <Pressable style={styles.navItem} onPress={() => setScreen('shopping')}>
              <ShoppingBag size={24} color="#d1d5db" />
              <Text style={styles.navLabel}>{t('ui.nav_shop')}</Text>
            </Pressable>
            <Pressable
              style={styles.navItem}
              onPress={() => {
                setOnboardingStep(1);
                setScreen('onboarding');
              }}
            >
              <User size={24} color="#d1d5db" />
              <Text style={styles.navLabel}>{t('ui.nav_stats')}</Text>
            </Pressable>
          </View>

          <Modal
            visible={showPlanShopping}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPlanShopping(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={[styles.modalCard, styles.modalCardLarge]}>
                <View style={styles.modalTitleRow}>
                  <ShoppingBag size={16} color="#f97316" strokeWidth={2.5} />
                  <Text style={styles.modalTitle}>{t('ui.shopping_list_title')}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {(() => {
                    const plan = selectedShoppingPlan;
                    const shoppingEntries = plan ? buildShoppingEntries(plan) : [];
                    const seasoningEntries = plan ? getSeasoningEntries(plan) : [];
                    const proteinEntries = shoppingEntries.filter((entry) => entry.category === 'protein');
                    const vegEntries = shoppingEntries.filter((entry) => entry.category === 'veg');
                    const carbEntries = shoppingEntries.filter((entry) => entry.category === 'carb');

                    if (!plan || (shoppingEntries.length === 0 && seasoningEntries.length === 0)) {
                      return (
                        <View style={styles.emptyState}>
                          <ShoppingBag size={60} color="#d1d5db" />
                          <Text style={styles.emptyTitleLarge}>{t('ui.shopping_empty_title')}</Text>
                        </View>
                      );
                    }

                    return (
                      <View style={styles.cardStack}>
                        <View>
                          <SectionTitle>{t('ui.tab_protein')}</SectionTitle>
                          <View style={styles.cardStack}>
                            {proteinEntries.map((entry) => (
                              <View key={entry.id} style={styles.listCard}>
                                <Text style={styles.listCardTitle}>{entry.name}</Text>
                                <Text style={styles.listCardHint}>
                                  {entry.roundedGrams}g
                                  {entry.units ? `（${formatUnits(entry.units, entry.unitName)}）` : ''}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        <View>
                          <SectionTitle>{t('ui.tab_veg')}</SectionTitle>
                          <View style={styles.cardStack}>
                            {vegEntries.map((entry) => (
                              <View key={entry.id} style={styles.listCard}>
                                <Text style={styles.listCardTitle}>{entry.name}</Text>
                                <Text style={styles.listCardHint}>
                                  {entry.roundedGrams}g
                                  {entry.units ? `（${formatUnits(entry.units, entry.unitName)}）` : ''}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        <View>
                          <SectionTitle>{t('ui.tab_carb')}</SectionTitle>
                          <View style={styles.cardStack}>
                            {carbEntries.map((entry) => (
                              <View key={entry.id} style={styles.listCard}>
                                <Text style={styles.listCardTitle}>{entry.name}</Text>
                                <Text style={styles.listCardHint}>
                                  {entry.roundedGrams}g
                                  {entry.units ? `（${formatUnits(entry.units, entry.unitName)}）` : ''}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        <View>
                          <SectionTitle>{t('ui.tab_seasoning')}</SectionTitle>
                          <View style={styles.cardStack}>
                            {seasoningEntries.map((entry) => (
                              <View key={entry.id} style={styles.listCard}>
                                <Text style={styles.listCardTitle}>{entry.name}</Text>
                                <Text style={styles.listCardHint}>
                                  {entry.amountLabel ?? `${entry.grams}g`}
                                  {entry.note ? `（${entry.note}）` : ''}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    );
                  })()}
                </ScrollView>
                <Pressable style={styles.modalButton} onPress={() => setShowPlanShopping(false)}>
                  <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showPlanBalance}
            transparent
            animationType="fade"
            onRequestClose={() => setShowPlanBalance(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={[styles.modalCard, styles.modalCardLarge]}>
                <View style={styles.modalTitleRow}>
                  <ChefHat size={16} color="#f97316" strokeWidth={2.5} />
                  <Text style={styles.modalTitle}>
                    {selectedBalancePlan
                      ? t(POT_BASES.find((b) => b.id === selectedBalancePlan.potBase)?.name || '')
                      : t('ui.ideal_balance_title')}
                  </Text>
                </View>
                {(() => {
                  if (!selectedBalancePlan) {
                    return (
                      <View style={styles.emptyState}>
                        <Text style={styles.emptyTitleLarge}>{t('ui.shopping_empty_title')}</Text>
                      </View>
                    );
                  }

                  const planTargetPFC = selectedBalancePlan.targetPFC ?? targetPFC;
                  const { servings, totalP, totalF, totalC, totalKcal } =
                    calculatePlanTotals(selectedBalancePlan, planTargetPFC);

                  const perMealP = Math.round(totalP / servings);
                  const perMealF = Math.round(totalF / servings);
                  const perMealC = Math.round(totalC / servings);
                  const perMealKcal = Math.round(totalKcal / servings);

                  return (
                    <View style={styles.cardStack}>
                      <Card style={styles.sideCard}>
                        <Text style={styles.sideCardTitle}>{t('ui.ideal_balance_title')}</Text>
                        <Text style={styles.sideCardNote}>{t('ui.ideal_balance_note')}</Text>
                        <View style={styles.pfcRow}>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
                            <Text style={styles.pfcValueDark}>
                              {Math.round(planTargetPFC.protein * MEAL_SHARE)}g
                            </Text>
                          </View>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                            <Text style={styles.pfcValueDark}>
                              {Math.round(planTargetPFC.fat * MEAL_SHARE)}g
                            </Text>
                          </View>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                            <Text style={styles.pfcValueDark}>
                              {Math.round(planTargetPFC.carbs * MEAL_SHARE)}g
                            </Text>
                          </View>
                        </View>
                      </Card>

                      <Card style={styles.sideCardAccent}>
                        <Text style={styles.sideCardTitleAccent}>{t('ui.actual_balance_title')}</Text>
                        <View style={styles.pfcRow}>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealP}g</Text>
                          </View>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealF}g</Text>
                          </View>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealC}g</Text>
                          </View>
                        </View>
                        <View style={styles.pfcRow}>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.stat_calories')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealKcal}kcal</Text>
                          </View>
                        </View>
                      </Card>
                    </View>
                  );
                })()}
                <Pressable style={styles.modalButton} onPress={() => setShowPlanBalance(false)}>
                  <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showStockCalendar}
            transparent
            animationType="fade"
            onRequestClose={() => setShowStockCalendar(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={[styles.modalCard, styles.calendarModalCard]}>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalTitle}>{t('ui.calendar_title')}</Text>
                  <Pressable onPress={() => setShowStockCalendar(false)} style={styles.iconButton}>
                    <X size={18} color="#6b7280" />
                  </Pressable>
                </View>
                <View style={styles.calendarNav}>
                  <Pressable
                    onPress={() => setCalendarMonthOffset((prev) => prev - 1)}
                    style={styles.calendarNavButton}
                  >
                    <ChevronLeft size={18} color="#6b7280" />
                  </Pressable>
                  <Text style={styles.calendarMonthText}>{calendarMonthLabel}</Text>
                  <Pressable
                    onPress={() => setCalendarMonthOffset((prev) => prev + 1)}
                    style={styles.calendarNavButton}
                  >
                    <ChevronRight size={18} color="#6b7280" />
                  </Pressable>
                </View>
                <View style={styles.calendarWeekRow}>
                  {weekdayLabels.map((label) => (
                    <Text key={label} style={styles.calendarWeekText}>
                      {label}
                    </Text>
                  ))}
                </View>
                <View style={styles.calendarGrid}>
                  {calendarCells.map((date, index) => {
                    if (!date) {
                      return <View key={`empty-${index}`} style={styles.calendarCellEmpty} />;
                    }
                    const key = formatDateKey(date);
                    const stat = calendarStats[key];
                    const totalServings = stat?.totalServings ?? 0;
                    const allCompleted = stat?.allCompleted ?? false;
                    const label =
                      totalServings > 0
                        ? allCompleted
                          ? t('ui.calendar_muscle')
                          : `${totalServings}`
                        : '';
                    return (
                      <Pressable
                        key={key}
                        style={styles.calendarCell}
                        onPress={() => {
                          if (totalServings <= 0) return;
                          setCalendarDetailDateKey(key);
                          setShowCalendarDetail(true);
                        }}
                      >
                        <View
                          style={[
                            styles.calendarBadge,
                            { backgroundColor: getHeatColor(totalServings) },
                          ]}
                        >
                          <Text style={styles.calendarBadgeText}>{label}</Text>
                        </View>
                        <Text style={styles.calendarDayText}>{date.getDate()}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={showCalendarDetail}
            transparent
            animationType="slide"
            onRequestClose={() => setShowCalendarDetail(false)}
          >
            <Pressable
              style={styles.drawerBackdrop}
              onPress={() => setShowCalendarDetail(false)}
            >
              <Pressable style={styles.drawerCard} onPress={() => null}>
                <View style={styles.modalTitleRow}>
                  <Text style={styles.modalTitle}>
                    {calendarDetailDateKey
                      ? dateFromKey(calendarDetailDateKey).toLocaleDateString(i18n.language)
                      : t('ui.calendar_title')}
                  </Text>
                  <Pressable onPress={() => setShowCalendarDetail(false)} style={styles.iconButton}>
                    <X size={18} color="#6b7280" />
                  </Pressable>
                </View>
                {calendarDetailEntries.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyTitleLarge}>{t('ui.calendar_empty')}</Text>
                  </View>
                ) : (
                  <View style={styles.calendarDetailList}>
                    {calendarDetailEntries.map((entry) => {
                      const baseName = t(
                        POT_BASES.find((b) => b.id === entry.potBase)?.name || ''
                      );
                      return (
                        <View key={entry.id} style={styles.calendarDetailRow}>
                          <View style={styles.calendarDetailInfo}>
                            <Text style={styles.calendarDetailTitle}>{baseName}</Text>
                            <Text style={styles.calendarDetailHint}>
                              {t('ui.remaining_meals', {
                                remaining: entry.servingsLeft,
                                total: entry.servingsTotal,
                              })}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </Pressable>
            </Pressable>
          </Modal>
        )}
        {languageModal}
      </SafeAreaView>
    );
  }

  if (screen === 'builder') {
    return (
      <SafeAreaView style={[styles.safeArea, isWeb && styles.webRoot]}>
        {wrapContent(
          <ScrollView contentContainerStyle={styles.screenPad} showsVerticalScrollIndicator={false}>
            <View style={styles.builderHeader}>
              <Pressable
                onPress={() => (step > 1 ? setStep(step - 1) : setScreen('dashboard'))}
                style={styles.squareButton}
              >
                <ChevronLeft size={24} color="#111827" strokeWidth={3} />
              </Pressable>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.stepLabel}>{t('ui.step_label', { current: step, total: 6 })}</Text>
                <Text style={styles.builderTitle}>{t('ui.plan_builder')}</Text>
              </View>
            </View>

            <ProgressBar current={step} total={6} />

          {step === 1 && (
            <View style={styles.sectionBlock}>
              <SectionTitle>{t('ui.servings_question')}</SectionTitle>
              <View style={styles.grid2}>
                {[2, 5].map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => {
                      setCurrentPlan({ ...currentPlan, servings: s as 2 | 5 });
                      if (s === 5) {
                        if (!skipFiveServingsModal) {
                          setShowFiveServingsModal(true);
                          return;
                        }
                        setStep(2);
                        return;
                      }
                      setStep(2);
                    }}
                    style={[
                      styles.choiceCard,
                      currentPlan.servings === s && styles.choiceCardActive,
                    ]}
                  >
                    <Text style={styles.choiceNumber}>{s}</Text>
                    <Text style={styles.choiceUnit}>{t('ui.servings_unit')}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.sectionBlock}>
              <SectionTitle>{t('ui.base_select')}</SectionTitle>
              <View style={styles.cardStack}>
                {POT_BASES.map((base) => (
                  <Pressable
                    key={base.id}
                    onPress={() => {
                      const normalized = normalizePlanForPotBase(
                        {
                          proteins: currentPlan.proteins || [],
                          veggies: currentPlan.veggies || [],
                          carb: currentPlan.carb || '',
                        },
                        base.id
                      );
                      setCurrentPlan({
                        ...currentPlan,
                        potBase: base.id,
                        proteins: normalized.proteins,
                        veggies: normalized.veggies,
                        carb: normalized.carb,
                      });
                      setStep(3);
                    }}
                    style={[
                      styles.baseRow,
                      currentPlan.potBase === base.id && styles.baseRowActive,
                    ]}
                  >
                    <View style={styles.baseIcon}>
                      <Image source={POT_BASE_IMAGES[base.id]} style={styles.baseImage} contentFit="cover" transition={150} />
                    </View>
                    <View>
                      <Text style={styles.baseTitle}>{t(base.name)}</Text>
                      <Text style={styles.baseSubtitle}>{t(base.description)}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.sectionBlock}>
              <SectionTitle>
                {t('ui.protein_select')}
              </SectionTitle>
              <View style={styles.cardStack}>
                {getIngredientsForPotBase(currentPlan.potBase || 'yose', 'protein').map((ing) => (
                  <Pressable
                    key={ing.id}
                    onPress={() => {
                      const exists = currentPlan.proteins?.includes(ing.id);
                      if (exists) {
                        setCurrentPlan({
                          ...currentPlan,
                          proteins: currentPlan.proteins?.filter((p) => p !== ing.id),
                        });
                      } else {
                        const nextProteins = [...(currentPlan.proteins || [])];
                        if (nextProteins.length >= 2) {
                          nextProteins.shift();
                        }
                        nextProteins.push(ing.id);
                        setCurrentPlan({
                          ...currentPlan,
                          proteins: nextProteins,
                        });
                      }
                    }}
                    style={[styles.baseRow, currentPlan.proteins?.includes(ing.id) && styles.baseRowActive]}
                  >
                    <View>
                      <Image
                        source={ing.photoSmall ?? ing.photo}
                        style={styles.ingredientRowImage}
                        contentFit="cover"
                        transition={150}
                      />
                      {currentPlan.proteins?.includes(ing.id) && (
                        <View style={styles.checkBadge}>
                          <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />
                        </View>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ingredientName}>{t(ing.name)}</Text>
                      <Text style={styles.ingredientMeta}>
                        {t('ui.protein_meta', { value: ing.pPer100g })}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
              <Pressable
                disabled={currentPlan.proteins?.length !== 2}
                onPress={() => setStep(4)}
                style={[
                  styles.fullButton,
                  currentPlan.proteins?.length !== 2 && styles.fullButtonDisabled,
                ]}
              >
                <Text style={styles.fullButtonText}>
                  {t('ui.next_with_count', { current: currentPlan.proteins?.length || 0 })}
                </Text>
              </Pressable>
            </View>
          )}

          {step === 4 && (
            <View style={styles.sectionBlock}>
              <SectionTitle>
                {t('ui.veg_select')}
              </SectionTitle>
              {(() => {
                const allVeggies = getIngredientsForPotBase(currentPlan.potBase || 'yose', 'veg');
                const veggieOptions = allVeggies.filter((ing) => !MUSHROOM_IDS.has(ing.id));
                const mushroomOptions = allVeggies.filter((ing) => MUSHROOM_IDS.has(ing.id));
                const selectedVeggies = (currentPlan.veggies || []).filter(
                  (id) => !MUSHROOM_IDS.has(id)
                );
                const selectedMushrooms = (currentPlan.veggies || []).filter((id) =>
                  MUSHROOM_IDS.has(id)
                );
                const canProceed = selectedVeggies.length === 2 && selectedMushrooms.length === 1;

                return (
                  <>
                    <Text style={styles.sectionLabel}>{t('ui.veg_select_two')}</Text>
                    <View style={styles.cardStack}>
                      {veggieOptions.map((ing) => (
                        <Pressable
                          key={ing.id}
                          onPress={() => {
                            const exists = currentPlan.veggies?.includes(ing.id);
                            if (exists) {
                              setCurrentPlan({
                                ...currentPlan,
                                veggies: currentPlan.veggies?.filter((p) => p !== ing.id),
                              });
                            } else {
                              const nextVeggies = [...(currentPlan.veggies || [])];
                              const veggieIds = nextVeggies.filter((id) => !MUSHROOM_IDS.has(id));
                              if (veggieIds.length >= 2) {
                                const toRemove = veggieIds[0];
                                const removeIndex = nextVeggies.indexOf(toRemove);
                                if (removeIndex >= 0) {
                                  nextVeggies.splice(removeIndex, 1);
                                }
                              }
                              nextVeggies.push(ing.id);
                              setCurrentPlan({
                                ...currentPlan,
                                veggies: nextVeggies,
                              });
                            }
                          }}
                          style={[
                            styles.baseRow,
                            currentPlan.veggies?.includes(ing.id) && styles.baseRowActive,
                          ]}
                        >
                          <View>
                            <Image
                              source={ing.photoSmall ?? ing.photo}
                              style={styles.ingredientRowImage}
                              contentFit="cover"
                              transition={150}
                            />
                            {currentPlan.veggies?.includes(ing.id) && (
                              <View style={styles.checkBadge}>
                                <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />
                              </View>
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.ingredientName}>{t(ing.name)}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>

                    <Text style={styles.sectionLabel}>{t('ui.mushroom_select_one')}</Text>
                    <View style={styles.cardStack}>
                      {mushroomOptions.map((ing) => (
                        <Pressable
                          key={ing.id}
                          onPress={() => {
                            const exists = currentPlan.veggies?.includes(ing.id);
                            if (exists) {
                              setCurrentPlan({
                                ...currentPlan,
                                veggies: currentPlan.veggies?.filter((p) => p !== ing.id),
                              });
                            } else {
                              const nextVeggies = [...(currentPlan.veggies || [])];
                              const mushroomIds = nextVeggies.filter((id) => MUSHROOM_IDS.has(id));
                              if (mushroomIds.length >= 1) {
                                const toRemove = mushroomIds[0];
                                const removeIndex = nextVeggies.indexOf(toRemove);
                                if (removeIndex >= 0) {
                                  nextVeggies.splice(removeIndex, 1);
                                }
                              }
                              nextVeggies.push(ing.id);
                              setCurrentPlan({
                                ...currentPlan,
                                veggies: nextVeggies,
                              });
                            }
                          }}
                          style={[
                            styles.baseRow,
                            currentPlan.veggies?.includes(ing.id) && styles.baseRowActive,
                          ]}
                        >
                          <View>
                            <Image
                              source={ing.photoSmall ?? ing.photo}
                              style={styles.ingredientRowImage}
                              contentFit="cover"
                              transition={150}
                            />
                            {currentPlan.veggies?.includes(ing.id) && (
                              <View style={styles.checkBadge}>
                                <CheckCircle2 size={16} color="#ffffff" strokeWidth={3} />
                              </View>
                            )}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.ingredientName}>{t(ing.name)}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </View>

                    <Pressable
                      disabled={!canProceed}
                      onPress={() => setStep(5)}
                      style={[styles.fullButton, !canProceed && styles.fullButtonDisabled]}
                    >
                      <Text style={styles.fullButtonText}>
                        {t('ui.next_veg_mushroom', {
                          veg: selectedVeggies.length,
                          mush: selectedMushrooms.length,
                        })}
                      </Text>
                    </Pressable>
                  </>
                );
              })()}
            </View>
          )}

          {step === 5 && (
            <View style={styles.sectionBlock}>
              <SectionTitle>
                {t('ui.carb_select')}
              </SectionTitle>
              <View style={styles.cardStack}>
                {getIngredientsForPotBase(currentPlan.potBase || 'yose', 'carb').map((ing) => (
                  <Pressable
                    key={ing.id}
                    onPress={() => {
                      setCurrentPlan({ ...currentPlan, carb: ing.id });
                      setStep(6);
                    }}
                    style={[
                      styles.baseRow,
                      currentPlan.carb === ing.id && styles.baseRowActive,
                    ]}
                  >
                    <Image
                      source={ing.photoSmall ?? ing.photo}
                      style={styles.carbImage}
                      contentFit="cover"
                      transition={150}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.baseTitle}>{t(ing.name)}</Text>
                      <Text style={styles.baseSubtitle}>{getEffectLead(t(ing.effect))}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {step === 6 && (
            <View style={styles.sectionBlock}>
              <Text style={styles.commitTitle}>{t('ui.commit_pot_title')}</Text>

              <Card style={styles.darkCard}>
                <View style={styles.labelRow}>
                  <ShoppingBag size={12} color="#f97316" />
                  <Text style={styles.darkPanelLabelText}>{t('ui.ingredient_amounts')}</Text>
                </View>
                {buildShoppingEntries(currentPlan).map((entry) => (
                  <View key={entry.id} style={styles.listRow}>
                    <Text style={styles.listLabel}>{entry.name}</Text>
                    <Text style={styles.listValue}>
                      {entry.roundedGrams}g
                      {entry.units ? (
                        <Text style={styles.listUnit}>
                          {' '}（{formatUnits(entry.units, entry.unitName)}）
                        </Text>
                      ) : null}
                    </Text>
                  </View>
                ))}
                <Text style={styles.listSectionLabel}>{t('ui.seasonings')}</Text>
                {getSeasoningEntries(currentPlan).map((seasoning) => (
                  <View key={seasoning.id} style={styles.listRow}>
                    <Text style={styles.listLabel}>{seasoning.name}</Text>
                    <Text style={styles.listValue}>
                      {seasoning.amountLabel ?? `${seasoning.grams}g`}
                      {seasoning.note ? <Text style={styles.listUnit}>（{seasoning.note}）</Text> : null}
                    </Text>
                  </View>
                ))}
              </Card>

              <View style={styles.cardStack}>
                <Card style={styles.sideCard}>
                  <Text style={styles.sideCardTitle}>{t('ui.ideal_balance_title')}</Text>
                  <Text style={styles.sideCardNote}>{t('ui.ideal_balance_note')}</Text>
                  <View style={styles.pfcRow}>
                    <View style={styles.pfcCell}>
                      <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
                      <Text style={styles.pfcValueDark}>
                        {Math.round(targetPFC.protein * MEAL_SHARE)}g
                      </Text>
                    </View>
                    <View style={styles.pfcCell}>
                      <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                      <Text style={styles.pfcValueDark}>
                        {Math.round(targetPFC.fat * MEAL_SHARE)}g
                      </Text>
                    </View>
                    <View style={styles.pfcCell}>
                      <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                      <Text style={styles.pfcValueDark}>
                        {Math.round(targetPFC.carbs * MEAL_SHARE)}g
                      </Text>
                    </View>
                  </View>
                </Card>

                <Card style={styles.sideCardAccent}>
                  <Text style={styles.sideCardTitleAccent}>{t('ui.actual_balance_title')}</Text>
                  {(() => {
                    const { servings, totalP, totalF, totalC, totalKcal } =
                      calculatePlanTotals(currentPlan);

                    const perMealP = Math.round(totalP / servings);
                    const perMealF = Math.round(totalF / servings);
                    const perMealC = Math.round(totalC / servings);
                    const perMealKcal = Math.round(totalKcal / servings);

                    return (
                      <>
                        <View style={styles.pfcRow}>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_protein')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealP}g</Text>
                          </View>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_fat')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealF}g</Text>
                          </View>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.pfc_carbs')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealC}g</Text>
                          </View>
                        </View>
                        <View style={styles.pfcRow}>
                          <View style={styles.pfcCell}>
                            <Text style={styles.pfcLabel}>{t('ui.stat_calories')}</Text>
                            <Text style={styles.pfcValueAccent}>{perMealKcal}kcal</Text>
                          </View>
                        </View>
                      </>
                    );
                  })()}
                </Card>
              </View>

              <View style={styles.sectionBlock}>
                <Pressable
                  onPress={async () => {
                    if (skipPlanConfirm) {
                      handleFinishPlan();
                      return;
                    }
                    setShowPlanConfirm(true);
                  }}
                  style={styles.primaryButtonInline}
                >
                  <Text style={styles.primaryButtonText}>{t('ui.confirm_plan')}</Text>
                </Pressable>
                <Pressable onPress={() => setStep(1)} style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>{t('ui.redo_plan')}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
        )}

        <Modal
          visible={showFiveServingsModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFiveServingsModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{t('ui.modal_attention_title')}</Text>
              <Text style={styles.modalBody}>{t('ui.modal_five_servings_body')}</Text>
              <Image source={FIVE_SERVINGS_POT_IMAGE} style={styles.modalImage} contentFit="cover" transition={150} />
              <Pressable
                style={styles.modalCheckRow}
                onPress={() => setSkipFiveServingsModal((prev) => !prev)}
              >
                <View
                  style={[
                    styles.modalCheckBox,
                    skipFiveServingsModal && styles.modalCheckBoxActive,
                  ]}
                />
                <Text style={styles.modalCheckLabel}>{t('ui.modal_hide_next_time')}</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={async () => {
                  setShowFiveServingsModal(false);
                  try {
                    await AsyncStorage.setItem(
                      'five_servings_modal_skip',
                      skipFiveServingsModal ? 'true' : 'false'
                    );
                  } catch {
                    // ignore storage errors
                  }
                  setStep(2);
                }}
              >
                <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showPlanConfirm}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPlanConfirm(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{t('ui.modal_confirm_title')}</Text>
              <Text style={styles.modalBody}>{t('ui.modal_plan_saved')}</Text>
              <View style={styles.modalShopRow}>
                <Text style={styles.modalBody}>{t('ui.modal_shop_prefix')}</Text>
                <View style={styles.modalShopBadge}>
                  <ShoppingBag size={14} color="#f97316" strokeWidth={2.5} />
                  <Text style={styles.modalShopLabel}>{t('ui.shop_label')}</Text>
                </View>
                <Text style={styles.modalBody}>{t('ui.modal_shop_suffix')}</Text>
              </View>
              <Pressable
                style={styles.modalCheckRow}
                onPress={() => setSkipPlanConfirm((prev) => !prev)}
              >
                <View
                  style={[styles.modalCheckBox, skipPlanConfirm && styles.modalCheckBoxActive]}
                />
                <Text style={styles.modalCheckLabel}>{t('ui.modal_hide_next_time')}</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={async () => {
                  setShowPlanConfirm(false);
                  try {
                    await AsyncStorage.setItem(
                      'plan_confirm_skip',
                      skipPlanConfirm ? 'true' : 'false'
                    );
                  } catch {
                    // ignore storage errors
                  }
                  await handleFinishPlan();
                  setScreen('shopping');
                }}
              >
                <Text style={styles.modalButtonText}>{t('ui.modal_go_shop')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  if (screen === 'cards') {
    return (
      <SafeAreaView style={[styles.safeArea, styles.screenLight, isWeb && styles.webRoot]}>
        {wrapContent(
          <ScrollView contentContainerStyle={styles.screenPad} showsVerticalScrollIndicator={false}>
            <View style={styles.pageTitleRow}>
              <Pressable onPress={() => setScreen('dashboard')} style={styles.squareButtonLight}>
                <ChevronLeft size={24} color="#111827" strokeWidth={3} />
              </Pressable>
              <Text style={styles.pageTitle}>
                {t('ui.effects_title')}
                <Text style={styles.pageTitleAccent}>{t('ui.effects_title_accent')}</Text>
              </Text>
            </View>

            <View style={styles.cardStack}>
              {INGREDIENTS.map((ing) => (
                <Card key={ing.id} style={styles.bigCard}>
                  <Image
                    source={ing.photo}
                    placeholder={ing.photoSmall ?? ing.photo}
                    style={styles.bigImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.bigCardBody}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle}>{t(ing.name)}</Text>
                      <Text
                        style={[
                          styles.categoryTag,
                          ing.category === 'protein'
                            ? styles.tagProtein
                            : ing.category === 'veg'
                              ? styles.tagVeg
                              : styles.tagCarb,
                        ]}
                      >
                        {t(`ui.category_${ing.category}`)}
                      </Text>
                    </View>
                    <View style={styles.effectSectionWrap}>
                      {parseEffectSections(t(ing.effect), t('ui.point')).map((section, index) => (
                        <View key={`${ing.id}-effect-${index}`} style={styles.effectRow}>
                          <Text style={styles.effectTitle}>{section.title}</Text>
                          <Text style={styles.effectBody}>{section.body}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.statGrid}>
                      <View style={styles.statCell}>
                        <Text style={styles.statLabel}>{t('ui.stat_calories')}</Text>
                        <Text style={styles.statValue}>{ing.kcalPer100g}</Text>
                      </View>
                      <View style={styles.statCell}>
                        <Text style={styles.statLabel}>{t('ui.pfc_protein')}</Text>
                        <Text style={styles.statValue}>{ing.pPer100g}g</Text>
                      </View>
                      <View style={styles.statCell}>
                        <Text style={styles.statLabel}>{t('ui.pfc_fat')}</Text>
                        <Text style={styles.statValue}>{ing.fPer100g}g</Text>
                      </View>
                      <View style={styles.statCell}>
                        <Text style={styles.statLabel}>{t('ui.pfc_carbs')}</Text>
                        <Text style={styles.statValue}>{ing.cPer100g}g</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </ScrollView>
        )}
        <Pressable style={styles.floatingBackButton} onPress={() => setScreen('dashboard')}>
          <ChevronLeft size={22} color="#ffffff" strokeWidth={3} />
        </Pressable>
      </SafeAreaView>
    );
  }

  if (screen === 'shopping') {
    const activePlan = plans[0];
    const shoppingEntries = activePlan ? buildShoppingEntries(activePlan) : [];
    const seasoningEntries = activePlan ? getSeasoningEntries(activePlan) : [];
    const proteinEntries = shoppingEntries.filter((entry) => entry.category === 'protein');
    const vegEntries = shoppingEntries.filter((entry) => entry.category === 'veg');
    const carbEntries = shoppingEntries.filter((entry) => entry.category === 'carb');

    return (
      <SafeAreaView style={[styles.safeArea, styles.screenLight, isWeb && styles.webRoot]}>
        {wrapContent(
          <ScrollView contentContainerStyle={styles.screenPad} showsVerticalScrollIndicator={false}>
            <View style={styles.pageTitleRow}>
              <Pressable onPress={() => setScreen('dashboard')} style={styles.squareButtonLight}>
                <ChevronLeft size={24} color="#111827" strokeWidth={3} />
              </Pressable>
              <Text style={styles.pageTitleSimple}>{t('ui.shopping_list_title')}</Text>
            </View>

          {plans.length === 0 || (shoppingEntries.length === 0 && seasoningEntries.length === 0) ? (
            <View style={styles.emptyState}>
              <ShoppingBag size={80} color="#d1d5db" />
              <Text style={styles.emptyTitleLarge}>{t('ui.shopping_empty_title')}</Text>
            </View>
          ) : (
            <View style={styles.cardStack}>
              <View>
                <SectionTitle>{t('ui.tab_protein')}</SectionTitle>
                <View style={styles.cardStack}>
                  {proteinEntries.map((entry) => (
                    <View key={entry.id} style={styles.listCard}>
                      <Text style={styles.listCardTitle}>{entry.name}</Text>
                      <Text style={styles.listCardHint}>
                        {entry.roundedGrams}g
                        {entry.units ? `（${formatUnits(entry.units, entry.unitName)}）` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View>
                <SectionTitle>{t('ui.tab_veg')}</SectionTitle>
                <View style={styles.cardStack}>
                  {vegEntries.map((entry) => (
                    <View key={entry.id} style={styles.listCard}>
                      <Text style={styles.listCardTitle}>{entry.name}</Text>
                      <Text style={styles.listCardHint}>
                        {entry.roundedGrams}g
                        {entry.units ? `（${formatUnits(entry.units, entry.unitName)}）` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View>
                <SectionTitle>{t('ui.tab_carb')}</SectionTitle>
                <View style={styles.cardStack}>
                  {carbEntries.map((entry) => (
                    <View key={entry.id} style={styles.listCard}>
                      <Text style={styles.listCardTitle}>{entry.name}</Text>
                      <Text style={styles.listCardHint}>
                        {entry.roundedGrams}g
                        {entry.units ? `（${formatUnits(entry.units, entry.unitName)}）` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View>
                <SectionTitle>{t('ui.tab_seasoning')}</SectionTitle>
                <View style={styles.cardStack}>
                  {seasoningEntries.map((entry) => (
                    <View key={entry.id} style={styles.listCard}>
                      <Text style={styles.listCardTitle}>{entry.name}</Text>
                      <Text style={styles.listCardHint}>
                        {entry.amountLabel ?? `${entry.grams}g`}
                        {entry.note ? `（${entry.note}）` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={() => {
                  setCookStep(0);
                  setScreen('cook');
                }}
                style={styles.primaryButtonInline}
              >
                <Text style={styles.primaryButtonText}>{t('ui.start_prep_mode')}</Text>
                <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
              </Pressable>
            </View>
          )}
        </ScrollView>
        )}

        <Modal
          visible={showShoppingIntro}
          transparent
          animationType="fade"
          onRequestClose={() => setShowShoppingIntro(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalTitleRow}>
                <ChefHat size={16} color="#f97316" strokeWidth={2.5} />
                <Text style={styles.modalTitle}>{t('ui.modal_notice_title')}</Text>
              </View>
              <Text style={styles.modalBody}>
                {t('ui.modal_shop_done_body')}
              </Text>
              <Pressable
                style={styles.modalCheckRow}
                onPress={() => setSkipShoppingIntro((prev) => !prev)}
              >
                <View
                  style={[styles.modalCheckBox, skipShoppingIntro && styles.modalCheckBoxActive]}
                />
                <Text style={styles.modalCheckLabel}>{t('ui.modal_hide_next_time')}</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={async () => {
                  setShowShoppingIntro(false);
                  try {
                    await AsyncStorage.setItem(
                      'shop_intro_skip',
                      skipShoppingIntro ? 'true' : 'false'
                    );
                  } catch {
                    // ignore storage errors
                  }
                }}
              >
                <Text style={styles.modalButtonText}>{t('ui.ok')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  if (screen === 'cook') {
    const currentCookData = COOK_STEPS[cookStep];
    return (
      <SafeAreaView style={[styles.safeArea, isWeb && styles.webRoot]}>
        {wrapContent(
          <View style={styles.cookPad}>
            <View style={styles.builderHeader}>
              <Pressable
                onPress={() => (cookStep > 0 ? setCookStep(cookStep - 1) : setScreen('dashboard'))}
                style={styles.squareButton}
              >
                <ChevronLeft size={24} color="#111827" strokeWidth={3} />
              </Pressable>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.builderTitle}>{t('ui.prep_mode_title')}</Text>
                <Text style={styles.stepLabel}>
                  {t('ui.step_of', { current: cookStep + 1, total: 7 })}
                </Text>
              </View>
            </View>

            <ProgressBar current={cookStep + 1} total={7} />

            <View style={styles.cookCenter}>
              <ScrollView
                ref={cookScrollRef}
                style={styles.scrollFlex}
                contentContainerStyle={styles.cookContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.cookTitle}>{t(currentCookData.titleKey)}</Text>
                <Image source={currentCookData.photo} style={styles.cookPhoto} contentFit="cover" transition={200} />
                <Text style={styles.cookDesc}>{t(currentCookData.descriptionKey)}</Text>

                <Card style={styles.tipCard}>
                  <View style={styles.tipIcon}>
                    <ChefHat size={50} color="#111827" />
                  </View>
                  <View style={styles.labelRow}>
                    <Target size={12} color="#f97316" />
                    <Text style={styles.tipLabelText}>{t('ui.commit_point')}</Text>
                  </View>
                  <Text style={styles.tipText}>{t(currentCookData.tipKey)}</Text>
                </Card>
              </ScrollView>
            </View>

            <Pressable
              onPress={() => {
                if (cookStep < 6) {
                  setCookStep(cookStep + 1);
                } else {
                  setScreen('dashboard');
                }
              }}
              style={styles.primaryButtonInline}
            >
              <Text style={styles.primaryButtonText}>
                {cookStep < 6 ? t('ui.next_step') : t('ui.finish_prep')}
              </Text>
              <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  webRoot: { backgroundColor: '#f3f4f6' },
  webContent: { maxWidth: 1100, width: '100%', alignSelf: 'center', flex: 1 },
  scrollFlex: { flex: 1 },
  screenLight: { backgroundColor: '#fafafa' },
  splash: { backgroundColor: '#111111', alignItems: 'center', justifyContent: 'center' },
  splashIconWrap: { marginBottom: 24, alignItems: 'center', justifyContent: 'center' },
  splashGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    backgroundColor: '#f97316',
    opacity: 0.2,
    borderRadius: 90,
  },
  splashTitle: { fontSize: 40, fontWeight: '800', color: '#ffffff', letterSpacing: -1 },
  splashAccent: { color: '#f97316' },
  splashSubtitle: { marginTop: 8, color: '#9ca3af', fontWeight: '700', letterSpacing: 2, fontSize: 12 },
  screenPad: { padding: 24, paddingBottom: 120 },
  headerBlock: { marginBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  ghostButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#f3f4f6' },
  ghostButtonText: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  languageButtonText: { fontSize: 12, fontWeight: '700', color: '#6b7280' },
  languageBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  languageModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
  },
  languageModalTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  languageList: { gap: 8 },
  languageOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  languageOptionActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  languageOptionText: { fontSize: 14, fontWeight: '600', color: '#111827' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  headerSubtitle: { marginTop: 8, color: '#6b7280', fontWeight: '600', fontSize: 16 },
  grid2: { flexDirection: 'row', gap: 12 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  flexCard: { flex: 1 },
  label: { fontSize: 14, fontWeight: '700', color: '#6b7280' },
  input: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 8 },
  goalRow: { flexDirection: 'row', marginTop: 12, gap: 10 },
  goalButton: { flex: 1, paddingVertical: 10, borderRadius: 16, borderWidth: 2 },
  goalButtonActive: { backgroundColor: '#f97316', borderColor: '#f97316' },
  goalButtonInactive: { borderColor: '#f3f4f6' },
  goalButtonText: { textAlign: 'center', fontWeight: '800', color: '#9ca3af', fontSize: 14 },
  goalButtonTextActive: { color: '#ffffff' },
  darkPanel: {
    backgroundColor: '#111111',
    padding: 24,
    borderRadius: 32,
    marginTop: 24,
  },
  darkPanelIcon: { position: 'absolute', right: 16, top: 12, opacity: 0.1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  darkPanelLabelText: { color: '#f97316', fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  darkPanelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  darkCaption: { color: '#9ca3af', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  darkHero: { fontSize: 32, fontWeight: '800', color: '#ffffff', marginTop: 6 },
  darkHeroUnit: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  darkSmall: { fontSize: 18, fontWeight: '700', color: 'rgba(255,255,255,0.6)' },
  darkSmallUnit: { fontSize: 12, fontWeight: '600' },
  pfcRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  pfcCell: { flex: 1, alignItems: 'center' },
  pfcLabelAccent: { color: '#f97316', fontSize: 10, fontWeight: '700' },
  pfcLabel: { color: '#9ca3af', fontSize: 10, fontWeight: '700' },
  pfcValue: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginTop: 4 },
  sectionSpacer: { height: 12 },
  stepRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepText: { color: '#6b7280', fontWeight: '700', fontSize: 12 },
  stepDots: { flexDirection: 'row', gap: 6 },
  stepDot: { width: 10, height: 10, borderRadius: 999 },
  stepDotActive: { backgroundColor: '#111827' },
  stepDotInactive: { backgroundColor: '#e5e7eb' },
  primaryButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonDisabled: { opacity: 0.4 },
  stepButtonRow: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#111827', fontWeight: '800' },
  primaryButtonCompact: {
    flex: 2,
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonInline: {
    backgroundColor: '#f97316',
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: { color: '#ffffff', fontWeight: '800' },
  dashboardPad: { padding: 24, paddingBottom: 120 },
  dashboardHeader: { marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dashboardActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dashboardSectionSpacer: { marginTop: 8 },
  dashboardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dashboardIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f97316',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  roundButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  actionCard: { flex: 1, borderRadius: 28, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 10 },
  actionPrimary: { backgroundColor: '#f97316' },
  actionSecondary: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6' },
  actionIconWrap: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 12, borderRadius: 20 },
  actionIconWrapSecondary: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 20 },
  actionText: { color: '#ffffff', fontWeight: '800', fontSize: 16, textAlign: 'center' },
  actionTextDark: { color: '#111827', fontWeight: '800', fontSize: 16, textAlign: 'center' },
  sectionTitleWrap: { marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  sectionSubtitle: { fontSize: 11, color: '#9ca3af', marginTop: 4, fontWeight: '600' },
  sectionLabel: { marginTop: 8, marginBottom: 4, fontSize: 12, fontWeight: '800', color: '#6b7280' },
  emptyCard: {
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderStyle: 'dashed',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: { color: '#9ca3af', fontWeight: '700' },
  emptyText: { marginTop: 6, color: '#d1d5db', fontSize: 12, textAlign: 'center' },
  cardStack: { gap: 12 },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planBaseImage: { width: 52, height: 52, borderRadius: 18, marginRight: 12 },
  planInfo: { flex: 1 },
  planActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lightButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  shopButton: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  shopButtonText: { color: '#f97316', fontWeight: '800', fontSize: 11 },
  planTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  planTag: { backgroundColor: '#ffedd5', color: '#c2410c', fontSize: 10, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  planDate: { color: '#d1d5db', fontSize: 10, fontWeight: '700' },
  planTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  darkButton: { backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 16 },
  darkButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  calendarButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  calendarButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 36,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navItem: { alignItems: 'center', gap: 4 },
  navItemActive: { alignItems: 'center', gap: 4 },
  navLabel: { fontSize: 10, fontWeight: '800', color: '#d1d5db', textTransform: 'uppercase' },
  navLabelActive: { fontSize: 10, fontWeight: '800', color: '#f97316', textTransform: 'uppercase' },
  builderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  squareButton: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  squareButtonLight: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  stepLabel: { fontSize: 10, color: '#d1d5db', fontWeight: '800', textTransform: 'uppercase' },
  builderTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  progressTrack: { height: 6, backgroundColor: '#f3f4f6', borderRadius: 999, overflow: 'hidden', marginBottom: 24 },
  progressFill: { height: 6, backgroundColor: '#f97316' },
  sectionBlock: { marginBottom: 16 },
  choiceCard: { flex: 1, padding: 24, borderRadius: 28, borderWidth: 3, borderColor: '#f9fafb', alignItems: 'center' },
  choiceCardActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  choiceNumber: { fontSize: 36, fontWeight: '800', color: '#111827' },
  choiceUnit: { fontSize: 12, fontWeight: '800', color: '#9ca3af' },
  baseRow: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 24, borderWidth: 2, borderColor: '#f3f4f6', alignItems: 'center' },
  baseRowActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  baseIcon: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', overflow: 'hidden' },
  baseImage: { width: 56, height: 56 },
  baseTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  baseSubtitle: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  ingredientCard: { flex: 1, padding: 12, borderRadius: 20, borderWidth: 2, borderColor: '#f3f4f6' },
  ingredientCardActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  ingredientImage: { width: '100%', height: 120, borderRadius: 16, marginBottom: 8 },
  ingredientRowImage: { width: 70, height: 70, borderRadius: 16 },
  ingredientName: { fontSize: 14, fontWeight: '800', color: '#111827' },
  ingredientMeta: { fontSize: 10, color: '#9ca3af', marginTop: 4, fontWeight: '700' },
  checkBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#f97316', padding: 6, borderRadius: 12 },
  fullButton: { marginTop: 16, backgroundColor: '#111827', paddingVertical: 16, borderRadius: 24, alignItems: 'center' },
  fullButtonDisabled: { opacity: 0.2 },
  fullButtonText: { color: '#ffffff', fontWeight: '800' },
  carbImage: { width: 70, height: 70, borderRadius: 16 },
  commitTitle: { fontSize: 26, fontWeight: '800', textAlign: 'center', color: '#111827', marginBottom: 12 },
  darkCard: { backgroundColor: '#111111', borderColor: 'transparent' },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingVertical: 10 },
  listSectionLabel: { color: '#f97316', fontWeight: '800', fontSize: 12, marginTop: 12 },
  listLabel: { color: '#e5e7eb', fontWeight: '700' },
  listValue: { color: '#ffffff', fontWeight: '800' },
  listUnit: { color: '#6b7280', fontWeight: '600' },
  sideCard: { borderLeftWidth: 6, borderLeftColor: '#d1d5db' },
  sideCardAccent: { borderLeftWidth: 6, borderLeftColor: '#f97316' },
  sideCardTitle: { fontSize: 10, fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 },
  sideCardNote: { fontSize: 11, color: '#6b7280', marginBottom: 10 },
  sideCardTitleAccent: { fontSize: 10, fontWeight: '800', color: '#f97316', textTransform: 'uppercase', marginBottom: 10 },
  pfcValueDark: { fontSize: 16, fontWeight: '800', color: '#111827' },
  pfcValueAccent: { fontSize: 16, fontWeight: '800', color: '#f97316' },
  linkButton: { alignItems: 'center', paddingVertical: 12 },
  linkButtonText: { color: '#9ca3af', fontWeight: '700' },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  pageTitleAccent: { color: '#f97316' },
  pageTitleSimple: { fontSize: 24, fontWeight: '800', color: '#111827' },
  bigCard: { padding: 0, overflow: 'hidden', borderColor: 'transparent' },
  bigImage: { width: '100%', height: 220 },
  bigCardBody: { padding: 16 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  categoryTag: { fontSize: 10, fontWeight: '800', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  tagProtein: { backgroundColor: '#fee2e2', color: '#b91c1c' },
  tagVeg: { backgroundColor: '#dcfce7', color: '#15803d' },
  tagCarb: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  effectSectionWrap: {
    marginTop: 10,
    gap: 8,
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  effectRow: { gap: 2 },
  effectTitle: { fontSize: 11, fontWeight: '800', color: '#c2410c' },
  effectBody: { fontSize: 12, lineHeight: 18, fontWeight: '600', color: '#374151' },
  statGrid: { marginTop: 16, backgroundColor: '#f9fafb', borderRadius: 24, padding: 16, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  statCell: { width: '45%', alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#9ca3af', textTransform: 'uppercase' },
  statValue: { fontSize: 12, fontWeight: '800', color: '#111827', marginTop: 4 },
  emptyState: { alignItems: 'center', marginTop: 80, gap: 16 },
  emptyTitleLarge: { fontSize: 18, fontWeight: '800', color: '#111827', textAlign: 'center' },
  listCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#f3f4f6' },
  listCardTitle: { fontWeight: '800', color: '#111827' },
  listCardHint: { fontWeight: '700', color: '#9ca3af', fontSize: 12 },
  cookPad: { flex: 1, padding: 24 },
  cookCenter: { flex: 1 },
  cookContent: { gap: 16, paddingBottom: 24 },
  cookPhoto: { width: '100%', height: 220, borderRadius: 18 },
  cookIconWrap: { width: 130, height: 130, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  cookStepBadge: { position: 'absolute', bottom: -6, right: -6, backgroundColor: '#ffffff', width: 36, height: 36, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cookStepBadgeText: { fontSize: 12, fontWeight: '800', color: '#111827' },
  cookTitle: { fontSize: 24, fontWeight: '800', color: '#111827', textAlign: 'center' },
  cookDesc: { marginTop: 12, color: '#9ca3af', fontWeight: '600', textAlign: 'center', paddingHorizontal: 16, fontSize: 16, lineHeight: 24 },
  tipCard: { marginTop: 24, width: '100%', backgroundColor: '#f9fafb', borderColor: 'transparent', paddingVertical: 20 },
  tipIcon: { position: 'absolute', top: 12, right: 12, opacity: 0.1 },
  tipLabelText: { fontSize: 12, fontWeight: '800', color: '#f97316', textTransform: 'uppercase', marginBottom: 8 },
  tipText: { color: '#6b7280', fontWeight: '700', fontSize: 14, lineHeight: 22 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    gap: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  modalCardLarge: {
    maxWidth: 520,
    maxHeight: '80%',
  },
  calendarModalCard: {
    maxWidth: 560,
  },
  iconButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calendarNavButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthText: { fontSize: 14, fontWeight: '800', color: '#111827' },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 6,
  },
  calendarWeekText: { width: '14.2857%', textAlign: 'center', fontSize: 10, fontWeight: '700', color: '#9ca3af' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarCell: { width: '14.2857%', alignItems: 'center', marginBottom: 10 },
  calendarCellEmpty: { width: '14.2857%', height: 40 },
  calendarBadge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBadgeText: { fontSize: 11, fontWeight: '800', color: '#0f172a' },
  calendarDayText: { marginTop: 4, fontSize: 10, fontWeight: '700', color: '#9ca3af' },
  drawerCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -6 },
  },
  calendarDetailList: { gap: 10, paddingBottom: 8 },
  calendarDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
  },
  calendarDetailInfo: { flex: 1 },
  calendarDetailTitle: { fontSize: 14, fontWeight: '800', color: '#111827' },
  calendarDetailHint: { fontSize: 12, fontWeight: '700', color: '#6b7280', marginTop: 2 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalBody: { fontSize: 14, color: '#6b7280', fontWeight: '600', lineHeight: 20 },
  modalShopRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  modalShopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  modalShopLabel: { fontSize: 13, fontWeight: '800', color: '#f97316' },
  floatingBackButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  modalImage: { width: '100%', height: 200, borderRadius: 16 },
  modalCheckRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  modalCheckBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  modalCheckBoxActive: { backgroundColor: '#f97316', borderColor: '#f97316' },
  modalCheckLabel: { fontSize: 13, fontWeight: '700', color: '#6b7280' },
  modalButton: {
    marginTop: 8,
    backgroundColor: '#f97316',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  authWrap: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  authTopRow: { alignItems: 'flex-end', marginBottom: 10 },
  authTitle: { fontSize: 28, fontWeight: '800', color: '#111827', textAlign: 'center' },
  authSubtitle: { textAlign: 'center', color: '#9ca3af', marginBottom: 12, fontWeight: '600' },
  authInput: { backgroundColor: '#f9fafb', borderRadius: 16, padding: 12, fontWeight: '600', color: '#111827' },
  authError: { color: '#dc2626', fontWeight: '700', textAlign: 'center' },
});
