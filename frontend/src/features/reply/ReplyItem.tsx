import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BsDot } from 'react-icons/bs';
import { FiMoreHorizontal } from 'react-icons/fi';

import useAuth from '../../hooks/useAuth';
import { useGetRepliesQuery } from './reply.api-slice';
import { useDeleteTweetMutation } from '../tweet/tweet.api-slice';
import { useGetUserBasicInfoQuery } from '../user/user.api-slice';
import { useGetPostDate } from '../../hooks/date-hooks';

import ProfilePicture from '../../components/ProfilePicture';
import ProfilePopup from '../user/ProfilePopup';
import TweetItemMedia from '../../components/TweetItemMedia';
import TweetActions from '../tweet/TweetActions';
import PostOptions from '../tweet/PostOptions';
import DeletedTweetPlaceholder from '../../components/DeletedTweetPlaceholder';

interface ReplyItemProps {
  parentTweetId: string;
  tweetId: string;
}

const ReplyItem: FC<ReplyItemProps> = ({ parentTweetId, tweetId }) => {
  const navigate = useNavigate();

  const [
    showProfilePopup_from_profilePic,
    setShowProfilePopup_from_profilePic,
  ] = useState(false);
  const [showProfilePopup_from_fullName, setShowProfilePopup_from_fullName] =
    useState(false);
  const [showProfilePopup_from_username, setShowProfilePopup_from_username] =
    useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);

  const auth = useAuth();

  const { tweet } = useGetRepliesQuery(
    { parentTweetId },
    {
      selectFromResult: ({ data }) => ({
        tweet: data?.entities[tweetId],
      }),
    }
  );

  const { data: userBasicData } = useGetUserBasicInfoQuery({
    userId: tweet?.userId || '',
  });

  const [
    deleteTweet,
    { isError: isDeleteTweetError, error: deleteTweetError },
  ] = useDeleteTweetMutation();

  useEffect(() => {
    if (isDeleteTweetError && deleteTweetError) {
      if ('data' in deleteTweetError) {
        alert((deleteTweetError.data as any).message);
      }
    }
  }, [isDeleteTweetError, deleteTweetError]);

  const createdAt = useGetPostDate(tweet?.creationDate);

  if (!tweet) return null;

  const { twitterHandle, profilePicture, fullName, caption, media, isDeleted } =
    tweet;

  const isMediaPresent = media.length > 0 && media[0] !== '';

  const navigateToPost = () => {
    navigate(`/${twitterHandle}/status/${tweetId}`);
  };

  const handleToggleOptions = () => {
    setShowOptionsPopup(prevState => !prevState);
  };

  const handleDeleteTweet = async () => {
    await deleteTweet({ tweetId, parentTweetId });
    setShowOptionsPopup(false);
  };

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

  if (isDeleted) {
    content = <DeletedTweetPlaceholder />;
  } else {
    content = (
      <div className='relative p-2 ph_sm:p-4 pb-3 hover:bg-gray-100 hover:cursor-pointer border-b-[1px] border-gray-200'>
        <div className='flex items-start'>
          {/* Profile Pic */}
          <div className='relative'>
            <div
              onMouseOver={handleMouseOverProfilePic}
              onMouseLeave={handleMouseLeaveProfilePic}
            >
              <ProfilePicture uri={profilePicture} username={twitterHandle} />
            </div>
            {showProfilePopup_from_profilePic && (
              <div
                onMouseOver={handleMouseOverProfilePic}
                onMouseLeave={handleMouseLeaveProfilePic}
                className='absolute z-30 top-10 hover:cursor-default'
              >
                <ProfilePopup
                  profilePicture={profilePicture}
                  fullName={fullName}
                  username={twitterHandle}
                  bio={userBasicData?.bio}
                  numberOfFollowers={userBasicData?.numberOfFollowers}
                  numberOfFollowing={userBasicData?.numberOfFollowing}
                />
              </div>
            )}
          </div>

          <div className='ml-2 ph_sm:ml-3 flex-1'>
            <div className='flex items-start ph_sm:items-center justify-between'>
              <div className='flex items-center space-x-2'>
                <div className='flex flex-col ph:flex-row ph:items-center ph:space-x-2'>
                  {/* Full Name */}
                  <div className='relative'>
                    <Link
                      to={'/' + twitterHandle}
                      onMouseOver={handleMouseOverFullname}
                      onMouseLeave={handleMouseLeaveFullname}
                      className='font-bold truncate hover:underline'
                    >
                      {fullName}
                    </Link>
                    {showProfilePopup_from_fullName && (
                      <div
                        onMouseOver={handleMouseOverFullname}
                        onMouseLeave={handleMouseLeaveFullname}
                        className='absolute z-30 top-5 hover:cursor-default'
                      >
                        <ProfilePopup
                          profilePicture={profilePicture}
                          fullName={fullName}
                          username={twitterHandle}
                          bio={userBasicData?.bio}
                          numberOfFollowers={userBasicData?.numberOfFollowers}
                          numberOfFollowing={userBasicData?.numberOfFollowing}
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex items-center space-x-1'>
                    {/* Username */}
                    <div className='relative'>
                      <Link
                        to={'/' + twitterHandle}
                        onMouseOver={handleMouseOverUsername}
                        onMouseLeave={() =>
                          setShowProfilePopup_from_username(false)
                        }
                        className='text-gray-500 truncate'
                      >
                        @{twitterHandle}
                      </Link>
                      {showProfilePopup_from_username && (
                        <div
                          onMouseOver={handleMouseOverUsername}
                          onMouseLeave={handleMouseLeaveUsername}
                          className='absolute z-30 top-5 -left-[200%] hover:cursor-default'
                        >
                          <ProfilePopup
                            profilePicture={profilePicture}
                            fullName={fullName}
                            username={twitterHandle}
                            bio={userBasicData?.bio}
                            numberOfFollowers={userBasicData?.numberOfFollowers}
                            numberOfFollowing={userBasicData?.numberOfFollowing}
                          />
                        </div>
                      )}
                    </div>
                    <BsDot />
                    {/* Created At */}
                    <Link
                      to={`/${twitterHandle}/status/${tweetId}`}
                      className='text-gray-500 truncate hover:underline'
                    >
                      {createdAt}
                    </Link>
                  </div>
                </div>
              </div>
              <div onClick={navigateToPost} className='flex-1'></div>
              <div
                className={`w-8 h-8 rounded-full hover:text-twitter hover:bg-twitter-light hover:cursor-pointer flex items-center justify-center
                ${
                  showOptionsPopup
                    ? 'text-twitter bg-twitter-light'
                    : 'text-gray-500'
                }
              `}
                onClick={handleToggleOptions}
              >
                <FiMoreHorizontal className='text-xl ph:text-2xl' />
              </div>
            </div>

            <p onClick={navigateToPost} className='mt-1 ph_sm:mt-[2px]'>
              {caption}
            </p>

            {isMediaPresent && (
              <TweetItemMedia
                tweetId={tweetId}
                media={media}
                twitterHandle={twitterHandle}
              />
            )}

            {auth.user && (
              <TweetActions
                currentUser={auth.user}
                tweet={tweet}
                isMediaPresent={isMediaPresent}
                tweetCreationDate={createdAt}
              />
            )}
          </div>
        </div>

        {showOptionsPopup && auth.user && (
          <PostOptions
            from='TweetItem'
            currentUser={auth.user}
            authorUsername={twitterHandle}
            handleDeletePost={handleDeleteTweet}
          />
        )}
      </div>
    );
  }

  return <>{content}</>;
};

export default ReplyItem;
