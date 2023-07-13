import { useParams } from 'react-router-dom';

import { useGetLikedTweetsByUsernameQuery } from './user.api-slice';

import TweetList from '../tweet/TweetList';

const ProfileLikesContainer = () => {
  const { username } = useParams();

  const {
    data: tweets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetLikedTweetsByUsernameQuery(
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

export default ProfileLikesContainer;
