import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import { ProfileTab } from '../types';
import { useGetProfileQuery } from '../features/user/user.api-slice';

import Header from '../components/Header';
import ProfileInfo from '../features/user/ProfileInfo';

const ProfilePage = () => {
  const { username } = useParams();
  const { pathname } = useLocation();

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useGetProfileQuery({ username }, { refetchOnMountOrArgChange: true });

  const [selectedTab, setSelectedTab] = useState<ProfileTab>('Tweets');

  useEffect(() => {
    if (
      pathname === `/${profile?.username}` ||
      pathname === `/${profile?.username}/`
    ) {
      setSelectedTab('Tweets');
    } else if (
      pathname === `/${profile?.username}/with_replies` ||
      pathname === `/${profile?.username}/with_replies/`
    ) {
      setSelectedTab('Replies');
    } else if (
      pathname === `/${profile?.username}/media` ||
      pathname === `/${profile?.username}/media/`
    ) {
      setSelectedTab('Media');
    } else if (
      pathname === `/${profile?.username}/likes` ||
      pathname === `/${profile?.username}/likes/`
    ) {
      setSelectedTab('Likes');
    }
  }, [pathname]);

  const selectedTabExtraStyles = 'pb-3 border-b-4 border-b-twitter';

  let content;

  if (isLoading) {
    content = <PulseLoader color='#1D9BF0' />; // same as twitter-default color
  } else if (isError) {
    console.log('Error loading replies', error);
    content = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || 'Error loading Profile.'}
      </div>
    );
  } else if (profile) {
    const {
      _id,
      name,
      username,
      headerPhoto,
      profilePicture,
      bio,
      birthday,
      joiningDate,
      numberOfTweets,
      numberOfFollowing,
      numberOfFollowers,
    } = profile;

    content = (
      <div className='mb-60'>
        <Header
          parentComponent='ProfilePage'
          name={name}
          numberOfTweets={numberOfTweets}
        />

        <ProfileInfo
          profileUserId={_id}
          headerPhoto={headerPhoto}
          profilePicture={
            profilePicture ||
            'https://pbs.twimg.com/profile_images/1673946227736723458/QRU9Z4Cm_400x400.jpg'
          }
          name={name}
          username={username}
          bio={bio}
          birthday={birthday}
          joiningDate={joiningDate}
          numberOfFollowing={numberOfFollowing}
          numberOfFollowers={numberOfFollowers}
        />

        {/* Tabs */}
        <div className='mt-4 grid grid-cols-4 border-b-[1px] border-b-gray-200'>
          <Link
            to=''
            className='text-gray-600 font-semibold hover:bg-gray-200 flex items-center justify-center'
          >
            <div
              className={`w-fit py-4 ${
                selectedTab === 'Tweets' && selectedTabExtraStyles
              }`}
            >
              Tweets
            </div>
          </Link>
          <Link
            to='with_replies'
            className='text-gray-600 font-semibold hover:bg-gray-200 flex items-center justify-center'
          >
            <div
              className={`w-fit py-4 ${
                selectedTab === 'Replies' && selectedTabExtraStyles
              }`}
            >
              Replies
            </div>
          </Link>
          <Link
            to='media'
            className='text-gray-600 font-semibold hover:bg-gray-200 flex items-center justify-center'
          >
            <div
              className={`w-fit py-4 ${
                selectedTab === 'Media' && selectedTabExtraStyles
              }`}
            >
              Media
            </div>
          </Link>
          <Link
            to='likes'
            className='text-gray-600 font-semibold hover:bg-gray-200 flex items-center justify-center'
          >
            <div
              className={`w-fit py-4 ${
                selectedTab === 'Likes' && selectedTabExtraStyles
              }`}
            >
              Likes
            </div>
          </Link>
        </div>

        {/* Tweet, Replies, Media and Likes lists */}
        <Outlet />
      </div>
    );
  }

  return <>{content}</>;
};

export default ProfilePage;
