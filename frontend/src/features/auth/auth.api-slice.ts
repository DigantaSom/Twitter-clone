import { apiSlice } from '../../app/api/api.slice';
import { AuthResponse, LoginMutationArg } from './auth.types';
import { logout, setCredentials } from './auth.slice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginMutationArg>({
      query: (credentials: LoginMutationArg) => ({
        url: '/api/auth',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(logout());
          // clears cache, query subscriptions and everything to do with our 'apiSlice'
          dispatch(apiSlice.util.resetApiState());
        } catch (err) {
          console.log('Error while logging out:', err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/api/auth/refresh',
        method: 'GET',
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ accessToken: data.accessToken }));
        } catch (err) {
          console.log('Error while sending refresh token:', err);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
