import { apiSlice } from '../../app/api/api.slice';
import { logout } from './auth.slice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
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
  }),
  overrideExisting: true,
});

export const { useLoginMutation, useSendLogoutMutation } = authApiSlice;
