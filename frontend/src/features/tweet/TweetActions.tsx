import { FC } from 'react';
import { AiOutlineRetweet, AiOutlineHeart } from 'react-icons/ai';
import { MdIosShare } from 'react-icons/md';
import { TbMessageCircle2 } from 'react-icons/tb';

import { Tweet } from './tweet.types';

interface TweetActionsProps {
  tweet: Tweet;
}

const TweetActions: FC<TweetActionsProps> = ({
  tweet: { replies, retweets, likes },
}) => {
  return (
    <div className='grid grid-cols-4 items-center'>
      <div className='flex items-center text-gray-500 hover:text-twitter group'>
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

      <div className='flex items-center text-gray-500 hover:text-like group'>
        <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-like-light ph_sm:mr-2'>
          <AiOutlineHeart className='ph_sm:text-xl' />
        </div>
        <span className='text-xs ph_sm:text-sm'>{likes.length}</span>
      </div>

      <div className='text-gray-500'>
        <div className=' ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full pb-[2px] ph:pb-1 hover:bg-twitter-light hover:text-twitter flex items-center justify-end ph:justify-center flex-1'>
          <MdIosShare className='ph_sm:text-xl' />
        </div>
      </div>
    </div>
  );
};

export default TweetActions;
