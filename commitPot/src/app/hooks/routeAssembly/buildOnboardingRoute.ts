import { PROFILE_LIMITS } from '../../../features/common/constants/appUiConfig';

type BuildOnboardingRouteParams = {
  profile: any;
  setProfile: any;
  parseNumericInput: (text: string) => number;
  showValidationErrors: boolean;
  setShowValidationErrors: any;
  onboardingStep: 1 | 2;
  setOnboardingStep: any;
  tdee: number;
  targetPFC: any;
  accountDeleting: boolean;
  handleSignOut: () => Promise<void>;
  handleDeleteAccount: () => void;
  handleSaveProfile: () => Promise<void>;
};

export function buildOnboardingRoute(params: BuildOnboardingRouteParams) {
  return {
    profile: params.profile,
    setProfile: params.setProfile,
    parseNumericInput: params.parseNumericInput,
    profileLimits: PROFILE_LIMITS,
    showValidationErrors: params.showValidationErrors,
    setShowValidationErrors: params.setShowValidationErrors,
    onboardingStep: params.onboardingStep,
    setOnboardingStep: params.setOnboardingStep,
    tdee: params.tdee,
    targetPFC: params.targetPFC,
    accountDeleting: params.accountDeleting,
    handleSignOut: params.handleSignOut,
    handleDeleteAccount: params.handleDeleteAccount,
    handleSaveProfile: params.handleSaveProfile,
  };
}
