import { apiSlice } from '../../app/api/api.slice';
import { AddNewReplyArg, Reply } from './reply.types';

const REPLIES_BASE_URL = `/api/replies`;

export const replyApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addNewReply: builder.mutation<Reply | any, AddNewReplyArg>({
      query: replyData => ({
        url: `${REPLIES_BASE_URL}/${replyData.tweetId}`,
        method: 'PUT',
        body: {
          text: replyData.text,
          media: replyData.media,
        },
      }),
      // forcing to invalidate the whole Tweet item in the cache
      invalidatesTags: (result, error, arg) => [
        { type: 'Tweet', id: arg.tweetId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const { useAddNewReplyMutation } = replyApiSlice;
