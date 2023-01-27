import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { apiSlice } from './api/api.slice';
import uiReducer from '../features/ui/ui.slice';
import authReducer from '../features/auth/auth.slice';
import tweetReducer from '../features/tweet/tweet.slice';
import trendingReducer from '../features/trending/trending.slice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    ui: uiReducer,
    auth: authReducer,
    tweet: tweetReducer,
    trending: trendingReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// to enable options in RTK Query hooks
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
