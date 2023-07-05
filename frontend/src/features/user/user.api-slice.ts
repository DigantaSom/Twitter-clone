import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/api.slice';
import { Tweet, TweetResponse } from '../tweet/tweet.types';
import { UserBasicInfo } from './user.types';

const USER_URL = '/api/users';

const tweetsAdapter = createEntityAdapter<Tweet>({});
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

    getUserBasicInfo: builder.query<UserBasicInfo, { userId: string }>({
      query: ({ userId }) => ({
        url: `${USER_URL}/basic/${userId}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
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
    }),
  }),
  overrideExisting: true,
});

export const {
  useSignUpMutation,
  useGetUserBasicInfoQuery,
  useGetBookmarksQuery,
} = userApiSlice;
