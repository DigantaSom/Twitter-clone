import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ClipLoader } from 'react-spinners';

import { IoCloseSharp } from 'react-icons/io5';
import { FaRegBookmark, FaRegUser } from 'react-icons/fa';
import { RiFileListLine, RiSettings2Line } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { TbLogout } from 'react-icons/tb';

import useAuth from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { useGetUserBasicInfoByIdQuery } from '../features/user/user.api-slice';
import { useSendLogoutMutation } from '../features/auth/auth.api-slice';

import {
  selectIsPhoneSideNavigationShown,
  togglePhoneSideNavigation,
} from '../features/ui/ui.slice';

import ProfilePicture from './ProfilePicture';

const PhoneSideNavigation = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const dispatch = useAppDispatch();
  const is_PhoneSideNavigation_Shown = useAppSelector(
    selectIsPhoneSideNavigationShown
  );
  const { data: loggedInUserInfo } = useGetUserBasicInfoByIdQuery(
    { userId: auth.user?.id, loggedInUserId: auth.user?.id },
    { skip: !auth.user }
  );
  const [
    sendLogout,
    { isLoading: isLogoutLoading, isError: isLogoutError, error: logoutError },
  ] = useSendLogoutMutation();

  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const goToProfile = () => {
    dispatch(togglePhoneSideNavigation());
    setTimeout(() => {
      navigate('/' + loggedInUserInfo?.username);
    }, 100);
  };

  const goToFollowingOrFollowers = (type: 'following' | 'followers') => {
    dispatch(togglePhoneSideNavigation());
    setTimeout(() => {
      navigate('/' + loggedInUserInfo?.username + '/' + type);
    }, 100);
  };

  const goToNavOption = (navOption: 'profile' | 'bookmarks') => {
    dispatch(togglePhoneSideNavigation());
    setTimeout(() => {
      if (navOption === 'profile') {
        navigate('/' + loggedInUserInfo?.username);
      } else if (navOption === 'bookmarks') {
        navigate('/' + navOption);
      }
    }, 100);
  };

  const handleClickLogout = async () => {
    if (window.confirm('Are you sure that you want to logout?')) {
      dispatch(togglePhoneSideNavigation());

      await sendLogout(undefined);

      navigate('/', { replace: true });

      if (isLogoutError) {
        console.log('Error logging out:', logoutError);
        alert('Error logging out');
      }
    }
  };

  return (
    <div
      className={`ph:hidden w-full ph_xs:w-[280px] h-screen bg-white absolute z-40 top-0 ${
        is_PhoneSideNavigation_Shown ? 'left-0' : '-left-full'
      } ease-in-out duration-300`}
    >
      <div className='p-2 ph_sm:p-3'>
        {/* Top info */}
        <div className='flex items-center justify-between'>
          <div onClick={goToProfile}>
            <ProfilePicture
              uri={loggedInUserInfo?.profilePicture}
              username={auth.user?.twitterHandle}
              desktopSize={10} // so that the phone size will be w-8 h-8
              disableGoToProfile // doing it manually in the parent div in this component
            />
          </div>
          <IoCloseSharp
            onClick={() => dispatch(togglePhoneSideNavigation())}
            className='w-7 h-7'
          />
        </div>
        <div className='mt-2 flex flex-col'>
          <span className='font-bold'>{loggedInUserInfo?.name}</span>
          <span className='text-gray-500'>@{auth.user?.twitterHandle}</span>
        </div>
        <div className='mt-2 flex items-center space-x-3 flex-wrap text-[15px]'>
          <div
            onClick={() => goToFollowingOrFollowers('following')}
            className='flex items-center space-x-1 hover:underline'
          >
            <span className='font-bold'>
              {loggedInUserInfo?.numberOfFollowing ?? 0}
            </span>
            <span className='text-gray-500'>Following</span>
          </div>
          <div
            onClick={() => goToFollowingOrFollowers('followers')}
            className='flex items-center space-x-1 hover:underline'
          >
            <span className='font-bold'>
              {loggedInUserInfo?.numberOfFollowers ?? 0}
            </span>
            <span className='text-gray-500'>Followers</span>
          </div>
        </div>

        {/* Nav options */}
        <div className='mt-3 flex flex-col space-y-2'>
          <div
            onClick={() => goToNavOption('profile')}
            className='-ml-2 flex items-center space-x-6 p-2 xl:pl-3 xl:pr-8 rounded-full hover:bg-gray-200 hover:cursor-pointer'
          >
            <FaRegUser className='text-2xl' />
            <span className='text-xl font-semibold'>Profile</span>
          </div>
          <div className='-ml-2 flex items-center space-x-6 p-2 xl:pl-3 xl:pr-8 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <RiFileListLine className='text-2xl' />
            <span className='text-xl font-semibold'>Lists</span>
          </div>
          <div
            onClick={() => goToNavOption('bookmarks')}
            className='-ml-2 flex items-center space-x-6 p-2 xl:pl-3 xl:pr-8 rounded-full hover:bg-gray-200 hover:cursor-pointer'
          >
            <FaRegBookmark className='text-2xl' />
            <span className='text-xl font-semibold'>Bookmarks</span>
          </div>
        </div>
      </div>

      <hr />

      {/* Settings */}
      <div
        onClick={() => setIsSettingsDropdownOpen(prev => !prev)}
        className='px-2 ph_sm:px-3 py-3 hover:bg-gray-200'
      >
        <div className='flex items-center justify-between'>
          <p className='text-lg font-semibold'>Settings and Support</p>
          <BiChevronDown className='text-2xl font-bold' />
        </div>
      </div>
      {isSettingsDropdownOpen && (
        <div className='px-2 ph_sm:px-3 font-medium'>
          <div
            onClick={() => {}}
            className='py-2 ph_sm:py-3 flex items-center space-x-3'
          >
            <RiSettings2Line className='text-lg' />
            <p>Settings and privacy</p>
          </div>
          <div className='py-2 ph_sm:py-3'>
            {isLogoutLoading ? (
              <ClipLoader color='#1D9BF0' size={22} /> // same as twitter-default color
            ) : (
              <div
                onClick={handleClickLogout}
                className='flex items-center space-x-3'
              >
                <TbLogout className='text-lg' />
                <p>Log out</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PhoneSideNavigation);
