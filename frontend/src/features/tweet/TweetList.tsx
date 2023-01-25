import PulseLoader from 'react-spinners/PulseLoader';

import { useGetTweetsQuery } from './tweet.api-slice';

import TweetItem from './TweetItem';

const TweetList = () => {
  const {
    data: tweets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTweetsQuery(undefined, {
    pollingInterval: 15000, // every 15s on this page, it will requery the data
    refetchOnFocus: true, // refetch on putting focus back to browser window
    refetchOnMountOrArgChange: true, // refetch on component mount
  });

  let content;

  if (isLoading) {
    content = <PulseLoader color='#fff' />;
  } else if (isError) {
    console.log('Error loading tweets', error);
    content = <p>{(error as any)?.data?.message}</p>;
  } else if (isSuccess && tweets?.ids.length) {
    content = tweets.ids.map(tweetId => (
      <TweetItem key={tweetId} tweetId={tweetId} />
    ));
  }

  return <>{content}</>;
};

export default TweetList;
