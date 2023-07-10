import { Outlet, useParams } from 'react-router-dom';
import { useGetProfileQuery } from '../features/user/user.api-slice';

import FollowPageHeader from '../headers/FollowPageHeader';
import useAuth from '../hooks/useAuth';

const FollowPage = () => {
  const { username } = useParams();
  const auth = useAuth();

  const { data: profile } = useGetProfileQuery({
    username,
    loggedInUserId: auth.user?.id,
  });

  return (
    <div>
      <FollowPageHeader name={profile?.name || ''} username={username || ''} />
      <Outlet />
    </div>
  );
};

export default FollowPage;
