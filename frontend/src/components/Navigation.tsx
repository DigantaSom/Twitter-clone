import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { CircleLoader } from 'react-spinners';

import { BsTwitter } from 'react-icons/bs';
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineBell,
  AiFillBell,
} from 'react-icons/ai';
import { GrSearch } from 'react-icons/gr';
import { ImSearch } from 'react-icons/im';
import {
  RiSettings2Line,
  RiSettings2Fill,
  RiMessageLine,
  RiMessageFill,
  RiFileListLine,
  RiFileListFill,
} from 'react-icons/ri';
import { FaRegBookmark, FaBookmark, FaRegUser, FaUser } from 'react-icons/fa';
import { CgMoreO } from 'react-icons/cg';
import { FiMoreHorizontal } from 'react-icons/fi';

import useAuth from '../hooks/useAuth';
import { useAppSelector } from '../hooks/redux-hooks';
import { useSendLogoutMutation } from '../features/auth/auth.api-slice';
import { useGetMyBasicInfoQuery } from '../features/user/user.api-slice';

import { NavigationOption } from '../types';
import { selectIsAuthenticated } from '../features/auth/auth.slice';

import TweetComposeButton from './TweetComposeButton';
import ProfilePicture from './ProfilePicture';

import constants from '../constants';

const Navigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const auth = useAuth();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const { data: loggedInUserInfo } = useGetMyBasicInfoQuery();
  const [
    sendLogout,
    { isLoading: isLogoutLoading, isError: isLogoutError, error: logoutError },
  ] = useSendLogoutMutation();

  const [selectedOption, setSelectedOption] =
    useState<NavigationOption>('home');

  useEffect(() => {
    if (pathname === '/') {
      if (isAuthenticated) {
        setSelectedOption('home');
      } else {
        setSelectedOption('explore');
      }
    } else if (
      pathname.substring(1).startsWith(auth.user?.twitterHandle as string) &&
      !pathname
        .substring(1)
        .startsWith(`${auth.user?.twitterHandle}/status` as string)
    ) {
      setSelectedOption('profile');
    } else {
      setSelectedOption(pathname.substring(1) as NavigationOption);
    }
  }, [pathname, isAuthenticated, auth.user?.twitterHandle]);

  const handleSelectOption = (option: NavigationOption) => {
    setSelectedOption(option);

    if (option === 'home') {
      navigate('/');
    } else if (option === 'explore') {
      if (isAuthenticated) {
        navigate('/explore');
      } else {
        navigate('/');
      }
    } else if (option === 'profile' && auth.user) {
      navigate('/' + auth.user.twitterHandle);
    } else if (option === 'more') {
      // TODO: toggle this popup
    } else {
      navigate(option);
    }
  };

  const handleSetOptionTextStyle = (option: NavigationOption) =>
    `hidden xl:block text-xl ${selectedOption === option && 'font-bold'}`;

  // FIXME: after logging out, the Feed is loading continuously.
  const handleLogout = async () => {
    if (window.confirm('Are you sure that you want to logout?')) {
      await sendLogout(undefined);

      navigate('/', { replace: true });
      setSelectedOption('explore');

      if (isLogoutError) {
        console.log('Error logging out:', logoutError);
        alert('Error logging out');
      }
    }
  };

  return (
    <div className='mr-[15%]'>
      <div className='relative h-screen flex flex-col'>
        <div className='py-2 ml-[2px]'>
          <Link to='/'>
            <div className='w-12 h-12 rounded-full hover:bg-twitter-light flex items-center justify-center'>
              <BsTwitter className='text-twitter w-[90%] h-[90%] p-2' />
            </div>
          </Link>
        </div>

        <div className='flex flex-col items-center xl:items-start'>
          {isAuthenticated && (
            <div
              onClick={() => handleSelectOption('home')}
              className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
            >
              {selectedOption === 'home' ? (
                <AiFillHome className='text-3xl' />
              ) : (
                <AiOutlineHome className='text-3xl' />
              )}
              <span className={handleSetOptionTextStyle('home')}>Home</span>
            </div>
          )}

          <div
            onClick={() => handleSelectOption('explore')}
            className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
          >
            {selectedOption === 'explore' ? (
              <ImSearch className='text-3xl pl-[2px]' />
            ) : (
              <GrSearch className='text-3xl pl-[2px]' />
            )}
            <span className={handleSetOptionTextStyle('explore')}>Explore</span>
          </div>

          {!isAuthenticated && (
            <div
              onClick={() => handleSelectOption('settings')}
              className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
            >
              {selectedOption === 'settings' ? (
                <RiSettings2Fill className='text-3xl' />
              ) : (
                <RiSettings2Line className='text-3xl' />
              )}
              <span className={handleSetOptionTextStyle('settings')}>
                Settings
              </span>
            </div>
          )}

          {isAuthenticated && (
            <>
              <div
                onClick={() => handleSelectOption('notifications')}
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
              >
                {selectedOption === 'notifications' ? (
                  <AiFillBell className='text-3xl' />
                ) : (
                  <AiOutlineBell className='text-3xl' />
                )}
                <span className={handleSetOptionTextStyle('notifications')}>
                  Notifications
                </span>
              </div>

              <div
                onClick={() => handleSelectOption('messages')}
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
              >
                {selectedOption === 'messages' ? (
                  <RiMessageFill className='text-3xl' />
                ) : (
                  <RiMessageLine className='text-3xl' />
                )}
                <span className={handleSetOptionTextStyle('messages')}>
                  Messages
                </span>
              </div>

              <div
                onClick={() => handleSelectOption('bookmarks')}
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
              >
                {selectedOption === 'bookmarks' ? (
                  <FaBookmark className='text-2xl' />
                ) : (
                  <FaRegBookmark className='text-2xl' />
                )}
                <span className={handleSetOptionTextStyle('bookmarks')}>
                  Bookmarks
                </span>
              </div>

              <div
                onClick={() => handleSelectOption('lists')}
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
              >
                {selectedOption === 'lists' ? (
                  <RiFileListFill className='text-3xl' />
                ) : (
                  <RiFileListLine className='text-3xl' />
                )}
                <span className={handleSetOptionTextStyle('lists')}>Lists</span>
              </div>

              <div
                onClick={() => handleSelectOption('profile')}
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
              >
                {selectedOption === 'profile' ? (
                  <FaUser className='text-2xl' />
                ) : (
                  <FaRegUser className='text-2xl' />
                )}
                <span className={handleSetOptionTextStyle('profile')}>
                  Profile
                </span>
              </div>

              <div
                onClick={() => handleSelectOption('more')}
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 hover:cursor-pointer'
              >
                <CgMoreO className='text-2xl' />
                <span className={handleSetOptionTextStyle('more')}>More</span>
              </div>

              <TweetComposeButton from='Navigation' />
            </>
          )}
        </div>

        {isAuthenticated && auth.user && (
          <div
            onClick={handleLogout}
            className='absolute bottom-0 w-full hover:xl:bg-gray-200 hover:cursor-pointer rounded-full flex items-center xl:px-2 xl:py-3 ml-1 mb-6'
          >
            {isLogoutLoading ? (
              <CircleLoader
                color={constants.colors.twitter_default}
                size={30}
              />
            ) : (
              <>
                <ProfilePicture
                  uri={loggedInUserInfo?.profilePicture}
                  username={auth.user.twitterHandle}
                  disableGoToProfile={true}
                />
                <div className='hidden xl:flex xl:flex-col xl:flex-1 xl:ml-3'>
                  <span className='font-bold text-sm'>
                    {loggedInUserInfo?.name}
                  </span>
                  <span className='text-gray-600 text-sm'>
                    @{auth.user.twitterHandle}
                  </span>
                </div>
                <FiMoreHorizontal className='hidden xl:block' />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
