import { FC, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BsTwitter } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { FiMoreHorizontal } from 'react-icons/fi';

import useAuth from '../hooks/useAuth';
import { useAppDispatch } from '../hooks/redux-hooks';
import { useGetMyBasicInfoQuery } from '../features/user/user.api-slice';

import { togglePhoneSideNavigation } from '../features/ui/ui.slice';

import ProfilePicture from './ProfilePicture';

interface HeaderProps {
  parentComponent:
    | 'Feed'
    | 'TweetPage'
    | 'BookmarksPage'
    | 'ProfilePage'
    | 'QuotesPage';
  name?: string; // only from 'ProfilePage'
  numberOfTweets?: number; // only from 'ProfilePage'
}

const Header: FC<HeaderProps> = ({ parentComponent, name, numberOfTweets }) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const { data: loggedInUserInfo } = useGetMyBasicInfoQuery();

  const handleClickGoBack = () => {
    navigate(-1);
  };

  const rightIconStyles =
    'w-8 h-8 ph_sm:w-10 ph_sm:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer flex items-center justify-center';

  let content;

  if (parentComponent === 'Feed') {
    content = (
      <div className='relative w-full'>
        <div
          onClick={() => dispatch(togglePhoneSideNavigation())}
          className='block ph:hidden'
        >
          <ProfilePicture
            uri={loggedInUserInfo?.profilePicture}
            username={auth.user?.twitterHandle}
            disableGoToProfile
          />
        </div>
        <Link
          to='/'
          className='hidden ph:block font-bold text-lg ph:text-xl w-fit'
        >
          Home
        </Link>
        <div className='ph:hidden absolute top-1/2 -translate-y-1/2 w-full flex justify-center'>
          <Link to='/' className='w-fit'>
            <BsTwitter className='text-twitter w-8 h-8' />
          </Link>
        </div>
      </div>
    );
  } else if (parentComponent === 'BookmarksPage') {
    content = (
      <div className='flex items-center justify-between w-full'>
        <div className='flex flex-col'>
          <span className='font-bold text-lg ph:text-xl'>Bookmarks</span>
          <span className='text-gray-500 text-sm ph:text-[15px]'>
            @{auth.user?.twitterHandle}
          </span>
        </div>

        <div className={rightIconStyles}>
          <FiMoreHorizontal className='text-xl' />
        </div>
      </div>
    );
  } else if (
    parentComponent === 'TweetPage' ||
    parentComponent === 'ProfilePage' ||
    parentComponent === 'QuotesPage'
  ) {
    content = (
      <div className='flex items-center space-x-6'>
        <div
          onClick={handleClickGoBack}
          className='w-9 h-9 p-1 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
        >
          <IoArrowBack className='text-2xl text-gray-700' />
        </div>

        {parentComponent === 'TweetPage' && (
          <h2 className='font-bold text-lg ph:text-xl -mt-[2px]'>Tweet</h2>
        )}

        {parentComponent === 'QuotesPage' && (
          <h2 className='font-bold text-lg ph:text-xl -mt-[2px]'>Quotes</h2>
        )}

        {parentComponent === 'ProfilePage' && (
          <div className='flex flex-col'>
            <span className='font-bold text-base ph:text-lg -mt-[2px]'>
              {name || 'Profile'}
            </span>
            <div className='text-sm ph:text-[15px] text-gray-500'>
              {!!numberOfTweets && (
                <span>
                  {numberOfTweets} {numberOfTweets > 1 ? 'Tweets' : 'Tweet'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='sticky top-0 z-30 bg-white opacity-90 h-14 ph:16 px-2 ph_sm:px-4 flex items-center'>
      {content}
    </div>
  );
};

export default memo(Header);
