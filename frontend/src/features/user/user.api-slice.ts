import { apiSlice } from '../../app/api/api.slice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signUp: builder.mutation({
      query: userData => ({
        url: '/api/users',
        method: 'POST',
        body: { ...userData },
      }),
      // forcing to invalidate the User list in the cache
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const { useSignUpMutation } = userApiSlice;
