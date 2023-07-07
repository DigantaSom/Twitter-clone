import { FC, useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';

import { FiMoreHorizontal } from 'react-icons/fi';
import { IoBalloonOutline, IoCalendarOutline } from 'react-icons/io5';
import { AiOutlineLink } from 'react-icons/ai';

import useAuth from '../../hooks/useAuth';
import { useGetBirthday, useGetJoiningDate } from '../../hooks/date-hooks';

import CustomButton from '../../components/CustomButton';
import FollowButton from './FollowButton';
import ProfileMorePopupContents from './ProfileMorePopupContents';

import constants from '../../constants';

interface ProfileInfoProps {
  profileUserId: string;
  headerPhoto: string;
  profilePicture: string;
  name: string;
  username: string;
  bio: string;
  birthday: string | null;
  joiningDate: string;
  numberOfFollowing: number;
  numberOfFollowers: number;
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  profileUserId,
  headerPhoto,
  profilePicture,
  name,
  username,
  bio,
  birthday,
  joiningDate,
  numberOfFollowing,
  numberOfFollowers,
}) => {
  const auth = useAuth();
  const birthday_toDisplay = useGetBirthday(birthday);
  const joiningDate_toDisplay = useGetJoiningDate(joiningDate);

  const [isMyProfile, setIsMyProfile] = useState(false); // if the profile is currently logged in user's or not
  const [showMorePopup, setShowMorePopup] = useState(false);

  useEffect(() => {
    if (auth.user?.id === profileUserId) {
      setIsMyProfile(true);
    } else {
      setIsMyProfile(false);
    }
  }, [auth.user?.id, profileUserId]);

  const handleClickEditProfile = () => {
    // TODO: open edit profile popup from the App.tsx component through RTK
  };

  const toggleShowMorePopup = () => setShowMorePopup(prevState => !prevState);

  return (
    <div>
      <div className='relative mb-20'>
        {/* Header Photo */}
        <div className='w-full h-[200px]'>
          {!!headerPhoto ? (
            <img src={headerPhoto} alt='Header' />
          ) : (
            <div className='w-full h-full bg-gray-300'></div>
          )}
        </div>

        {/* Profile Photo */}
        <div className='absolute left-2 ph_sm:left-4 -bottom-16 w-32 h-32 bg-white rounded-full flex items-center justify-center'>
          <img
            src={profilePicture || constants.placeholder_profilePicture}
            alt='Profile'
            className='w-[92%] h-[92%] rounded-full'
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
                <FollowButton />
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

        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aperiam
          animi ab vel culpa ex repellendus nobis fugit soluta consectetur
          voluptas blanditiis consequatur earum explicabo omnis dicta at eaque,
          sapiente cupiditate.
        </p>

        <div className='flex items-center justify-start space-x-5 text-gray-500'>
          {/* TODO: Backend - add birthday to profile after a user signs up */}
          {!!birthday && (
            <div className='flex items-center space-x-1'>
              <IoBalloonOutline />
              <div>Born {birthday_toDisplay}</div>
            </div>
          )}
          {/* TODO: website */}
          <div className='flex items-center space-x-1'>
            <AiOutlineLink className='text-lg' />
            <Link
              to='https://youtube.com'
              className='text-twitter hover:underline'
            >
              youtube.com
            </Link>
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
