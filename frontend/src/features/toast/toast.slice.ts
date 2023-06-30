import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { ToastState } from './toast.types';

const initialState: ToastState = {
  type: 'bookmark-add',
  message: '',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    setToast: (state, action: PayloadAction<ToastState>) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    removeToast: () => initialState,
  },
});

export const selectToastType = (state: RootState) => state.toast.type;
export const selectToastMessage = (state: RootState) => state.toast.message;

export const { setToast, removeToast } = toastSlice.actions;

export default toastSlice.reducer;
