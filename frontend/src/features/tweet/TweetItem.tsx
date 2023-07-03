import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BsDot } from 'react-icons/bs';
import { FiMoreHorizontal } from 'react-icons/fi';

import useAuth from '../../hooks/useAuth';
import { useGetTweetsQuery, useDeleteTweetMutation } from './tweet.api-slice';
import { useGetPostDate } from '../../hooks/date-hooks';

import PostOptions from './PostOptions';
import ProfilePicture from '../../components/ProfilePicture';
import TweetActions from './TweetActions';
import TweetItemMedia from '../../components/TweetItemMedia';
import DeletedTweetPlaceholder from '../../components/DeletedTweetPlaceholder';

interface TweetItemProps {
  tweetId: string;
}

const TweetItem: FC<TweetItemProps> = ({ tweetId }) => {
  const navigate = useNavigate();

  const [showOptionsPopup, setShowOptionsPopup] = useState(false);

  const auth = useAuth();

  const { tweet } = useGetTweetsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      tweet: data?.entities[tweetId],
    }),
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
    await deleteTweet({ tweetId, parentTweetId: null });
    setShowOptionsPopup(false);
  };

  let content;

  if (isDeleted) {
    content = <DeletedTweetPlaceholder />;
  } else {
    content = (
      <div
        className='relative p-2 ph_sm:p-4 pb-3 hover:bg-gray-100 hover:cursor-pointer
      border-b-[1px] border-gray-200'
      >
        <div className='flex items-start'>
          <ProfilePicture uri={profilePicture} username={twitterHandle} />

          <div className='ml-2 ph_sm:ml-3 flex-1'>
            <div className='flex items-start ph_sm:items-center justify-between'>
              <div
                className='flex items-center space-x-2'
                onClick={navigateToPost}
              >
                <div className='flex flex-col ph:flex-row ph:items-center ph:space-x-2'>
                  <h3 className='font-bold'>{fullName}</h3>
                  <div className='flex items-center space-x-1'>
                    <span className='text-gray-500'>@{twitterHandle}</span>
                    <BsDot />
                    <span className='text-gray-500'>{createdAt}</span>
                  </div>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-full  hover:text-twitter hover:bg-twitter-light hover:cursor-pointer flex items-center justify-center
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

            <p className='mt-1 ph_sm:mt-[2px]' onClick={navigateToPost}>
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

export default TweetItem;
