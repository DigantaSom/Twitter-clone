export interface UiState {
  isComposeTweetShown: boolean;
  authModal: {
    isShown: boolean;
    type: AuthModalType;
  };
  isSubmitDisabled: boolean;
  isCreateReplyPopupShown: boolean;
  likedByPopup: LikedByPopup_Payload & {
    isShown: boolean;
  };
}

export type AuthModalType =
  | 'signup'
  | 'login'
  | 'signup-form'
  | 'login-form'
  | '';

export type LikedByPopup_Payload = {
  tweetId: string | null;
};
