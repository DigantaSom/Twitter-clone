import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import { ProfilePageTab } from '../types';

import useAuth from '../hooks/useAuth';
import { useAppDispatch } from '../hooks/redux-hooks';
import { useGetProfileQuery } from '../features/user/user.api-slice';
import { closeLikedByPopup } from '../features/ui/ui.slice';

import Header from '../components/Header';
import ProfileInfo from '../features/user/ProfileInfo';

const ProfilePage = () => {
  const { username } = useParams();
  const { pathname } = useLocation();
  const auth = useAuth();
  const dispatch = useAppDispatch();

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useGetProfileQuery(
    { username, loggedInUserId: auth.user?.id },
    {
      pollingInterval: 25000,
      refetchOnMountOrArgChange: true,
    }
  );

  const topMostDivRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<ProfilePageTab>('Tweets');

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
  }, [pathname, profile?.username]);

  useEffect(() => {
    dispatch(closeLikedByPopup());
    topMostDivRef.current?.scrollIntoView({ behavior: 'smooth' }); // scroll to top
  }, [dispatch]);

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
      website,
      isFollowedByLoggedInUser,
      numberOfFollowing,
      numberOfFollowers,
    } = profile;

    content = (
      <div ref={topMostDivRef} className='pb-60'>
        <Header
          parentComponent='ProfilePage'
          name={name}
          numberOfTweets={numberOfTweets}
        />

        <ProfileInfo
          loggedInUserId={auth.user?.id}
          profileUserId={_id}
          headerPhoto={headerPhoto}
          profilePicture={profilePicture}
          name={name}
          username={username}
          bio={bio}
          birthday={birthday}
          joiningDate={joiningDate}
          website={website}
          isFollowedByLoggedInUser={isFollowedByLoggedInUser}
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
