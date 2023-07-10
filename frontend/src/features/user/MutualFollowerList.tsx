import { useParams } from 'react-router-dom';
import FollowListContainer from './FollowListContainer';

import { useGetMututalFollowersQuery } from './user.api-slice';

const MutualFollowerList = () => {
  const { username } = useParams();

  const {
    data: mutualFollowing,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMututalFollowersQuery({ username }, { pollingInterval: 20000 });

  return (
    <FollowListContainer
      type='Mututal Followers'
      items={mutualFollowing}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
    />
  );
};

export default MutualFollowerList;
