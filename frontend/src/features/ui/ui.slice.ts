import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  UiState,
  AuthModalType,
  LikedByPopup_Payload,
  EditProfilePopup_Payload,
  RetweetedByPopup_Payload,
} from './ui.types';
import { RootState } from '../../app/store';

const initialState: UiState = {
  isComposeTweetShown: false,
  authModal: {
    isShown: false,
    type: '', // in our logic, type: '' = isShown: false
  },
  isSubmitDisabled: true,
  isCreateReplyPopupShown: false,
  likedByPopup: {
    isShown: false,
    tweetId: null,
  },
  retweetedByPopup: {
    isShown: false,
    tweetId: null,
  },
  editProfilePopup: {
    isShown: false,
    username: undefined,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleComposeTweet: state => {
      state.isComposeTweetShown = !state.isComposeTweetShown;
    },
    toggleAuthModal: (state, action: PayloadAction<AuthModalType>) => {
      state.authModal.isShown = action.payload === '' ? false : true;
      state.authModal.type = action.payload;
    },
    handleSubmitDisabled: (state, action: PayloadAction<boolean>) => {
      state.isSubmitDisabled = action.payload;
    },
    toggleCreateReplyPopup: (state, action: PayloadAction<boolean>) => {
      state.isCreateReplyPopupShown = action.payload;
    },
    openLikedByPopup: (state, action: PayloadAction<LikedByPopup_Payload>) => {
      state.likedByPopup.isShown = true;
      state.likedByPopup.tweetId = action.payload.tweetId;
    },
    closeLikedByPopup: state => {
      state.likedByPopup.isShown = false;
      state.likedByPopup.tweetId = null;
    },
    openRetweetedByPopup: (
      state,
      action: PayloadAction<RetweetedByPopup_Payload>
    ) => {
      state.retweetedByPopup.isShown = true;
      state.retweetedByPopup.tweetId = action.payload.tweetId;
    },
    closeRetweetedByPopup: state => {
      state.retweetedByPopup.isShown = false;
      state.retweetedByPopup.tweetId = null;
    },
    openEditProfilePopup: (
      state,
      action: PayloadAction<EditProfilePopup_Payload>
    ) => {
      state.editProfilePopup.isShown = true;
      state.editProfilePopup.username = action.payload.username;
    },
    closeEditProfilePopup: state => {
      state.editProfilePopup.isShown = false;
      state.editProfilePopup.username = undefined;
    },
  },
});

export const selectIsComposeTweetShown = (state: RootState) =>
  state.ui.isComposeTweetShown;

export const selectAuthModal = (state: RootState) => state.ui.authModal;

export const selectIsSubmitDisabled = (state: RootState) =>
  state.ui.isSubmitDisabled;

export const selectIsCreateReplyPopupShown = (state: RootState) =>
  state.ui.isCreateReplyPopupShown;

export const selectIsLikedByPopupShown = (state: RootState) =>
  state.ui.likedByPopup.isShown;
export const selectLikedByPopupTweetId = (state: RootState) =>
  state.ui.likedByPopup.tweetId;

export const selectIsRetweetedByPopupShown = (state: RootState) =>
  state.ui.retweetedByPopup.isShown;
export const selectRetweetedByPopupTweetId = (state: RootState) =>
  state.ui.retweetedByPopup.tweetId;

export const selectIsEditProfilePopupShown = (state: RootState) =>
  state.ui.editProfilePopup.isShown;
export const selectEditProfilePopupUsername = (state: RootState) =>
  state.ui.editProfilePopup.username;

export const {
  toggleComposeTweet,
  toggleAuthModal,
  handleSubmitDisabled,
  toggleCreateReplyPopup,
  openLikedByPopup,
  closeLikedByPopup,
  openRetweetedByPopup,
  closeRetweetedByPopup,
  openEditProfilePopup,
  closeEditProfilePopup,
} = uiSlice.actions;

export default uiSlice.reducer;
