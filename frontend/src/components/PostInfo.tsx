import { FC, memo } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

import ProfilePicture from './ProfilePicture';

import constants from '../constants';

interface PostInfoProps {
  username: string | undefined;
  profilePicture: string;
  fullName: string;
  twitterHandle: string;
  showOptionsPopup: boolean;
  handleToggleOptions: () => void;
}

const PostInfo: FC<PostInfoProps> = ({
  username,
  profilePicture,
  fullName,
  twitterHandle,
  showOptionsPopup,
  handleToggleOptions,
}) => {
  return (
    <div className='flex items-start justify-between'>
      <div
        className={`flex items-center ${constants.profilePicture_info_gap_style}`}
      >
        <ProfilePicture uri={profilePicture} username={username} />

        <div className='text-[15px]'>
          <h3 className='font-bold hover:underline hover:cursor-pointer'>
            {fullName}
          </h3>
          <span className='text-gray-500'>@{twitterHandle}</span>
        </div>
      </div>

      <div
        className={`w-8 h-8 rounded-full  hover:text-twitter hover:bg-twitter-light hover:cursor-pointer flex items-center justify-center 
        ${showOptionsPopup ? 'text-twitter bg-twitter-light' : 'text-gray-500'}
      `}
        onClick={handleToggleOptions}
      >
        <FiMoreHorizontal className='text-xl ph:text-2xl' />
      </div>
    </div>
  );
};

export default memo(PostInfo);
