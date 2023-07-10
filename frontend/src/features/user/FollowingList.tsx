import { useParams } from 'react-router-dom';

import { useGetFollowingQuery } from './user.api-slice';

import FollowListContainer from './FollowListContainer';

const FollowingList = () => {
  const { username } = useParams();

  const {
    data: following,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetFollowingQuery({ username }, { pollingInterval: 20000 });

  return (
    <FollowListContainer
      type='Following'
      items={following}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
    />
  );
};

export default FollowingList;
