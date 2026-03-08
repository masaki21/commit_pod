import React, { memo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft } from 'lucide-react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type CardComponent = (props: { children: React.ReactNode; style?: object }) => React.ReactElement;

type IngredientItem = {
  id: string;
  name: string;
  effect: string;
  category: 'protein' | 'veg' | 'carb';
  kcalPer100g: number;
  pPer100g: number;
  fPer100g: number;
  cPer100g: number;
  photo: any;
  photoSmall?: any;
};

type CardsScreenContentProps = {
  t: TFunc;
  styles: any;
  ingredients: IngredientItem[];
  smallButtonHitSlop: { top: number; right: number; bottom: number; left: number };
  Card: CardComponent;
  parseEffectSections: (text: string, pointLabel?: string) => Array<{ title: string; body: string }>;
  onBack: () => void;
};

const CardsScreenContentComponent = ({
  t,
  styles,
  ingredients,
  smallButtonHitSlop,
  Card,
  parseEffectSections,
  onBack,
}: CardsScreenContentProps) => {
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.screenPad}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.pageTitleRow}>
          <Pressable onPress={onBack} style={styles.squareButtonLight} hitSlop={smallButtonHitSlop}>
            <ChevronLeft size={24} color="#111827" strokeWidth={3} />
          </Pressable>
          <Text style={styles.pageTitle}>
            {t('ui.effects_title')}
            <Text style={styles.pageTitleAccent}>{t('ui.effects_title_accent')}</Text>
          </Text>
        </View>

        <View style={styles.cardStack}>
          {ingredients.map((ing) => (
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

      <Pressable style={styles.floatingBackButton} onPress={onBack} hitSlop={smallButtonHitSlop}>
        <ChevronLeft size={22} color="#ffffff" strokeWidth={3} />
      </Pressable>
    </>
  );
};

export const CardsScreenContent = memo(CardsScreenContentComponent);
