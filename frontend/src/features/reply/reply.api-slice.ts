import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../../app/api/api.slice';
import { Tweet, TweetResponse } from '../tweet/tweet.types';
import { GetRepliesArg } from './reply.types';

const tweetsAdapter = createEntityAdapter<Tweet>({
  // sorting: latest tweet comes first
  sortComparer: (a, b) => (a.creationDate < b.creationDate ? 1 : -1),
});

const initialState = tweetsAdapter.getInitialState();

const REPLIES_BASE_URL = `/api/tweets/replies`;

export const replyApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getReplies: builder.query<TweetResponse, GetRepliesArg>({
      query: arg => ({
        url: `${REPLIES_BASE_URL}/${arg.parentTweetId}`,
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
  }),
  overrideExisting: true,
});

export const { useGetRepliesQuery } = replyApiSlice;
