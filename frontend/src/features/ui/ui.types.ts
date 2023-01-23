export interface UiState {
  isComposeTweetShown: boolean;
  authModal: {
    isShown: boolean;
    type: AuthModalType;
  };
  isSubmitDisabled: boolean;
}

export type AuthModalType =
  | 'signup'
  | 'login'
  | 'signup-form'
  | 'login-form'
  | '';
