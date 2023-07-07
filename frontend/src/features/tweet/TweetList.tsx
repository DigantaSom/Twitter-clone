import { FC } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';

import PulseLoader from 'react-spinners/PulseLoader';

import { Tweet } from './tweet.types';

import TweetItem from './TweetItem';

interface TweetListProps {
  tweets: Tweet[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

const TweetList: FC<TweetListProps> = ({
  tweets,
  isLoading,
  isSuccess,
  isError,
  error,
}) => {
  let content;

  if (isLoading) {
    content = <PulseLoader color='#1D9BF0' />; // same as twitter-default color
  } else if (isError) {
    console.log('Error loading tweets', error);
    content = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || 'Error loading tweets.'}
      </div>
    );
  } else if (isSuccess && tweets?.length) {
    content = tweets.map(tweet => <TweetItem key={tweet._id} tweet={tweet} />);
  }

  return <>{content}</>;
};

export default TweetList;
