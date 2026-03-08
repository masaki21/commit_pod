import React, { memo } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';

type TFunc = (key: string, options?: Record<string, unknown>) => string;

type AuthScreenProps = {
  t: TFunc;
  styles: any;
  isWeb: boolean;
  wrapContent: (children: React.ReactNode) => React.ReactNode;
  languageButton: React.ReactNode;
  languageModal: React.ReactNode;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  authError: string | null;
  authMode: 'signIn' | 'signUp';
  setAuthMode: (mode: 'signIn' | 'signUp') => void;
  authLoading: boolean;
  onAuth: () => void;
};

const AuthScreenComponent = ({
  t,
  styles,
  isWeb,
  wrapContent,
  languageButton,
  languageModal,
  email,
  setEmail,
  password,
  setPassword,
  authError,
  authMode,
  setAuthMode,
  authLoading,
  onAuth,
}: AuthScreenProps) => {
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
          <Pressable onPress={onAuth} style={styles.primaryButtonInline} disabled={authLoading}>
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
};

export const AuthScreen = memo(AuthScreenComponent);
