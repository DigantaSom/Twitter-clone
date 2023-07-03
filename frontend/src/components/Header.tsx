import { FC } from 'react';
import { Link } from 'react-router-dom';

import { HiOutlineSparkles } from 'react-icons/hi';
import { FiMoreHorizontal } from 'react-icons/fi';

import useAuth from '../hooks/useAuth';

import ProfilePicture from './ProfilePicture';

import constants from '../constants';

interface HeaderProps {
  parentComponent: 'Feed' | 'BookmarksPage';
}

const Header: FC<HeaderProps> = ({ parentComponent }) => {
  const auth = useAuth();

  const rightIconStyles =
    'w-8 h-8 ph_sm:w-10 ph_sm:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer flex items-center justify-center';

  let content;

  if (parentComponent === 'Feed') {
    content = (
      <>
        <Link to='/' className='flex items-center'>
          <div className='block ph:hidden mr-3'>
            <ProfilePicture
              uri={constants.placeholder_profilePicture}
              username={auth.user?.twitterHandle}
            />
          </div>
          <span className='font-bold text-lg ph:text-xl -mt-1'>Home</span>
        </Link>

        <div className={rightIconStyles}>
          <HiOutlineSparkles className='text-xl' />
        </div>
      </>
    );
  } else if (parentComponent === 'BookmarksPage') {
    content = (
      <>
        <div className='flex flex-col'>
          <span className='font-bold text-lg ph:text-xl'>Bookmarks</span>
          <span className='text-gray-500 text-sm ph:text-[15px]'>
            @{auth.user?.twitterHandle}
          </span>
        </div>

        <div className={rightIconStyles}>
          <FiMoreHorizontal className='text-xl' />
        </div>
      </>
    );
  }

  return (
    <div className='sticky top-0 z-30 bg-white opacity-90 h-12 ph:h-14 px-2 ph_sm:px-4 flex items-center justify-between'>
      {content}
    </div>
  );
};

export default Header;
