import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/api.slice';
import { Tweet, TweetResponse, AddNewTweetArg } from './tweet.types';

const tweetsAdapter = createEntityAdapter<Tweet>({
  // sorting: latest tweet comes first
  sortComparer: (a, b) => (a.creationDate < b.creationDate ? 1 : -1),
});

const initialState = tweetsAdapter.getInitialState();

export const tweetApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTweets: builder.query<TweetResponse, void>({
      query: () => ({
        url: '/api/tweets',
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      transformResponse: (responseData: Tweet[]): any => {
        const loadedTweets = responseData.map(tweet => ({
          ...tweet,
          id: tweet._id,
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

    addNewTweet: builder.mutation<Tweet | any, AddNewTweetArg>({
      query: tweetData => ({
        url: '/api/tweets',
        method: 'POST',
        body: { ...tweetData },
      }),
      // forcing to invalidate the Tweet list in the cache
      invalidatesTags: [{ type: 'Tweet', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const { useGetTweetsQuery, useAddNewTweetMutation } = tweetApiSlice;