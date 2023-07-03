import { FC } from 'react';
import { UserID } from '../user/user.types';

interface TweetPageStatusProps {
  retweets: UserID[];
  likes: UserID[];
  bookmarks: UserID[];
  handleOpenLikedByPopup: () => void;
}

const TweetPageStats: FC<TweetPageStatusProps> = ({
  retweets,
  likes,
  bookmarks,
  handleOpenLikedByPopup,
}) => {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col ph_xs:flex-row ph_xs:items-center ph_xs:justify-start ph_xs:space-x-6'>
        <div className='py-3'>
          <div className='w-fit hover:border-gray-600 hover:border-b-[1px] hover:-mt-[1px] hover:cursor-pointer group'>
            <span className='font-bold'>{retweets.length}</span>
            <span className='pl-1'>
              {retweets.length === 1 ? 'Retweet' : 'Retweets'}
            </span>
          </div>
        </div>
        <hr className='ph_xs:hidden' />

        <div className='py-3'>
          <div className='w-fit flex items-center hover:border-gray-600 hover:border-b-[1px] hover:-mt-[1px] hover:cursor-pointer'>
            <span className='font-bold'>0</span>
            <span className='pl-1'>Quote Tweets</span>
          </div>
        </div>
        <hr className='ph_xs:hidden' />

        <div className='hidden ph:block ph:py-3'>
          <div
            onClick={handleOpenLikedByPopup}
            className='w-fit flex items-center hover:border-gray-600 hover:border-b-[1px] hover:-mt-[1px] hover:cursor-pointer'
          >
            <span className='font-bold'>{likes.length}</span>
            <span className='pl-1'>
              {likes.length === 1 ? 'Like' : 'Likes'}
            </span>
          </div>
        </div>

        <div className='hidden sm:block sm:py-3'>
          <div className='w-fit flex items-center'>
            <span className='font-bold'>{bookmarks.length}</span>
            <span className='pl-1'>
              {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
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
            <span className='font-bold'>{likes.length}</span>
            <span className='pl-1'>
              {likes.length === 1 ? 'Like' : 'Likes'}
            </span>
          </div>
        </div>
        <hr className='ph_xs:hidden' />

        <div className='sm:hidden py-3'>
          <div className='w-fit flex items-center'>
            <span className='font-bold'>{bookmarks.length}</span>
            <span className='pl-1'>
              {bookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'}
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
