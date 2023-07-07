import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/api.slice';
import { Tweet, TweetResponse } from '../tweet/tweet.types';
import { UserBasicInfo, UserProfile } from './user.types';

const USER_URL = '/api/users';

const tweetsAdapter = createEntityAdapter<Tweet>({
  // sorting: latest tweet comes first
  sortComparer: (a, b) => (a.creationDate < b.creationDate ? 1 : -1),
});
const initialState = tweetsAdapter.getInitialState();

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

    getBookmarks: builder.query<TweetResponse, void>({
      query: () => ({
        url: `${USER_URL}/bookmarks`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      transformResponse: (responseData: Tweet[]): any => {
        const loadedTweets = responseData.map(tweet => ({
          ...tweet,
          id: tweet?._id,
        }));
        return tweetsAdapter.setAll(initialState, loadedTweets);
      },
      providesTags: (result, error, args) => {
        if (result?.ids) {
          return [
            { type: 'Tweet', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Tweet' as const, id })),
          ];
        } else {
          // error
          return [{ type: 'Tweet', id: 'LIST' }];
        }
      },
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
      TweetResponse,
      { username: string | undefined }
    >({
      query: ({ username }) => ({
        url: `${USER_URL}/tweets/${username}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      transformResponse: (responseData: Tweet[]): any => {
        const loadedTweets = responseData.map(tweet => ({
          ...tweet,
          id: tweet?._id,
        }));
        return tweetsAdapter.setAll(initialState, loadedTweets);
      },
      providesTags: (result, error, args) => {
        if (result?.ids) {
          return [
            { type: 'Tweet', id: 'LIST' },
            ...result.ids.map(id => ({ type: 'Tweet' as const, id })),
          ];
        } else {
          // error
          return [{ type: 'Tweet', id: 'LIST' }];
        }
      },
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
} = userApiSlice;
