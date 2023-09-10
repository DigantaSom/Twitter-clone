import { FC } from 'react';
import { Link } from 'react-router-dom';

interface TweetPageStatusProps {
  tweetId: string;
  authorUsername: string;
  numberOfRetweets: number;
  numberOfQuotes: number;
  numberOfLikes: number;
  numberOfBookmarks: number;
  handleOpenRetweetedByPopup: () => void;
  handleOpenLikedByPopup: () => void;
}

const TweetPageStats: FC<TweetPageStatusProps> = ({
  tweetId,
  authorUsername,
  numberOfRetweets,
  numberOfQuotes,
  numberOfLikes,
  numberOfBookmarks,
  handleOpenRetweetedByPopup,
  handleOpenLikedByPopup,
}) => {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col ph_xs:flex-row ph_xs:items-center ph_xs:justify-start ph_xs:space-x-6'>
        <div onClick={handleOpenRetweetedByPopup} className='py-3'>
          <div className='w-fit hover:border-gray-600 hover:border-b-[1px] hover:-mt-[1px] hover:cursor-pointer group'>
            <span className='font-bold'>{numberOfRetweets}</span>
            <span className='pl-1'>
              {numberOfRetweets === 1 ? 'Retweet' : 'Retweets'}
            </span>
          </div>
        </div>
        <hr className='ph_xs:hidden' />

        <Link
          to={`/${authorUsername}/status/${tweetId}/quotes`}
          className='py-3'
        >
          <div className='w-fit flex items-center hover:border-gray-600 hover:border-b-[1px] hover:-mt-[1px] hover:cursor-pointer'>
            <span className='font-bold'>{numberOfQuotes}</span>
            <span className='pl-1'>
              {numberOfQuotes === 1 ? 'Quote' : 'Quotes'}
            </span>
          </div>
        </Link>
        <hr className='ph_xs:hidden' />

        <div className='hidden ph:block ph:py-3'>
          <div
            onClick={handleOpenLikedByPopup}
            className='w-fit flex items-center hover:border-gray-600 hover:border-b-[1px] hover:-mt-[1px] hover:cursor-pointer'
          >
            <span className='font-bold'>{numberOfLikes}</span>
            <span className='pl-1'>
              {numberOfLikes === 1 ? 'Like' : 'Likes'}
            </span>
          </div>
        </div>

        <div className='hidden sm:block sm:py-3'>
          <div className='w-fit flex items-center'>
            <span className='font-bold'>{numberOfBookmarks}</span>
            <span className='pl-1'>
              {numberOfBookmarks === 1 ? 'Bookmark' : 'Bookmarks'}
            </span>
          </div>
        </div>
      </div>
      <hr className='hidden ph_xs:block sm:hidden' />

      <div className='flex flex-col ph_xs:flex-row ph_xs:items-center ph_xs:justify-start ph_xs:space-x-6 ph:space-x-0'>
        <div className='ph:hidden py-3'>
          <div
            onClick={handleOpenLikedByPopup}
            className='w-fit flex items-center hover:border-gray-600 hover:border-b-[1px] hover:-mt-[1px] hover:cursor-pointer'
          >
            <span className='font-bold'>{numberOfLikes}</span>
            <span className='pl-1'>
              {numberOfLikes === 1 ? 'Like' : 'Likes'}
            </span>
          </div>
        </div>
        <hr className='ph_xs:hidden' />

        <div className='sm:hidden py-3'>
          <div className='w-fit flex items-center'>
            <span className='font-bold'>{numberOfBookmarks}</span>
            <span className='pl-1'>
              {numberOfBookmarks === 1 ? 'Bookmark' : 'Bookmarks'}
            </span>
          </div>
        </div>
        <hr className='ph_xs:hidden' />
      </div>
      <hr className='hidden ph_xs:block' />
    </div>
  );
};

export default TweetPageStats;
