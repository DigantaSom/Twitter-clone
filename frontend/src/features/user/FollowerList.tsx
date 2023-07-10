import { useParams } from 'react-router-dom';

import { useGetFollowersQuery } from './user.api-slice';

import FollowListContainer from './FollowListContainer';

const FollowerList = () => {
  const { username } = useParams();

  const {
    data: followers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetFollowersQuery({ username }, { pollingInterval: 20000 });

  return (
    <FollowListContainer
      type='Followers'
      items={followers}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
    />
  );
};

export default FollowerList;
