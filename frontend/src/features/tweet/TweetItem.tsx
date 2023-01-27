import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { BsDot } from 'react-icons/bs';
import { FiMoreHorizontal } from 'react-icons/fi';

import { useGetTweetsQuery } from './tweet.api-slice';
import { useGetPostDate } from '../../hooks/date-hooks';

import ProfilePicture from '../../components/ProfilePicture';
import TweetActions from './TweetActions';

interface TweetItemProps {
  tweetId: string;
}

const TweetItem: FC<TweetItemProps> = ({ tweetId }) => {
  const navigate = useNavigate();

  const { tweet } = useGetTweetsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      tweet: data?.entities[tweetId],
    }),
  });

  const createdAt = useGetPostDate(tweet?.creationDate);

  if (!tweet) return null;

  const { twitterHandle, profilePicture, fullName, caption, media } = tweet;

  const navigateToPost = () => {
    navigate(`/${twitterHandle}/status/${tweetId}`);
  };

  const navigateToPostFullScreen = () => {
    navigate(`/${twitterHandle}/status/${tweetId}/photo`);
  };

  return (
    <div
      className='p-2 ph_sm:p-4 pb-3 hover:bg-gray-100 hover:cursor-pointer 
      border-b-[1px] border-gray-200'
    >
      <div className='flex items-start'>
        <ProfilePicture uri={profilePicture} />

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
            <FiMoreHorizontal
              className='text-xl ph:text-2xl text-gray-500'
              onClick={() => {}}
            />
          </div>

          <p className='mt-1 ph_sm:mt-[2px]' onClick={navigateToPost}>
            {caption}
          </p>

          {media.length > 0 && media[0] !== '' && (
            <div onClick={navigateToPostFullScreen} className='pt-3 pb-2'>
              <img
                src={media[0]}
                alt='Post'
                className='w-full h-full rounded-xl'
              />
            </div>
          )}

          <TweetActions tweet={tweet} />
        </div>
      </div>
    </div>
  );
};

export default TweetItem;
