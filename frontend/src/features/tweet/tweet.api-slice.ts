import { apiSlice } from '../../app/api/api.slice';

import {
  Tweet,
  AddNewTweetArg,
  DeleteTweetArg,
  LikeTweetArg,
  LikeResponse,
  BookmarkTweetArg,
  BookmarkResponse,
  GetRepliesArg,
} from './tweet.types';

export const tweetApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTweets: builder.query<Tweet[], void>({
      query: () => ({
        url: '/api/tweets',
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

    getTweetById: builder.query<Tweet, { id: string }>({
      query: arg => ({
        url: `/api/tweets/${arg.id}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: (result, error, arg) => [{ type: 'Tweet', id: arg.id }],
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

    deleteTweet: builder.mutation<any, DeleteTweetArg>({
      query: arg => ({
        url: `/api/tweets/${arg.tweetId}`,
        method: 'DELETE',
        body: { parentTweetId: arg.parentTweetId },
      }),
      // invalidating only the deleted Tweet object in the cache
      invalidatesTags: (result, error, arg) => [
        { type: 'Tweet', id: arg.tweetId },
      ],
    }),

    likeTweet: builder.mutation<LikeResponse, LikeTweetArg>({
      query: arg => ({
        url: `api/tweets/like/${arg.tweetId}`,
        method: 'PUT',
      }),
      // invalidating only the updated Tweet object in the cache
      invalidatesTags: (result, error, arg) => [
        { type: 'Tweet', id: arg.tweetId },
      ],
    }),

    bookmarkTweet: builder.mutation<BookmarkResponse, BookmarkTweetArg>({
      query: arg => ({
        url: `api/tweets/bookmark/${arg.tweetId}`,
        method: 'PUT',
      }),
      // invalidating only the updated Tweet object in the cache
      invalidatesTags: (result, error, arg) => [
        { type: 'Tweet', id: arg.tweetId },
      ],
    }),

    getReplies: builder.query<Tweet[], GetRepliesArg>({
      query: ({ parentTweetId }) => ({
        url: `api/tweets/replies/${parentTweetId}`,
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
  useGetTweetsQuery,
  useGetTweetByIdQuery,
  useAddNewTweetMutation,
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useBookmarkTweetMutation,
  useGetRepliesQuery,
} = tweetApiSlice;
