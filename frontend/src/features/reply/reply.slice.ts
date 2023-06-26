import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { ReplyState, CreateReplyPopupData } from './reply.types';

const initialState: ReplyState = {
  createReplyPopupData: {
    currentUser: null,
    parentTweetId: '',
    parentTweetDegree: 0,
    replyingTo: {
      profilePicture: '',
      fullName: '',
      username: '',
    },
    caption: '',
    isMediaPresent: false,
    creationDate: '',
  },
};

const replySlice = createSlice({
  name: 'reply',
  initialState,
  reducers: {
    setCreateReplyPopupData: (
      state,
      action: PayloadAction<CreateReplyPopupData>
    ) => {
      state.createReplyPopupData = action.payload;
    },
    clearCreateReplyPopupData: state => {
      state.createReplyPopupData = initialState.createReplyPopupData;
    },
  },
});

export const selectCreateReplyPopupData = (state: RootState) =>
  state.reply.createReplyPopupData;

export const { setCreateReplyPopupData, clearCreateReplyPopupData } =
  replySlice.actions;

export default replySlice.reducer;
