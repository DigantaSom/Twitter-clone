import { FC } from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { PulseLoader } from 'react-spinners';

import { FollowObjectArray } from './user.types';
import useAuth from '../../hooks/useAuth';

import UserListItem from './UserListItem';

interface FollowListContainerProps {
  type: 'Mututal Followers' | 'Followers' | 'Following';
  items: FollowObjectArray | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: FetchBaseQueryError | SerializedError | undefined;
}

const FollowListContainer: FC<FollowListContainerProps> = ({
  type,
  items,
  isLoading,
  isSuccess,
  isError,
  error,
}) => {
  const auth = useAuth();

  let content;

  if (isLoading) {
    content = <PulseLoader color='#1D9BF0' />; // same as twitter-default color
  } else if (isError) {
    console.log(`Error loading ${type} list: ${JSON.stringify(error)}`);
    content = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || `Error loading ${type} list.`}
      </div>
    );
  } else if (isSuccess && items?.length) {
    content = items.map(item => (
      <UserListItem
        key={item._id}
        userId={item.userId}
        loggedInUserId={auth.user?.id}
      />
    ));
  }

  return <>{content}</>;
};

export default FollowListContainer;
