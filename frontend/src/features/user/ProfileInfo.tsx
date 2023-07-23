import { FC, useState, useEffect, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { FiMoreHorizontal } from 'react-icons/fi';
import { IoBalloonOutline, IoCalendarOutline } from 'react-icons/io5';
import { AiOutlineLink } from 'react-icons/ai';

import { useAppDispatch } from '../../hooks/redux-hooks';
import { useGetBirthday, useGetJoiningDate } from '../../hooks/date-hooks';
import { openEditProfilePopup } from '../ui/ui.slice';

import CustomButton from '../../components/CustomButton';
import FollowButton from './FollowButton';
import ProfileMorePopupContents from './ProfileMorePopupContents';

import constants from '../../constants';

interface ProfileInfoProps {
  loggedInUserId: string | undefined;
  profileUserId: string;
  headerPhoto: string;
  profilePicture: string;
  name: string;
  username: string;
  bio: string;
  birthday: string | null;
  joiningDate: string;
  website: string;
  isFollowedByLoggedInUser: boolean;
  numberOfFollowing: number;
  numberOfFollowers: number;
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  loggedInUserId,
  profileUserId,
  headerPhoto,
  profilePicture,
  name,
  username,
  bio,
  birthday,
  joiningDate,
  website,
  isFollowedByLoggedInUser,
  numberOfFollowing,
  numberOfFollowers,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const birthday_toDisplay = useGetBirthday(birthday);
  const joiningDate_toDisplay = useGetJoiningDate(joiningDate);

  const [isMyProfile, setIsMyProfile] = useState(false); // if the profile is currently logged in user's or not
  const [showMorePopup, setShowMorePopup] = useState(false);

  useEffect(() => {
    if (profileUserId === loggedInUserId) {
      setIsMyProfile(true);
    } else {
      setIsMyProfile(false);
    }
  }, [profileUserId, loggedInUserId]);

  const handleClickEditProfile = () => {
    dispatch(openEditProfilePopup({ username }));
  };

  const toggleShowMorePopup = () => setShowMorePopup(prevState => !prevState);

  return (
    <div>
      <div className='relative mb-20'>
        {/* Header Photo */}
        <div className='w-full h-[200px]'>
          {!!headerPhoto ? (
            <Link to='header_photo'>
              <img
                src={headerPhoto}
                alt='Header'
                className='w-full h-full object-cover'
              />
            </Link>
          ) : (
            <div className='w-full h-full bg-gray-300'></div>
          )}
        </div>

        {/* Profile Photo */}
        <div
          onClick={() => profilePicture && navigate('photo')}
          className={`absolute left-2 ph_sm:left-4 -bottom-16 w-32 h-32 bg-white rounded-full flex items-center justify-center ${
            profilePicture && 'hover:bg-gray-200 hover:cursor-pointer'
          }`}
        >
          <img
            src={profilePicture || constants.placeholder_profilePicture}
            alt='Profile'
            className='w-[92%] h-[92%] object-cover rounded-full'
          />
        </div>

        {/* Profile Options */}
        <div className='mt-2 ph_sm:mt-3 absolute right-2 ph_sm:right-4'>
          {isMyProfile ? (
            <CustomButton
              title='Edit Profile'
              onClick={handleClickEditProfile}
              bgColorClass='bg-white'
              textColorClass='text-gray-700'
              textSizeClass='text-sm ph:text-base'
            />
          ) : (
            <div className='relative'>
              <div className='flex items-center space-x-3'>
                <div
                  onClick={toggleShowMorePopup}
                  className='w-9 h-9 rounded-full border-[1px] border-gray-400 hover:bg-gray-200 hover:cursor-pointer flex items-center justify-center'
                >
                  <FiMoreHorizontal className='text-lg' />
                </div>
                <FollowButton
                  isFollowedByLoggedInUser={isFollowedByLoggedInUser}
                  targetUserId={profileUserId}
                />
              </div>
              {showMorePopup && (
                <div className='absolute z-20 top-10 right-full text-black min-w-[200px]'>
                  <ProfileMorePopupContents
                    username={username}
                    handleClosePopup={() => setShowMorePopup(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rest Info */}
      <div className='mx-2 ph_sm:mx-4 flex flex-col space-y-3'>
        <div>
          <h2 className='text-lg sm:text-xl font-extrabold'>{name}</h2>
          <h3 className='text-[15px] sm:text-[17px] text-gray-500'>
            @{username}
          </h3>
        </div>

        <p>{bio}</p>

        <div className='flex items-center justify-start space-x-5 text-gray-500'>
          {/* TODO: Backend - add birthday to profile after a user signs up */}
          {!!birthday && (
            <div className='flex items-center space-x-1'>
              <IoBalloonOutline />
              <div>Born {birthday_toDisplay}</div>
            </div>
          )}
          {/* website */}
          <div className='flex items-center space-x-1'>
            <AiOutlineLink className='text-lg' />
            <a
              href={
                website.startsWith('https://') ? website : `https://${website}`
              }
              target='_blank'
              rel='noreferrer'
              className='text-twitter hover:underline'
            >
              {website}
            </a>
          </div>
          <div className='flex items-center space-x-1'>
            <IoCalendarOutline />
            <div>Joined {joiningDate_toDisplay}</div>
          </div>
        </div>

        <div className='flex items-center space-x-3 text-[15px]'>
          <Link to='following' className='flex items-center space-x-1'>
            <span className='font-semibold'>{numberOfFollowing}</span>
            <span className='text-gray-500'>Following</span>
          </Link>
          <Link to='followers' className='flex items-center space-x-1'>
            <span className='font-semibold'>{numberOfFollowers}</span>
            <span className='text-gray-500'>Followers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfileInfo);
