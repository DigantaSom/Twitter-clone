import { apiSlice } from '../../app/api/api.slice';

import { Tweet } from '../tweet/tweet.types';
import { UserBasicInfo, UserProfile } from './user.types';

const USER_URL = '/api/users';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    signUp: builder.mutation({
      query: userData => ({
        url: USER_URL,
        method: 'POST',
        body: { ...userData },
      }),
      // forcing to invalidate the User list in the cache
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    getBookmarks: builder.query<Tweet[], void>({
      query: () => ({
        url: `${USER_URL}/bookmarks`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: result =>
        result
          ? [
              { type: 'Tweet', id: 'LIST' },
              ...result.map(({ _id }) => ({ type: 'Tweet' as const, _id })),
            ]
          : [{ type: 'Tweet', id: 'LIST' }],
    }),

    getUserBasicInfo: builder.query<UserBasicInfo, { userId: string }>({
      query: ({ userId }) => ({
        url: `${USER_URL}/basic/${userId}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
    }),

    getProfile: builder.query<UserProfile, { username: string | undefined }>({
      query: ({ username }) => ({
        url: `${USER_URL}/profile/${username}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: (result, error, arg) => [
        { type: 'User', id: arg.username },
      ],
    }),

    getTweetsByUsername: builder.query<
      Tweet[],
      { username: string | undefined }
    >({
      query: ({ username }) => ({
        url: `${USER_URL}/tweets/${username}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: result =>
        result
          ? [
              { type: 'Tweet', id: 'LIST' },
              ...result.map(({ _id }) => ({ type: 'Tweet' as const, _id })),
            ]
          : [{ type: 'Tweet', id: 'LIST' }],
    }),

    getRepliesByUsername: builder.query<
      Tweet[],
      { username: string | undefined }
    >({
      query: ({ username }) => ({
        url: `${USER_URL}/replies/${username}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: result =>
        result
          ? [
              { type: 'Tweet', id: 'LIST' },
              ...result.map(({ _id }) => ({ type: 'Tweet' as const, _id })),
            ]
          : [{ type: 'Tweet', id: 'LIST' }],
    }),

    getMediaTweetsByUsername: builder.query<
      Tweet[],
      { username: string | undefined }
    >({
      query: ({ username }) => ({
        url: `${USER_URL}/media-tweets/${username}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: result =>
        result
          ? [
              { type: 'Tweet', id: 'LIST' },
              ...result.map(({ _id }) => ({ type: 'Tweet' as const, _id })),
            ]
          : [{ type: 'Tweet', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSignUpMutation,
  useGetBookmarksQuery,
  useGetUserBasicInfoQuery,
  useGetProfileQuery,
  useGetTweetsByUsernameQuery,
  useGetRepliesByUsernameQuery,
  useGetMediaTweetsByUsernameQuery,
} = userApiSlice;
