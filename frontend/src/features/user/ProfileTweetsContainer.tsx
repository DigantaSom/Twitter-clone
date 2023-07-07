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
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  return (
    <div>
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

export default ProfileTweetsContainer;
