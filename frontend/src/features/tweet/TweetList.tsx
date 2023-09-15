import { FC, memo } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import { Tweet } from './tweet.types';

import CustomLoadingSpinner from '../../components/CustomLoadingSpinner';
import TweetItemContainer from './TweetItemContainer';

interface TweetListProps {
  showParentTweet: boolean;
  tweets: Tweet[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

const TweetList: FC<TweetListProps> = ({
  showParentTweet,
  tweets,
  isLoading,
  isSuccess,
  isError,
  error,
}) => {
  let content;

  if (isLoading) {
    content = <CustomLoadingSpinner marginTopClass='mt-[10vh]' />;
  } else if (isError) {
    console.log('Error loading tweets', error);
    content = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || 'Error loading tweets.'}
      </div>
    );
  } else if (isSuccess && tweets?.length) {
    content = tweets.map(tweet => (
      <TweetItemContainer
        key={tweet._id}
        tweet={tweet}
        showParentTweet={showParentTweet}
      />
    ));
  }

  return <>{content}</>;
};

export default memo(TweetList);
