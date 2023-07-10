import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useGetUserBasicInfoByIdQuery } from './user.api-slice';

import ProfilePicture from '../../components/ProfilePicture';
import FollowButton from './FollowButton';
import ProfilePopup from './ProfilePopup';

import constants from '../../constants';

interface UserListItemProps {
  userId: string;
  loggedInUserId: string | undefined;
}

const UserListItem: FC<UserListItemProps> = ({ userId, loggedInUserId }) => {
  const navigate = useNavigate();

  const { data, isSuccess } = useGetUserBasicInfoByIdQuery(
    { userId: userId, loggedInUserId },
    {
      pollingInterval: 20000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    }
  );

  const [
    showProfilePopup_from_profilePic,
    setShowProfilePopup_from_profilePic,
  ] = useState(false);
  const [showProfilePopup_from_fullName, setShowProfilePopup_from_fullName] =
    useState(false);
  const [showProfilePopup_from_username, setShowProfilePopup_from_username] =
    useState(false);

  const handleMouseOverProfilePic = () => {
    setShowProfilePopup_from_profilePic(true);
    setShowProfilePopup_from_fullName(false);
    setShowProfilePopup_from_username(false);
  };
  const handleMouseLeaveProfilePic = () => {
    setShowProfilePopup_from_profilePic(false);
  };

  const handleMouseOverFullname = () => {
    setShowProfilePopup_from_fullName(true);
    setShowProfilePopup_from_profilePic(false);
    setShowProfilePopup_from_username(false);
  };
  const handleMouseLeaveFullname = () => {
    setShowProfilePopup_from_fullName(false);
  };

  const handleMouseOverUsername = () => {
    setShowProfilePopup_from_username(true);
    setShowProfilePopup_from_fullName(false);
    setShowProfilePopup_from_profilePic(false);
  };
  const handleMouseLeaveUsername = () => {
    setShowProfilePopup_from_username(false);
  };

  let content;

  if (!data || !isSuccess) {
    content = null;
  } else {
    const {
      _id,
      username,
      profilePicture,
      name,
      bio,
      isFollowedByLoggedInUser,
      numberOfFollowers,
      numberOfFollowing,
    } = data;

    const goToProfile = () => {
      if (
        showProfilePopup_from_profilePic ||
        showProfilePopup_from_fullName ||
        showProfilePopup_from_username
      ) {
        return;
      } else {
        navigate(`/${data.username}`);
      }
    };

    content = (
      <div className='px-2 ph_xs:px-4 py-2 ph_xs:py-4 hover:bg-gray-100 hover:cursor-pointer'>
        <div
          className={`flex items-start ${constants.profilePicture_info_gap_style}`}
        >
          {/* Profile Picture */}
          <div className='relative'>
            <div
              onMouseOver={handleMouseOverProfilePic}
              onMouseLeave={handleMouseLeaveProfilePic}
            >
              <ProfilePicture uri={profilePicture} username={username} />
            </div>
            {showProfilePopup_from_profilePic && (
              <div
                onMouseOver={handleMouseOverProfilePic}
                onMouseLeave={handleMouseLeaveProfilePic}
                className='absolute z-30 top-10 hover:cursor-default'
              >
                <ProfilePopup
                  userId={_id}
                  profilePicture={profilePicture}
                  fullName={name}
                  username={username}
                  bio={bio}
                  isFollowedByLoggedInUser={isFollowedByLoggedInUser}
                  numberOfFollowers={numberOfFollowers}
                  numberOfFollowing={numberOfFollowing}
                />
              </div>
            )}
          </div>

          <div className='flex flex-col flex-1'>
            <div className='flex items-center justify-between'>
              <div onClick={goToProfile} className='flex-1 text-[15px]'>
                {/* Full Name */}
                <div className='relative'>
                  <Link
                    to={'/' + username}
                    onMouseOver={handleMouseOverFullname}
                    onMouseLeave={handleMouseLeaveFullname}
                    className='font-bold truncate hover:underline'
                  >
                    {name}
                  </Link>
                  {showProfilePopup_from_fullName && (
                    <div
                      onMouseOver={handleMouseOverFullname}
                      onMouseLeave={handleMouseLeaveFullname}
                      className='absolute z-30 top-5 hover:cursor-default'
                    >
                      <ProfilePopup
                        userId={_id}
                        profilePicture={profilePicture}
                        fullName={name}
                        username={username}
                        bio={bio}
                        isFollowedByLoggedInUser={isFollowedByLoggedInUser}
                        numberOfFollowers={numberOfFollowers}
                        numberOfFollowing={numberOfFollowing}
                      />
                    </div>
                  )}
                </div>
                {/* Username */}
                <div className='relative'>
                  <Link
                    to={'/' + username}
                    onMouseOver={handleMouseOverUsername}
                    onMouseLeave={() =>
                      setShowProfilePopup_from_username(false)
                    }
                    className='text-gray-500 truncate'
                  >
                    @{username}
                  </Link>
                  {showProfilePopup_from_username && (
                    <div
                      onMouseOver={handleMouseOverUsername}
                      onMouseLeave={handleMouseLeaveUsername}
                      className='absolute z-30 top-5 hover:cursor-default'
                    >
                      <ProfilePopup
                        userId={_id}
                        profilePicture={profilePicture}
                        fullName={name}
                        username={username}
                        bio={bio}
                        isFollowedByLoggedInUser={isFollowedByLoggedInUser}
                        numberOfFollowers={numberOfFollowers}
                        numberOfFollowing={numberOfFollowing}
                      />
                    </div>
                  )}
                </div>
              </div>
              <FollowButton
                isFollowedByLoggedInUser={data.isFollowedByLoggedInUser}
                targetUserId={userId}
              />
            </div>

            <div onClick={goToProfile}>{data.bio || ''}</div>
          </div>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default UserListItem;
