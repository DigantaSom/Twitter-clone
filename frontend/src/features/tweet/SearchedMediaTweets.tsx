import { FC, memo } from 'react';

import { useGetSearchedMediaTweetsQuery } from './tweet.api-slice';

import TweetList from './TweetList';

interface SearchedMediaTweetsProps {
  searchText: string | null;
}

const SearchedMediaTweets: FC<SearchedMediaTweetsProps> = ({ searchText }) => {
  const {
    data: tweets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSearchedMediaTweetsQuery(
    { q: encodeURIComponent(searchText || '') },
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      skip: !searchText,
    }
  );

  return (
    <TweetList
      tweets={tweets}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
      showParentTweet={false}
    />
  );
};

export default memo(SearchedMediaTweets);
