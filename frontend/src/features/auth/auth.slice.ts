import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';
import { AuthState, SetCredenitalsPayload } from './auth.types';

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredenitalsPayload>) => {
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('persist', JSON.stringify(true));
    },
    logout: state => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('persist');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectCurrentToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
