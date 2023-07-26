// The positioning of this popup component is done on its parent component.

import { FC } from 'react';
import { Link } from 'react-router-dom';

import ProfilePicture from '../../components/ProfilePicture';
import FollowButton from './FollowButton';

interface ProfilePopupProps {
  userId: string | undefined;
  profilePicture: string | undefined;
  fullName: string;
  username: string;
  bio: string | undefined;
  isFollowedByLoggedInUser: boolean | undefined;
  numberOfFollowers: number | undefined;
  numberOfFollowing: number | undefined;
}

const ProfilePopup: FC<ProfilePopupProps> = ({
  userId,
  profilePicture,
  fullName,
  username,
  bio,
  isFollowedByLoggedInUser,
  numberOfFollowers,
  numberOfFollowing,
}) => {
  return (
    <div className='bg-white min-w-[280px] max-w-[300px] shadow-2xl p-2 ph_sm:p-4 rounded-2xl flex flex-col space-y-2'>
      <div className='flex items-center justify-between'>
        <ProfilePicture
          uri={profilePicture}
          username={username}
          desktopSize={18}
        />
        <FollowButton
          isFollowedByLoggedInUser={isFollowedByLoggedInUser || false}
          targetUserId={userId}
        />
      </div>

      <div className='flex flex-col'>
        <Link to={'/' + username} className='font-bold hover:underline'>
          {fullName}
        </Link>
        <Link to={'/' + username} className='text-[15px] text-gray-500'>
          {username}
        </Link>
      </div>

      <div className='text-[15px]'>{bio ?? ''}</div>

      <div className='flex items-center space-x-3 text-sm'>
        <Link
          to={'/' + username + '/following'}
          className='flex items-center space-x-1 hover:underline'
        >
          <span className='font-bold'>{numberOfFollowing ?? 0}</span>
          <span className='text-gray-500'>Following</span>
        </Link>
        <Link
          to={'/' + username + '/followers'}
          className='flex items-center space-x-1 hover:underline'
        >
          <span className='font-bold'>{numberOfFollowers ?? 0}</span>
          <span className='text-gray-500'>Followers</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePopup;
