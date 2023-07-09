import { FC, memo, useEffect, useState } from 'react';

import useAuth from '../../hooks/useAuth';
import { useFollowUserMutation } from './user.api-slice';

import CustomButton from '../../components/CustomButton';

interface FollowButtonProps {
  isFollowedByLoggedInUser: boolean;
  targetUserId: string | undefined;
}

const FollowButton: FC<FollowButtonProps> = ({
  isFollowedByLoggedInUser,
  targetUserId,
}) => {
  const auth = useAuth();
  const loggedInUserId = auth.user?.id;

  const [followUser, { isLoading: isFollowLoading }] = useFollowUserMutation();

  const [
    isFollowedByLoggedInUser_toDisplay,
    setIsFollowedByLoggedInUser_toDisplay,
  ] = useState(isFollowedByLoggedInUser);
  const [showUnfollowButton, setShowUnfollowButton] = useState(false);

  useEffect(() => {
    setIsFollowedByLoggedInUser_toDisplay(isFollowedByLoggedInUser);
  }, [isFollowedByLoggedInUser]);

  const onMouseOver = () => {
    if (isFollowedByLoggedInUser_toDisplay) {
      setShowUnfollowButton(true);
    }
  };

  const onMouseLeave = () => {
    if (isFollowedByLoggedInUser_toDisplay) {
      setShowUnfollowButton(false);
    }
  };

  const handleFollowOrUnfollow = async () => {
    if (loggedInUserId === targetUserId || isFollowLoading) return;
    await followUser({ targetUserId, loggedInUserId });
    setIsFollowedByLoggedInUser_toDisplay(prev => !prev);
    setShowUnfollowButton(false);
  };

  if (loggedInUserId === targetUserId) return null;

  return (
    <div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      {showUnfollowButton ? (
        <CustomButton
          title='Unfollow'
          onClick={handleFollowOrUnfollow}
          bgColorClass='bg-white'
          textColorClass='text-red-500'
          textSizeClass='text-xs ph:text-sm'
        />
      ) : (
        <CustomButton
          title={isFollowedByLoggedInUser_toDisplay ? 'Following' : 'Follow'}
          onClick={handleFollowOrUnfollow}
          bgColorClass={
            isFollowedByLoggedInUser_toDisplay ? 'bg-white' : 'bg-black'
          }
          textColorClass={
            isFollowedByLoggedInUser_toDisplay ? 'text-gray-700' : 'text-white'
          }
          textSizeClass='text-xs ph:text-sm'
        />
      )}
    </div>
  );
};

export default memo(FollowButton);
