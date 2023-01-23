import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { UiState, AuthModalType } from './ui.types';
import { RootState } from '../../app/store';

const initialState: UiState = {
  isComposeTweetShown: false,
  authModal: {
    isShown: false,
    type: '', // in our logic, type: '' = isShown: false
  },
  isSubmitDisabled: true,
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
  },
});

export const selectIsComposeTweetShown = (state: RootState) =>
  state.ui.isComposeTweetShown;
export const selectAuthModal = (state: RootState) => state.ui.authModal;
export const selectIsSubmitDisabled = (state: RootState) =>
  state.ui.isSubmitDisabled;

export const { toggleComposeTweet, toggleAuthModal, handleSubmitDisabled } =
  uiSlice.actions;

export default uiSlice.reducer;
