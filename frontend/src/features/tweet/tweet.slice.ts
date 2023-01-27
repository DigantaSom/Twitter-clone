import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { TweetState, AddNewTweetArg } from './tweet.types';

const initialState: TweetState = {
  newTweetData: {
    caption: '',
    media: [''],
  },
};

const tweetSlice = createSlice({
  name: 'tweet',
  initialState,
  reducers: {
    setNewTweetData: (state, action: PayloadAction<AddNewTweetArg>) => {
      state.newTweetData = action.payload;
    },
    clearNewTweetData: state => {
      state.newTweetData = {
        caption: '',
        media: [''],
      };
    },
  },
});

export const selectNewTweetData = (state: RootState) =>
  state.tweet.newTweetData;

export const { setNewTweetData, clearNewTweetData } = tweetSlice.actions;

export default tweetSlice.reducer;
