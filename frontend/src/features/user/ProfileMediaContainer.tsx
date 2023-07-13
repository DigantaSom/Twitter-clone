import { useParams } from 'react-router-dom';

import { useGetMediaTweetsByUsernameQuery } from './user.api-slice';

import TweetList from '../tweet/TweetList';

const ProfileMediaContainer = () => {
  const { username } = useParams();

  const {
    data: tweets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMediaTweetsByUsernameQuery(
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

export default ProfileMediaContainer;
