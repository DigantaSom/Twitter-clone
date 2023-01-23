import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import trendingReducer from '../features/trending/trending.slice';

export const store = configureStore({
  reducer: {
    trending: trendingReducer,
  },
  devTools: true,
});

// to enable options in RTK Query hooks
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
