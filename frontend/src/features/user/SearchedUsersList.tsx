import { FC, memo } from 'react';

import useAuth from '../../hooks/useAuth';
import { useGetSearchedUsersQuery } from './user.api-slice';

import CustomLoadingSpinner from '../../components/CustomLoadingSpinner';
import UserListItem from './UserListItem';

interface SearchedUsersListProps {
  searchText: string | null;
}

const SearchedUsersList: FC<SearchedUsersListProps> = ({ searchText }) => {
  const auth = useAuth();

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSearchedUsersQuery(
    { q: encodeURIComponent(searchText || '') },
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      skip: !searchText,
    }
  );

  let content = <></>;

  if (isLoading) {
    content = <CustomLoadingSpinner marginTopClass='mt-[10vh]' />;
  } else if (isError) {
    console.log('Error loading users', error);
    content = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || 'Error loading users.'}
      </div>
    );
  } else if (isSuccess && users?.length) {
    content = (
      <div>
        {users.map(({ _id }) => (
          <UserListItem key={_id} userId={_id} loggedInUserId={auth.user?.id} />
        ))}
      </div>
    );
  }

  return content;
};

export default memo(SearchedUsersList);
