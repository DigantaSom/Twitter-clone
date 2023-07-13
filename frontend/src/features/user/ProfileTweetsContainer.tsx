import { useParams } from 'react-router-dom';

import { useGetTweetsByUsernameQuery } from './user.api-slice';

import TweetList from '../tweet/TweetList';

const ProfileTweetsContainer = () => {
  const { username } = useParams();

  const {
    data: tweets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTweetsByUsernameQuery(
    { username },
    { pollingInterval: 30000, refetchOnReconnect: true }
  );

  return (
    <TweetList
      showParentTweet={false}
      tweets={tweets}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
    />
  );
};

export default ProfileTweetsContainer;
