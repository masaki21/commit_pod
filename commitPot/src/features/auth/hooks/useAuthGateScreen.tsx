import { useMemo } from 'react';
import { Session } from '@supabase/supabase-js';
import { SplashScreen } from '../../onboarding/components/SplashScreen';
import { AuthScreen } from '../components/AuthScreen';

type UseAuthGateScreenParams = {
  authReady: boolean;
  session: Session | null;
  t: (key: string, options?: Record<string, unknown>) => string;
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

export function useAuthGateScreen({
  authReady,
  session,
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
}: UseAuthGateScreenParams) {
  return useMemo(() => {
    if (!authReady) {
      return <SplashScreen t={t} styles={styles} isWeb={isWeb} wrapContent={wrapContent} />;
    }

    if (!session) {
      return (
        <AuthScreen
          t={t}
          styles={styles}
          isWeb={isWeb}
          wrapContent={wrapContent}
          languageButton={languageButton}
          languageModal={languageModal}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          authError={authError}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authLoading={authLoading}
          onAuth={onAuth}
        />
      );
    }

    return null;
  }, [
    authReady,
    session,
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
  ]);
}
