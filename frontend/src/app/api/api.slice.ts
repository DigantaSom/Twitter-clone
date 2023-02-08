import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryApi,
} from '@reduxjs/toolkit/query/react';

import { RootState } from '../store';
import { AuthResponse } from '../../features/auth/auth.types';
import { setCredentials } from '../../features/auth/auth.slice';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5001',
  credentials: 'include', // so we will always send our cookie (to have refresh token when needed)
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    console.log('Sending refresh token');

    // Send refresh token to get the new access token
    const refreshResult = await baseQuery(
      '/api/auth/refresh',
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(
        setCredentials({
          accessToken: (refreshResult.data as AuthResponse).accessToken,
        })
      );
      // retry the original query with the new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        (refreshResult.error.data as any).message = 'Your login has expired';
      }
      return refreshResult;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Tweet', 'Reply'],
  endpoints: builder => ({}),
});
