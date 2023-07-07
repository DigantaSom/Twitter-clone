import { FC } from 'react';

import { AiOutlineLink } from 'react-icons/ai';
import { MdOutlineBookmarkAdd, MdOutlineBookmarkRemove } from 'react-icons/md';

import { useAppDispatch } from '../../hooks/redux-hooks';
import { setToast, removeToast } from '../toast/toast.slice';

import SmallPopup from '../../components/SmallPopup';

import copyTextToClipboard from '../../utils/copyTextToClipboard.util';
import K from '../../constants';

interface ShareTweetPopupContentsProps {
  tweet: {
    _id: string;
    twitterHandle: string;
  };
  isBookmarked_displayOnUI: boolean;
  handleBookmarkTweet: () => void;
  handleClosePopup: () => void;
}

const ShareTweetPopupContents: FC<ShareTweetPopupContentsProps> = ({
  tweet,
  isBookmarked_displayOnUI,
  handleBookmarkTweet,
  handleClosePopup,
}) => {
  const dispatch = useAppDispatch();

  const handleCopyLinkToTweet = () => {
    copyTextToClipboard(
      `http://localhost:3000/${tweet.twitterHandle}/status/${tweet._id}`
    );
    handleClosePopup();

    dispatch(
      setToast({ type: 'copy-to-clipboard', message: 'Copied to clipboard' })
    );
    setTimeout(() => {
      dispatch(removeToast());
    }, K.toastDuration);
  };

  return (
    <SmallPopup>
      <div
        className='flex items-center p-3 hover:bg-gray-50 hover:cursor-pointer'
        onClick={handleCopyLinkToTweet}
      >
        <AiOutlineLink className='text-xl' />
        <span className='ml-2 text-sm'>Copy link to Tweet</span>
      </div>
      <div
        className='flex items-center p-3 hover:bg-gray-50 hover:cursor-pointer'
        onClick={handleBookmarkTweet}
      >
        {isBookmarked_displayOnUI ? (
          <>
            <MdOutlineBookmarkRemove className='text-lg' />
            <span className='ml-2 text-sm'>Remove Tweet from Bookmarks</span>
          </>
        ) : (
          <>
            <MdOutlineBookmarkAdd className='text-lg' />
            <span className='ml-2 text-sm'>Bookmark</span>
          </>
        )}
      </div>
    </SmallPopup>
  );
};

export default ShareTweetPopupContents;
