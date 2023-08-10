import { apiSlice } from '../../app/api/api.slice';

import {
  Tweet,
  AddNewTweetArg,
  DeleteTweetArg,
  TweetIdArg,
  RetweetArgs,
  LikeResponse,
  SingleMessageResponse,
  GetRepliesArg,
  GetRetweetedPostId_Response,
  GetRetweetedPostId_Args,
} from './tweet.types';

const TWEET_URL = '/api/tweets';

export const tweetApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTweets: builder.query<Tweet[], void>({
      query: () => ({
        url: TWEET_URL,
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
        url: `${TWEET_URL}/${arg.id}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: (result, error, arg) => [{ type: 'Tweet', id: arg.id }],
    }),

    addNewTweet: builder.mutation<Tweet | any, AddNewTweetArg>({
      query: tweetData => ({
        url: TWEET_URL,
        method: 'POST',
        body: { ...tweetData },
      }),
      // forcing to invalidate the Tweet list in the cache
      invalidatesTags: [{ type: 'Tweet', id: 'LIST' }],
    }),

    retweet: builder.mutation<SingleMessageResponse, RetweetArgs>({
      query: ({ refTweetId, retweetedPostId }) => ({
        url: `${TWEET_URL}/retweet?refTweetId=${refTweetId}&retweetedPostId=${retweetedPostId}`,
        method: 'POST',
      }),
      invalidatesTags: () => [{ type: 'Tweet', id: 'LIST' }],
    }),

    getRetweetedPostId: builder.query<
      GetRetweetedPostId_Response,
      GetRetweetedPostId_Args
    >({
      query: ({ refTweetId, loggedInUsername }) => ({
        url: `${TWEET_URL}/getRetweetedPostId/${refTweetId}?loggedInUsername=${loggedInUsername?.toLowerCase()}`,
        method: 'GET',
      }),
      providesTags: (result, error, args) => [
        { type: 'Tweet', id: args.refTweetId },
        { type: 'Tweet', id: result?.loggedInUser_retweetedPostId },
      ],
    }),

    deleteTweet: builder.mutation<any, DeleteTweetArg>({
      query: arg => ({
        url: `${TWEET_URL}/${arg.tweetId}`,
        method: 'DELETE',
        body: { parentTweetId: arg.parentTweetId },
      }),
      // invalidating only the deleted Tweet object in the cache
      invalidatesTags: (result, error, arg) => [
        { type: 'Tweet', id: arg.tweetId },
      ],
    }),

    likeTweet: builder.mutation<LikeResponse, TweetIdArg>({
      query: arg => ({
        url: `${TWEET_URL}/like/${arg.tweetId}`,
        method: 'PUT',
      }),
      // invalidating only the updated Tweet object in the cache
      invalidatesTags: (result, error, arg) => [
        { type: 'Tweet', id: arg.tweetId },
      ],
    }),

    bookmarkTweet: builder.mutation<SingleMessageResponse, TweetIdArg>({
      query: arg => ({
        url: `${TWEET_URL}/bookmark/${arg.tweetId}`,
        method: 'PUT',
      }),
      // invalidating only the updated Tweet object in the cache
      invalidatesTags: (result, error, arg) => [
        { type: 'Tweet', id: arg.tweetId },
      ],
    }),

    getReplies: builder.query<Tweet[], GetRepliesArg>({
      query: ({ parentTweetId }) => ({
        url: `${TWEET_URL}/replies/${parentTweetId}`,
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
  useRetweetMutation,
  useGetRetweetedPostIdQuery,
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useBookmarkTweetMutation,
  useGetRepliesQuery,
} = tweetApiSlice;
