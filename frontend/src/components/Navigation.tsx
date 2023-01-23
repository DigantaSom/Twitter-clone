import { Link } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

import { BsTwitter } from 'react-icons/bs';
import { BiHomeCircle, BiBookmark } from 'react-icons/bi';
import { HiOutlineHashtag, HiOutlineBell } from 'react-icons/hi';
import { GrSearch } from 'react-icons/gr';
import { TbMessages } from 'react-icons/tb';
import { RiFileListLine } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';
import { CgMoreO } from 'react-icons/cg';
import { FiMoreHorizontal, FiSettings } from 'react-icons/fi';

import TweetComposeButton from './TweetComposeButton';
import ProfilePicture from './ProfilePicture';

const Navigation = () => {
  const isAuthenticated = false; // TODO: dynamic
  const isLoading = false; // TODO: dynamic

  const handleLogout = () => {};

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
            <Link
              to='/'
              className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
            >
              <BiHomeCircle className='text-3xl' />
              <span className='hidden xl:block text-xl font-bold'>Home</span>
            </Link>
          )}
          <Link
            to='/'
            className={`flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200 ${
              !isAuthenticated && 'font-bold'
            }`}
          >
            <HiOutlineHashtag className='hidden md2:block text-3xl' />
            <GrSearch className='md2:hidden text-3xl pl-[2px]' />
            <span className='hidden xl:block text-xl'>Explore</span>
          </Link>
          {!isAuthenticated && (
            <Link
              to='/'
              className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
            >
              <FiSettings className='text-3xl md2:text-2xl' />
              <span className='hidden xl:block text-xl'>Settings</span>
            </Link>
          )}
          {isAuthenticated && (
            <>
              <Link
                to='/'
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
              >
                <HiOutlineBell className='text-3xl' />
                <span className='hidden xl:block text-xl'>Notifications</span>
              </Link>
              <Link
                to='/'
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
              >
                <TbMessages className='text-3xl' />
                <span className='hidden xl:block text-xl'>Messages</span>
              </Link>
              <Link
                to='/'
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
              >
                <BiBookmark className='text-3xl' />
                <span className='hidden xl:block text-xl'>Bookmarks</span>
              </Link>
              <Link
                to='/'
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
              >
                <RiFileListLine className='text-3xl' />
                <span className='hidden xl:block text-xl'>Lists</span>
              </Link>
              <Link
                to='/'
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
              >
                <FaRegUser className='text-2xl' />
                <span className='hidden xl:block text-xl'>Profile</span>
              </Link>
              <Link
                to='/'
                className='flex items-center xl:space-x-3 p-2 xl:pl-3 xl:pr-8 mb-3 rounded-full hover:bg-gray-200'
              >
                <CgMoreO className='text-2xl' />
                <span className='hidden xl:block text-xl'>More</span>
              </Link>
              <TweetComposeButton from='Navigation' />
            </>
          )}
        </div>

        {/* TODO: {isAuthenticated && auth.isAuth && ( */}
        {isAuthenticated && (
          <div
            onClick={handleLogout}
            className='absolute bottom-0 w-full hover:bg-gray-200 hover:cursor-pointer rounded-full  flex items-center px-2 py-3 ml-1 mb-6'
          >
            {isLoading ? (
              <PulseLoader color='#111' />
            ) : (
              <>
                <ProfilePicture
                  // uri={(auth as TokenPayloadUser).profilePicture}
                  uri={''}
                  disableGoToProfile={true}
                />
                <div className='hidden xl:flex xl:flex-col xl:flex-1 xl:ml-3'>
                  <span className='font-bold text-sm'>
                    {/* {(auth as TokenPayloadUser).fullName} */}
                    Diganta Som
                  </span>
                  <span className='text-gray-600 text-sm'>
                    {/* @{(auth as TokenPayloadUser).twitterHandle} */}
                    @ItsDsom111
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
