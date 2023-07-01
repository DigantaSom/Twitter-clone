import { useGetTweetsQuery } from '../features/tweet/tweet.api-slice';

import Header from './Header';
import CreateTweet from '../features/tweet/CreateTweet';
import TweetList from '../features/tweet/TweetList';

const Feed = () => {
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

  return (
    // this margin-bottom is to compensate for the height of <BottomNavigation /> i.e. h-12
    <div className='mb-12'>
      <Header parentComponent='Feed' />
      <CreateTweet from='Feed' />
      <TweetList
        tweets={tweets}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default Feed;
