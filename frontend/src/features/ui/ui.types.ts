export interface UiState {
  isComposeTweetShown: boolean;
  authModal: {
    isShown: boolean;
    type: AuthModalType;
  };
  isCreateReplyPopupShown: boolean;
  likedByPopup: LikedByPopup_Payload & { isShown: boolean };
  retweetedByPopup: RetweetedByPopup_Payload & { isShown: boolean };
  quoteTweetPopup: QuoteTweetPopup_Payload & { isShown: boolean };
  editProfilePopup: EditProfilePopup_Payload & { isShown: boolean };
  is_PhoneSideNavigation_Shown: boolean;
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

export type RetweetedByPopup_Payload = LikedByPopup_Payload;

export type QuoteTweetPopup_Payload = {
  quoteRefTweetId: string | null;
};

export type EditProfilePopup_Payload = {
  username: string | undefined;
};
