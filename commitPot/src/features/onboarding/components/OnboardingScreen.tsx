import React, { memo } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { ChevronRight, Zap } from 'lucide-react-native';
import { ActivityLevel, Gender, Goal, UserProfile } from '../../../../types';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type Limits = {
  height: { min: number; max: number };
  weight: { min: number; max: number };
  age: { min: number; max: number };
};

type TargetPFC = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

type OnboardingScreenProps = {
  t: TFunc;
  styles: any;
  isWeb: boolean;
  wrapContent: (children: React.ReactNode) => React.ReactNode;
  languageButton: React.ReactNode;
  languageModal: React.ReactNode;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  parseNumericInput: (text: string) => number;
  profileLimits: Limits;
  showValidationErrors: boolean;
  setShowValidationErrors: (value: boolean) => void;
  onboardingStep: 1 | 2;
  setOnboardingStep: (step: 1 | 2) => void;
  tdee: number;
  targetPFC: TargetPFC;
  accountDeleting: boolean;
  onSignOut: () => void;
  onDeleteAccount: () => void;
  onSaveProfile: () => void;
};

const OnboardingScreenComponent = ({
  t,
  styles,
  isWeb,
  wrapContent,
  languageButton,
  languageModal,
  profile,
  setProfile,
  parseNumericInput,
  profileLimits,
  showValidationErrors,
  setShowValidationErrors,
  onboardingStep,
  setOnboardingStep,
  tdee,
  targetPFC,
  accountDeleting,
  onSignOut,
  onDeleteAccount,
  onSaveProfile,
}: OnboardingScreenProps) => {
  const isHeightValid =
    profile.height >= profileLimits.height.min && profile.height <= profileLimits.height.max;
  const isWeightValid =
    profile.weight >= profileLimits.weight.min && profile.weight <= profileLimits.weight.max;
  const isAgeValid = profile.age >= profileLimits.age.min && profile.age <= profileLimits.age.max;
  const canProceedStep1 = isHeightValid && isWeightValid && isAgeValid;

  return (
    <SafeAreaView style={[styles.safeArea, isWeb && styles.webRoot]}>
      {wrapContent(
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={styles.screenPad}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.headerBlock}>
            <View style={styles.headerRow}>
              <Pressable onPress={onSignOut} style={styles.ghostButton}>
                <Text style={styles.ghostButtonText}>{t('ui.logout')}</Text>
              </Pressable>
              {languageButton}
            </View>
            <Text style={styles.headerTitle}>
              {onboardingStep === 1 ? t('ui.onboarding_step1_title') : t('ui.onboarding_step2_title')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {onboardingStep === 1 ? t('ui.onboarding_step1_desc') : t('ui.onboarding_step2_desc')}
            </Text>
            <View style={styles.stepRow}>
              <Text style={styles.stepText}>{t('ui.step_label', { current: onboardingStep, total: 2 })}</Text>
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
                <View style={[styles.card, styles.flexCard]}>
                  <Text style={styles.label}>{t('ui.label_height')}</Text>
                  <TextInput
                    value={Number.isFinite(profile.height) && profile.height > 0 ? String(profile.height) : ''}
                    onChangeText={(text) => setProfile({ ...profile, height: parseNumericInput(text) })}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  {showValidationErrors && !isHeightValid && (
                    <Text style={styles.validationText}>
                      {t('ui.validation_height_range', {
                        min: profileLimits.height.min,
                        max: profileLimits.height.max,
                      })}
                    </Text>
                  )}
                </View>
                <View style={[styles.card, styles.flexCard]}>
                  <Text style={styles.label}>{t('ui.label_weight')}</Text>
                  <TextInput
                    value={Number.isFinite(profile.weight) && profile.weight > 0 ? String(profile.weight) : ''}
                    onChangeText={(text) => setProfile({ ...profile, weight: parseNumericInput(text) })}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  {showValidationErrors && !isWeightValid && (
                    <Text style={styles.validationText}>
                      {t('ui.validation_weight_range', {
                        min: profileLimits.weight.min,
                        max: profileLimits.weight.max,
                      })}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.grid2}>
                <View style={[styles.card, styles.flexCard]}>
                  <Text style={styles.label}>{t('ui.label_age')}</Text>
                  <TextInput
                    value={Number.isFinite(profile.age) && profile.age > 0 ? String(profile.age) : ''}
                    onChangeText={(text) => setProfile({ ...profile, age: parseNumericInput(text) })}
                    keyboardType="number-pad"
                    style={styles.input}
                  />
                  {showValidationErrors && !isAgeValid && (
                    <Text style={styles.validationText}>
                      {t('ui.validation_age_range', {
                        min: profileLimits.age.min,
                        max: profileLimits.age.max,
                      })}
                    </Text>
                  )}
                </View>
                <View style={[styles.card, styles.flexCard]}>
                  <Text style={styles.label}>{t('ui.label_gender_optional')}</Text>
                  <View style={styles.goalRow}>
                    {(['male', 'female', null] as Array<Gender | null>).map((g) => (
                      <Pressable
                        key={g ?? 'prefer_not_to_say'}
                        onPress={() => setProfile({ ...profile, gender: g })}
                        style={[
                          styles.goalButton,
                          profile.gender === g ? styles.goalButtonActive : styles.goalButtonInactive,
                        ]}
                      >
                        <Text style={[styles.goalButtonText, profile.gender === g && styles.goalButtonTextActive]}>
                          {g === 'male'
                            ? t('ui.gender_male')
                            : g === 'female'
                              ? t('ui.gender_female')
                              : t('ui.gender_prefer_not_to_say')}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.label}>{t('ui.label_activity')}</Text>
                <View style={styles.goalRow}>
                  {(['low', 'normal', 'high'] as ActivityLevel[]).map((level) => (
                    <Pressable
                      key={level}
                      onPress={() => setProfile({ ...profile, activityLevel: level })}
                      style={[
                        styles.goalButton,
                        profile.activityLevel === level ? styles.goalButtonActive : styles.goalButtonInactive,
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
              </View>

              <View style={styles.card}>
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
                      <Text style={[styles.goalButtonText, profile.goal === g && styles.goalButtonTextActive]}>
                        {g === 'bulk' ? t('ui.goal_bulk') : g === 'recomp' ? t('ui.goal_recomp') : t('ui.goal_cut')}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.darkPanel}>
                <View style={styles.darkPanelIcon}>
                  <Zap size={70} color="#ffffff" />
                </View>

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

          <View style={styles.accountDangerZone}>
            <Text style={styles.accountDangerTitle}>
              {t('ui.delete_account_section_title', { defaultValue: 'アカウント管理' })}
            </Text>
            <Pressable
              onPress={onDeleteAccount}
              disabled={accountDeleting}
              style={[styles.accountDeleteButton, accountDeleting && styles.accountDeleteButtonDisabled]}
            >
              <Text style={styles.accountDeleteButtonText}>
                {accountDeleting
                  ? t('ui.deleting_account', { defaultValue: '削除中...' })
                  : t('ui.delete_account', { defaultValue: 'アカウントを削除' })}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {onboardingStep === 1 ? (
        <Pressable
          style={[styles.primaryButton, showValidationErrors && !canProceedStep1 && styles.primaryButtonDisabled]}
          onPress={() => {
            if (canProceedStep1) {
              setShowValidationErrors(false);
              setOnboardingStep(2);
            } else {
              setShowValidationErrors(true);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>{t('ui.next')}</Text>
          <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
        </Pressable>
      ) : (
        <View style={styles.stepButtonRow}>
          <Pressable style={styles.secondaryButton} onPress={() => setOnboardingStep(1)}>
            <Text style={styles.secondaryButtonText}>{t('ui.back')}</Text>
          </Pressable>
          <Pressable style={styles.primaryButtonCompact} onPress={onSaveProfile}>
            <Text style={styles.primaryButtonText}>{t('ui.commit_with_body')}</Text>
            <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
          </Pressable>
        </View>
      )}
      {languageModal}
    </SafeAreaView>
  );
};

export const OnboardingScreen = memo(OnboardingScreenComponent);
