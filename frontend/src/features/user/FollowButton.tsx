import { FC, useState } from 'react';

import CustomButton from '../../components/CustomButton';

interface FollowButtonProps {}

const FollowButton: FC<FollowButtonProps> = ({}) => {
  const isFollowing = true; // TODO: dynamic

  const [showUnfollowButton, setShowUnfollowButton] = useState(false);

  const onMouseOver = () => {
    if (isFollowing) {
      setShowUnfollowButton(true);
    }
  };

  const onMouseLeave = () => {
    if (isFollowing) {
      setShowUnfollowButton(false);
    }
  };

  return (
    <div onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      {showUnfollowButton ? (
        <CustomButton
          title='Unfollow'
          onClick={() => {}}
          bgColorClass='bg-white'
          textColorClass='text-red-500'
          textSizeClass='text-xs ph:text-sm'
        />
      ) : (
        <CustomButton
          title={isFollowing ? 'Following' : 'Follow'}
          onClick={() => {}}
          bgColorClass={isFollowing ? 'bg-white' : 'bg-black'}
          textColorClass={isFollowing ? 'text-gray-700' : 'text-white'}
          textSizeClass='text-xs ph:text-sm'
        />
      )}
    </div>
  );
};

export default FollowButton;
