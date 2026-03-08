import { Dispatch, SetStateAction } from 'react';
import { Session } from '@supabase/supabase-js';
import { Plan, UserProfile } from '../../../types';
import { useAuthActions } from '../../features/auth/hooks/useAuthActions';
import { useAuthGateScreen } from '../../features/auth/hooks/useAuthGateScreen';
import { useProfileAccountActions } from '../../features/auth/hooks/useProfileAccountActions';
import { AppScreen, AuthMode, PotHistoryEntry } from '../../features/common/hooks/useAppFlowState';

type Translate = (key: string, options?: Record<string, unknown>) => string;

type UseAppAuthControllerParams = {
  authReady: boolean;
  session: Session | null;
  t: Translate;
  styles: any;
  isWeb: boolean;
  wrapContent: (children: React.ReactNode) => React.ReactNode;
  languageButton: React.ReactNode;
  languageModal: React.ReactNode;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  authError: string | null;
  authMode: AuthMode;
  setAuthMode: Dispatch<SetStateAction<AuthMode>>;
  authLoading: boolean;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  setAuthError: Dispatch<SetStateAction<string | null>>;
  setScreen: Dispatch<SetStateAction<AppScreen>>;
  profile: UserProfile;
  setAccountDeleting: Dispatch<SetStateAction<boolean>>;
  setPlans: Dispatch<SetStateAction<Plan[]>>;
  setPotHistories: Dispatch<SetStateAction<Record<string, PotHistoryEntry>>>;
  setCurrentPlan: Dispatch<SetStateAction<Partial<Plan>>>;
  setProfile: Dispatch<SetStateAction<UserProfile>>;
  setOnboardingStep: Dispatch<SetStateAction<1 | 2>>;
  calculateBMR: (profile: UserProfile) => number;
  calculateTDEE: (profile: UserProfile) => number;
  calculateTargetPFC: (profile: UserProfile, tdee: number) => Plan['targetPFC'];
};

export function useAppAuthController({
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
  setAuthLoading,
  setAuthError,
  setScreen,
  profile,
  setAccountDeleting,
  setPlans,
  setPotHistories,
  setCurrentPlan,
  setProfile,
  setOnboardingStep,
  calculateBMR,
  calculateTDEE,
  calculateTargetPFC,
}: UseAppAuthControllerParams) {
  const { handleAuth, handleSignOut } = useAuthActions({
    authMode,
    email,
    password,
    setAuthLoading,
    setAuthError,
    setScreen,
    session,
  });

  const { handleSaveProfile, handleDeleteAccount } = useProfileAccountActions({
    session,
    profile,
    setScreen,
    setAccountDeleting,
    setPlans,
    setPotHistories,
    setCurrentPlan,
    setProfile,
    setOnboardingStep,
    t,
    calculateBMR,
    calculateTDEE,
    calculateTargetPFC,
  });

  const authGateScreen = useAuthGateScreen({
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
    onAuth: handleAuth,
  });

  return {
    handleSignOut,
    handleSaveProfile,
    handleDeleteAccount,
    authGateScreen,
  };
}
