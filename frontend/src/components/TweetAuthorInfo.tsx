import { FC, memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMoreHorizontal } from 'react-icons/fi';

import { useGetUserBasicInfoByIdQuery } from '../features/user/user.api-slice';

import ProfilePicture from './ProfilePicture';
import ProfilePopup from '../features/user/ProfilePopup';

import constants from '../constants';

interface TweetAuthorInfoProps {
  loggedInUserId: string | undefined;
  userId: string | undefined;
  username: string;
  profilePicture: string;
  fullName: string;
  showOptionsPopup: boolean;
  handleToggleOptions: () => void;
}

const TweetAuthorInfo: FC<TweetAuthorInfoProps> = ({
  loggedInUserId,
  userId,
  username,
  profilePicture,
  fullName,
  showOptionsPopup,
  handleToggleOptions,
}) => {
  const { data: userBasicData } = useGetUserBasicInfoByIdQuery({
    userId: userId ?? '',
    loggedInUserId,
  });

  const [
    showProfilePopup_from_profilePic,
    setShowProfilePopup_from_profilePic,
  ] = useState(false);
  const [showProfilePopup_from_fullName, setShowProfilePopup_from_fullName] =
    useState(false);
  const [showProfilePopup_from_username, setShowProfilePopup_from_username] =
    useState(false);

  const handleMouseOverProfilePic = () => {
    setShowProfilePopup_from_profilePic(true);
    setShowProfilePopup_from_fullName(false);
    setShowProfilePopup_from_username(false);
  };
  const handleMouseLeaveProfilePic = () => {
    setShowProfilePopup_from_profilePic(false);
  };

  const handleMouseOverFullname = () => {
    setShowProfilePopup_from_fullName(true);
    setShowProfilePopup_from_profilePic(false);
    setShowProfilePopup_from_username(false);
  };
  const handleMouseLeaveFullname = () => {
    setShowProfilePopup_from_fullName(false);
  };

  const handleMouseOverUsername = () => {
    setShowProfilePopup_from_username(true);
    setShowProfilePopup_from_fullName(false);
    setShowProfilePopup_from_profilePic(false);
  };
  const handleMouseLeaveUsername = () => {
    setShowProfilePopup_from_username(false);
  };

  return (
    <div className='flex items-start justify-between'>
      <div
        className={`flex items-center ${constants.profilePicture_info_gap_style}`}
      >
        {/* Profile Pic */}
        <div className='relative'>
          <div
            onMouseOver={handleMouseOverProfilePic}
            onMouseLeave={handleMouseLeaveProfilePic}
          >
            <ProfilePicture uri={profilePicture} username={username} />
          </div>
          {showProfilePopup_from_profilePic && (
            <div
              onMouseOver={handleMouseOverProfilePic}
              onMouseLeave={handleMouseLeaveProfilePic}
              className='absolute z-30 top-10 hover:cursor-default'
            >
              <ProfilePopup
                userId={userId}
                profilePicture={profilePicture}
                fullName={fullName}
                username={username}
                bio={userBasicData?.bio}
                isFollowedByLoggedInUser={
                  userBasicData?.isFollowedByLoggedInUser
                }
                numberOfFollowers={userBasicData?.numberOfFollowers}
                numberOfFollowing={userBasicData?.numberOfFollowing}
              />
            </div>
          )}
        </div>

        <div className='text-[15px]'>
          {/* Full Name */}
          <div className='relative'>
            <Link
              to={'/' + username}
              onMouseOver={handleMouseOverFullname}
              onMouseLeave={handleMouseLeaveFullname}
              className='font-bold truncate hover:underline'
            >
              {fullName}
            </Link>
            {showProfilePopup_from_fullName && (
              <div
                onMouseOver={handleMouseOverFullname}
                onMouseLeave={handleMouseLeaveFullname}
                className='absolute z-30 top-5 hover:cursor-default'
              >
                <ProfilePopup
                  userId={userId}
                  profilePicture={profilePicture}
                  fullName={fullName}
                  username={username}
                  bio={userBasicData?.bio}
                  isFollowedByLoggedInUser={
                    userBasicData?.isFollowedByLoggedInUser
                  }
                  numberOfFollowers={userBasicData?.numberOfFollowers}
                  numberOfFollowing={userBasicData?.numberOfFollowing}
                />
              </div>
            )}
          </div>

          {/* Username */}
          <div className='relative'>
            <Link
              to={'/' + username}
              onMouseOver={handleMouseOverUsername}
              onMouseLeave={() => setShowProfilePopup_from_username(false)}
              className='text-gray-500 truncate'
            >
              @{username}
            </Link>
            {showProfilePopup_from_username && (
              <div
                onMouseOver={handleMouseOverUsername}
                onMouseLeave={handleMouseLeaveUsername}
                className='absolute z-30 top-5 hover:cursor-default'
              >
                <ProfilePopup
                  userId={userId}
                  profilePicture={profilePicture}
                  fullName={fullName}
                  username={username}
                  bio={userBasicData?.bio}
                  isFollowedByLoggedInUser={
                    userBasicData?.isFollowedByLoggedInUser
                  }
                  numberOfFollowers={userBasicData?.numberOfFollowers}
                  numberOfFollowing={userBasicData?.numberOfFollowing}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`w-8 h-8 rounded-full  hover:text-twitter hover:bg-twitter-light hover:cursor-pointer flex items-center justify-center ${
          showOptionsPopup ? 'text-twitter bg-twitter-light' : 'text-gray-500'
        }`}
        onClick={handleToggleOptions}
      >
        <FiMoreHorizontal className='text-xl ph:text-2xl' />
      </div>
    </div>
  );
};

export default memo(TweetAuthorInfo);
