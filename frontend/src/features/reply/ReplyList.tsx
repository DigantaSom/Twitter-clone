import { FC, memo } from 'react';
import { PulseLoader } from 'react-spinners';

import { useGetRepliesQuery } from './reply.api-slice';

import ReplyItem from './ReplyItem';

interface ReplyListProps {
  parentTweetId: string;
}

const ReplyList: FC<ReplyListProps> = ({ parentTweetId }) => {
  const {
    data: replies,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetRepliesQuery(
    { parentTweetId },
    {
      pollingInterval: 15000, // every 15s on this page, it will requery the data
      refetchOnMountOrArgChange: true, // refetch on component mount
    }
  );

  let content;

  if (isLoading) {
    content = <PulseLoader color='#1D9BF0' />; // same as twitter-default color
  } else if (isError) {
    console.log('Error loading replies', error);
    content = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || 'Error loading replies'}
      </div>
    );
  } else if (isSuccess && replies?.ids.length) {
    content = replies.ids.map(tweetId => (
      <ReplyItem
        key={tweetId}
        parentTweetId={parentTweetId}
        tweetId={tweetId}
      />
    ));
  }

  return <>{content}</>;
};

export default memo(ReplyList);
