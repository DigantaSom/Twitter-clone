import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { useGetTweetByIdQuery } from './tweet.api-slice';
import { selectLikedByPopupTweetId, closeLikedByPopup } from '../ui/ui.slice';

import AppPopup from '../../components/AppPopup';
import LikedByListItem from './LikedByListItem';

const LikedByPopup = () => {
  const dispatch = useAppDispatch();
  const likedByPopupTweetId = useAppSelector(selectLikedByPopupTweetId);

  const {
    data: tweet,
    isLoading,
    isError,
    error,
  } = useGetTweetByIdQuery({ id: likedByPopupTweetId! });

  console.log(tweet);

  return (
    <AppPopup>
      <header className='px-2 ph_xs:px-4 flex items-center space-x-3 absolute top-0 w-full h-10'>
        <div
          onClick={() => dispatch(closeLikedByPopup())}
          className='w-8 h-8 p-1 -ml-1 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
        >
          <IoCloseSharp className='hidden ph:block text-2xl text-gray-700' />
          <IoArrowBack className='ph:hidden text-2xl text-gray-700' />
        </div>
        <h2 className='font-bold text-xl'>Liked by</h2>
      </header>

      <main className='flex-1 mt-12 h-full overflow-y-scroll'>
        {tweet?.likes.map(like => (
          <LikedByListItem key={like.userId} like={like} />
        ))}
      </main>
    </AppPopup>
  );
};

export default LikedByPopup;
