import { useParams } from 'react-router-dom';

import { useGetRepliesOfUserQuery } from './user.api-slice';

import TweetList from '../tweet/TweetList';

const ProfileRepliesContainer = () => {
  const { username } = useParams();

  const {
    data: replies,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetRepliesOfUserQuery(
    { username },
    { pollingInterval: 30000, refetchOnReconnect: true }
  );

  return (
    <TweetList
      showParentTweet={true}
      tweets={replies}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
    />
  );
};

export default ProfileRepliesContainer;
