import { FC } from 'react';
import {
  MdOutlineContentCopy,
  MdOutlineBookmarkAdd,
  MdOutlineBookmarkRemove,
} from 'react-icons/md';
import SmallPopup from '../../components/SmallPopup';

import copyTextToClipboard from '../../utils/copyTextToClipboard.util';

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
  const handleCopyLinkToTweet = () => {
    copyTextToClipboard(`/${tweet.twitterHandle}/status/${tweet._id}`);
    handleClosePopup();
  };

  return (
    <SmallPopup>
      <>
        <div
          className='flex items-center p-3 hover:bg-gray-50 hover:cursor-pointer'
          onClick={handleCopyLinkToTweet}
        >
          <MdOutlineContentCopy className='text-lg' />
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
      </>
    </SmallPopup>
  );
};

export default ShareTweetPopupContents;
