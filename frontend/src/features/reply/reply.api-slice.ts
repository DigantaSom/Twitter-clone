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
      // forcing to invalidate the Reply list in the cache
      invalidatesTags: [{ type: 'Reply', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const { useAddNewReplyMutation } = replyApiSlice;
