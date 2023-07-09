import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserID } from '../user/user.types';

import { useAppDispatch } from '../../hooks/redux-hooks';
import { useGetUserBasicInfoQuery } from '../user/user.api-slice';
import { closeLikedByPopup } from '../ui/ui.slice';

import ProfilePicture from '../../components/ProfilePicture';
import FollowButton from '../user/FollowButton';

import constants from '../../constants';

interface LikedByListItemProps {
  like: UserID;
  loggedInUserId: string | undefined;
}

const LikedByListItem: FC<LikedByListItemProps> = ({
  like,
  loggedInUserId,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isSuccess } = useGetUserBasicInfoQuery(
    { userId: like.userId, loggedInUserId },
    {
      pollingInterval: 20000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  let content;

  if (!data || !isSuccess) {
    content = null;
  } else {
    const goToProfile = () => {
      dispatch(closeLikedByPopup());
      navigate(`/${data.username}`);
    };

    content = (
      <div className='px-2 ph_xs:px-4 py-2 ph_xs:py-4 hover:bg-gray-100 hover:cursor-pointer'>
        <div
          className={`flex items-start ${constants.profilePicture_info_gap_style}`}
        >
          <ProfilePicture uri={data.profilePicture} username={data.username} />

          <div className='flex flex-col flex-1'>
            <div className='flex items-center justify-between'>
              <div onClick={goToProfile} className='flex-1 text-[15px]'>
                <h3 className='font-bold hover:underline hover:cursor-pointer'>
                  {data.name}
                </h3>
                <span className='text-gray-500'>@{data.username}</span>
              </div>
              <FollowButton
                isFollowedByLoggedInUser={data.isFollowedByLoggedInUser}
                targetUserId={like.userId}
              />
            </div>

            <div onClick={goToProfile}>{data.bio || ''}</div>
          </div>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default LikedByListItem;
