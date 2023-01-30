import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdIosShare } from 'react-icons/md';
import { TbMessageCircle2 } from 'react-icons/tb';

import { Tweet } from './tweet.types';
import { TokenPayloadUser } from '../../types';

import { useLikeTweetMutation } from './tweet.api-slice';

interface TweetActionsProps {
  tweet: Tweet;
  currentUser: TokenPayloadUser;
}

const TweetActions: FC<TweetActionsProps> = ({
  tweet: { _id: tweetId, twitterHandle, replies, retweets, likes },
  currentUser,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const [likeTweet, { isLoading }] = useLikeTweetMutation();

  useEffect(() => {
    // if the post is liked by the current logged in user
    if (likes.some(like => like.userId === currentUser.id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [likes, currentUser.id]);

  const navigateToPost = () => {
    navigate(`/${twitterHandle}/status/${tweetId}`);
  };

  const handleLikeTweet = async () => {
    if (!isLoading) {
      try {
        const res = await likeTweet({ tweetId }).unwrap();

        if ((res as any)?.isError) {
          alert((res as any)?.message);
          return;
        }
      } catch (err: any) {
        console.log(err);
        let errMsg = '';

        if (!err.status) {
          errMsg = 'No Server Response';
        } else {
          errMsg = err.data?.message;
        }
        alert(errMsg);
      }
    }
  };

  return (
    <div className='grid grid-cols-4 items-center'>
      <div
        onClick={navigateToPost}
        className='flex items-center text-gray-500 hover:text-twitter group'
      >
        <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-twitter-light ph_sm:mr-2'>
          <TbMessageCircle2 className='ph_sm:text-xl' />
        </div>
        <span className='text-xs ph_sm:text-sm'>{replies.length}</span>
      </div>

      <div className='flex items-center text-gray-500 hover:text-twitter group'>
        <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-twitter-light ph_sm:mr-2'>
          <AiOutlineRetweet className='ph_sm:text-xl' />
        </div>
        <span className='text-xs ph_sm:text-sm'>{retweets.length}</span>
      </div>

      {isLoading ? (
        <ClipLoader
          color='#F91880' // same as 'like' color
          size={25}
        />
      ) : (
        <div
          onClick={handleLikeTweet}
          className='flex items-center text-gray-500 hover:text-like group'
        >
          <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-like-light ph_sm:mr-2'>
            <span className='ph_sm:text-xl'>
              {isLiked ? (
                <AiFillHeart className='text-like' />
              ) : (
                <AiOutlineHeart />
              )}
            </span>
          </div>
          <span className={`text-xs ph_sm:text-sm ${isLiked && 'text-like'}`}>
            {likes.length}
          </span>
        </div>
      )}

      <div className='text-gray-500'>
        <div className=' ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full pb-[2px] ph:pb-1 hover:bg-twitter-light hover:text-twitter flex items-center justify-end ph:justify-center flex-1'>
          <MdIosShare className='ph_sm:text-xl' />
        </div>
      </div>
    </div>
  );
};

export default TweetActions;
