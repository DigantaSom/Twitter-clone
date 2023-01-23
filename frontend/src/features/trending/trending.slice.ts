import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { TrendingState } from './trending.types';

import whatsHappening from '../../demo-data/trending/whats-happening';
import whoToFollow from '../../demo-data/trending/who-to-follow';

const initialState: TrendingState = {
  whatsHappening: [],
  whoToFollow: [],
};

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {
    showWhatsHappening: state => {
      state.whatsHappening = whatsHappening;
    },
    showWhoToFollow: state => {
      state.whoToFollow = whoToFollow;
    },
  },
});

export const selectWhatsHappening = (state: RootState) =>
  state.trending.whatsHappening;
export const selectWhoToFollow = (state: RootState) =>
  state.trending.whoToFollow;

export const { showWhatsHappening, showWhoToFollow } = trendingSlice.actions;

export default trendingSlice.reducer;
