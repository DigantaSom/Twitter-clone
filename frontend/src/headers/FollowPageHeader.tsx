import { FC, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

import { FollowPageTab } from '../types';
import useAuth from '../hooks/useAuth';

interface FollowPageHeaderProps {
  name: string;
  username: string;
}

const FollowPageHeader: FC<FollowPageHeaderProps> = ({ name, username }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const auth = useAuth();

  const [isMyProfile, setIsMyProfile] = useState(false);
  const [selectedTab, setSelectedTab] = useState<FollowPageTab>('Followers');

  useEffect(() => {
    setIsMyProfile(
      auth.user?.twitterHandle.toLowerCase() === username.toLowerCase()
    );
  }, [auth.user?.twitterHandle, username]);

  useEffect(() => {
    if (
      pathname === `/${username}/followers_you_follow` ||
      pathname === `/${username}/followers_you_follow/`
    ) {
      if (!isMyProfile) {
        setSelectedTab('Followers you know');
      } else {
        navigate('followers', { replace: true });
      }
    } else if (
      pathname === `/${username}/followers` ||
      pathname === `/${username}/followers/`
    ) {
      setSelectedTab('Followers');
    } else if (
      pathname === `/${username}/following` ||
      pathname === `/${username}/following/`
    ) {
      setSelectedTab('Following');
    }
  }, [pathname, username, isMyProfile, navigate]);

  const handleClickGoBack = () => {
    navigate('/' + username);
  };

  const selectedTabExtraStyles = 'pb-3 border-b-4 border-b-twitter';

  return (
    <div className='sticky top-0 z-30 bg-white'>
      <div className='flex items-center space-x-6 p-2 ph_sm:p-4'>
        <div
          onClick={handleClickGoBack}
          className='w-9 h-9 p-1 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
        >
          <IoArrowBack className='text-2xl text-gray-700' />
        </div>
        <div className='flex flex-col'>
          <span className='font-bold text-base ph:text-lg -mt-[2px]'>
            {name}
          </span>
          <div className='text-sm ph:text-[15px] text-gray-500'>
            <span>@{username}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`mt-4 grid ${
          isMyProfile ? 'grid-cols-2' : 'grid-cols-3'
        } border-b-[1px] border-b-gray-200`}
      >
        {!isMyProfile && (
          <Link
            to='followers_you_follow'
            className='ext-sm ph:text-base text-gray-600 text-center font-semibold hover:bg-gray-200 flex items-center justify-center'
          >
            <div
              className={`w-fit py-4 ${
                selectedTab === 'Followers you know' && selectedTabExtraStyles
              }`}
            >
              Followers you know
            </div>
          </Link>
        )}
        <Link
          to='followers'
          className='text-sm ph:text-base text-gray-600 text-center font-semibold hover:bg-gray-200 flex items-center justify-center'
        >
          <div
            className={`w-fit py-4 ${
              selectedTab === 'Followers' && selectedTabExtraStyles
            }`}
          >
            Followers
          </div>
        </Link>
        <Link
          to='following'
          className='text-sm ph:text-base text-gray-600 text-center font-semibold hover:bg-gray-200 flex items-center justify-center'
        >
          <div
            className={`w-fit py-4 ${
              selectedTab === 'Following' && selectedTabExtraStyles
            }`}
          >
            Following
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FollowPageHeader;
