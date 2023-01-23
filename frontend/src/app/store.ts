import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import uiReducer from '../features/ui/ui.slice';
import trendingReducer from '../features/trending/trending.slice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    trending: trendingReducer,
  },
  devTools: true,
});

// to enable options in RTK Query hooks
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
