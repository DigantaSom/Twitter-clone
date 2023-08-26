import { FC, memo } from 'react';

import { AiOutlineRetweet } from 'react-icons/ai';
import { TbPencil } from 'react-icons/tb';

import SmallPopup from '../../components/SmallPopup';
import { useRetweetMutation } from './tweet.api-slice';

interface QuoteRetweetPopupProps {
  refTweetId: string;
  isAlreadyRetweeted: boolean;
  retweetedPostId: string | undefined;
}

const QuoteRetweetPopup: FC<QuoteRetweetPopupProps> = ({
  refTweetId,
  isAlreadyRetweeted,
  retweetedPostId,
}) => {
  const [retweet, { isLoading: isRetweetLoading }] = useRetweetMutation();

  const handleRetweet = () => {
    if (isRetweetLoading) return;

    // 'retweetedPostId' is only present while undo-retweet. While retweeting for the first time, it's undefined
    retweet({ refTweetId, retweetedPostId });
  };

  const handleQuoteTweet = () => {
    // TODO: add the quote tweet functionality
  };

  return (
    <SmallPopup>
      <div
        className='flex items-center p-3 text-black hover:bg-gray-50 hover:cursor-pointer'
        onClick={handleRetweet}
      >
        <AiOutlineRetweet className='text-xl' />
        <span className='ml-2 text-sm'>
          {isAlreadyRetweeted ? 'Undo Retweet' : 'Retweet'}
        </span>
      </div>
      <div
        className='flex items-center p-3 text-black hover:bg-gray-50 hover:cursor-pointer'
        onClick={handleQuoteTweet}
      >
        <TbPencil className='text-xl' />
        <span className='ml-2 text-sm'>Quote Tweet</span>
      </div>
    </SmallPopup>
  );
};

export default memo(QuoteRetweetPopup);
