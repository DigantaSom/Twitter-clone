import { apiSlice } from '../../app/api/api.slice';

import { Tweet } from '../tweet/tweet.types';
import {
  UserBasicInfo,
  UserProfile,
  UsernameArg,
  FollowUserResponse,
  GetProfileArgs,
  FollowUserArgs,
} from './user.types';

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

    getUserBasicInfo: builder.query<
      UserBasicInfo,
      { userId: string; loggedInUserId: string | undefined }
    >({
      query: ({ userId, loggedInUserId }) => ({
        url: `${USER_URL}/basic?userId=${userId}&loggedInUserId=${loggedInUserId}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: (result, error, arg) => [{ type: 'User', id: arg.userId }],
    }),

    getProfile: builder.query<UserProfile, GetProfileArgs>({
      query: ({ username, loggedInUserId }) => ({
        url: `${USER_URL}/profile?username=${username}&loggedInUserId=${loggedInUserId}`,
        method: 'GET',
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      providesTags: (result, error, arg) => [
        { type: 'User', id: arg.username },
      ],
    }),

    getTweetsByUsername: builder.query<Tweet[], UsernameArg>({
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

    getRepliesByUsername: builder.query<Tweet[], UsernameArg>({
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

    getMediaTweetsByUsername: builder.query<Tweet[], UsernameArg>({
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

    getLikedTweetsByUsername: builder.query<Tweet[], UsernameArg>({
      query: ({ username }) => ({
        url: `${USER_URL}/liked-tweets/${username}`,
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

    followUser: builder.mutation<FollowUserResponse, FollowUserArgs>({
      query: ({ targetUserId }) => ({
        url: `${USER_URL}/follow/${targetUserId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'User', id: args.targetUserId },
        { type: 'User', id: args.loggedInUserId },
      ],
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
  useGetLikedTweetsByUsernameQuery,
  useFollowUserMutation,
} = userApiSlice;
