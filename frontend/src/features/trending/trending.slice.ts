import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import {
  TrendingState,
  GetTrendingListPayload,
  RemoveATrendingItemPayload,
} from './trending.types';

import trendingData from '../../demo-data/trending/trending-data';
import whoToFollow from '../../demo-data/trending/who-to-follow';

const initialState: TrendingState = {
  trendingList: [],
  whoToFollow: [],
};

const trendingSlice = createSlice({
  name: 'trending',
  initialState,
  reducers: {
    getTrendingList: (state, action: PayloadAction<GetTrendingListPayload>) => {
      state.trendingList =
        action.payload.type === 'trending-list'
          ? trendingData
          : trendingData.slice(0, 4);
    },

    removeATrendingItem: (
      state,
      action: PayloadAction<RemoveATrendingItemPayload>
    ) => {
      state.trendingList = state.trendingList.filter(
        item => item.id !== action.payload.itemId
      );
    },

    showWhoToFollow: state => {
      state.whoToFollow = whoToFollow;
    },
  },
});

export const selectTrendingList = (state: RootState) =>
  state.trending.trendingList;
export const selectWhoToFollow = (state: RootState) =>
  state.trending.whoToFollow;

export const { getTrendingList, removeATrendingItem, showWhoToFollow } =
  trendingSlice.actions;

export default trendingSlice.reducer;
