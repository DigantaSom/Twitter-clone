import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

import { FiMoreHorizontal } from 'react-icons/fi';
import { BsFillArrowUpRightSquareFill } from 'react-icons/bs';

import useAuth from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import {
  getTrendingList,
  selectTrendingList,
  showWhoToFollow,
  selectWhoToFollow,
} from './trending.slice';

import SearchBar from '../ui/SearchBar';
import TrendingList from './TrendingList';
import ProfilePicture from '../../components/ProfilePicture';

import constants from '../../constants';

const Trending = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const trendingData = useAppSelector(selectTrendingList);
  const whoToFollow = useAppSelector(selectWhoToFollow);

  const [showSearchbar, setShowSearchbar] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/explore') {
      dispatch(getTrendingList({ type: 'whats-happening' }));
    }
    dispatch(showWhoToFollow());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (location.pathname === '/explore' || location.pathname === '/search') {
      setShowSearchbar(false);
    } else {
      setShowSearchbar(true);
    }
  }, [location.pathname]);

  const handleGoToProfile = (twitterHandle: string) => {
    navigate('/' + twitterHandle);
  };

  let whoToFollow_marginTopStyles = '';

  if (location.pathname === '/explore') {
    whoToFollow_marginTopStyles = 'mt-2';
  } else {
    whoToFollow_marginTopStyles = 'mt-6';
  }

  return (
    <>
      {/* Search Bar */}
      {showSearchbar && (
        <section className='h-12 pt-1 flex items-center'>
          <SearchBar src='trending' />
        </section>
      )}

      {/* Section: What's Happening */}
      {location.pathname !== '/explore' && (
        <section
          className={`bg-gray-100 rounded-2xl pt-3 ${
            showSearchbar ? 'mt-6' : 'mt-2'
          }`}
        >
          <h2 className='text-xl font-extrabold px-4 mb-6'>What's Happening</h2>
          <TrendingList trendingData={trendingData} />
          <div
            onClick={() => navigate('/explore')}
            className='p-4 hover:bg-gray-200 hover:cursor-pointer rounded-bl-2xl rounded-br-2xl'
          >
            <span className='text-twitter text-[15px]'>Show more</span>
          </div>
        </section>
      )}

      {/* Section: Who to follow */}
      <section
        className={`bg-gray-100 rounded-2xl pt-3 ${whoToFollow_marginTopStyles}`}
      >
        <h2 className='text-xl font-extrabold px-4 mb-6'>Who to follow</h2>

        {whoToFollow.map(item => (
          <div
            key={item.id}
            className='p-4 flex items-start  hover:bg-gray-200 hover:cursor-pointer'
          >
            <div className='flex-1'>
              <div
                onClick={() => handleGoToProfile(item.handle)}
                className='flex items-start'
              >
                <ProfilePicture
                  uri={constants.placeholder_profilePicture}
                  username={auth.user?.twitterHandle}
                />
                <div className='ml-4 flex flex-col'>
                  <span className='font-bold text-[15px] text-gray-700 hover:underline'>
                    {item.fullName}
                  </span>
                  <span className='text-[13px] text-gray-600'>
                    @{item.handle}
                  </span>
                  {item.isPromoted && (
                    <div className='mt-1 flex items-center'>
                      <BsFillArrowUpRightSquareFill className='text-xs' />
                      <span className='pl-1 text-xs text-gray-700'>
                        Promoted
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='max-w-[30%]'>
              <button
                onClick={() => {}}
                className='bg-black text-white text-[15px] py-[6px] px-4 rounded-full'
              >
                Follow
              </button>
            </div>
          </div>
        ))}
        <div
          onClick={() => navigate('/connect_people')}
          className='p-4 hover:bg-gray-200 hover:cursor-pointer rounded-bl-2xl rounded-br-2xl'
        >
          <span className='text-twitter text-[15px]'>Show more</span>
        </div>
      </section>

      {/* Footer */}
      <section className='mt-6 px-4 text-sm text-gray-600'>
        <div className='flex items-center flex-wrap'>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Terms of Service
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Privacy Policy
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Cookie Policy
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Accessibility
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Ads info
          </Link>
          <Link to='/' className='flex items-center hover:underline pb-1'>
            <span>More</span>
            <FiMoreHorizontal className='pl-1 pt-[3px]' />
          </Link>
        </div>
        <span>
          &copy; {new Date().getFullYear()} Twitter Clone by Diganta Som
        </span>
      </section>
    </>
  );
};

export default Trending;
