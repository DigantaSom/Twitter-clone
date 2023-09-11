import { FC, useState } from 'react';
import { ClipLoader } from 'react-spinners';

import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { MdIosShare } from 'react-icons/md';
import { TbMessageCircle2 } from 'react-icons/tb';

import useAuth from '../../hooks/useAuth';
import { useGetRetweetedPostIdQuery } from './tweet.api-slice';

import ShareTweetPopupContents from './ShareTweetPopupContents';
import QuoteRetweetPopup from './QuoteRetweetPopup';

interface TweetPageActionsProps {
  tweet: {
    _id: string;
    username: string;
    isDeleted: boolean;
  };
  isRetweeted_displayOnUI: boolean;
  isLikeTweetLoading: boolean;
  isLiked_displayOnUI: boolean;
  isBookmarkTweetLoading: boolean;
  isBookmarked_displayOnUI: boolean;
  showSharePopup: boolean;
  handleClickReplyButton: () => void;
  handleLikeTweet: () => void;
  handleBookmarkTweet: () => void;
  handleClickShareButton: () => void;
  handleClickBookmarkFromSharePopup: () => void;
  handleCloseSharePopup: () => void;
}

const TweetPageActions: FC<TweetPageActionsProps> = ({
  tweet: { _id: tweetId, username, isDeleted },
  isRetweeted_displayOnUI,
  isLikeTweetLoading,
  isLiked_displayOnUI,
  isBookmarkTweetLoading,
  isBookmarked_displayOnUI,
  showSharePopup,
  handleClickReplyButton,
  handleLikeTweet,
  handleBookmarkTweet,
  handleClickShareButton,
  handleClickBookmarkFromSharePopup,
  handleCloseSharePopup,
}) => {
  const auth = useAuth();

  const { data: retweetedPostId_onlyFor_retweetRefTweetItem } =
    useGetRetweetedPostIdQuery(
      {
        refTweetId: tweetId,
        loggedInUsername: auth.user?.twitterHandle,
      },
      { refetchOnMountOrArgChange: true }
    );

  const [showQuoteRetweetPopup, setShowQuoteRetweetPopup] = useState(false);

  const toggleQuoteRetweetPopup = () => {
    setShowQuoteRetweetPopup(prevState => !prevState);
  };

  return (
    <div className='relative'>
      {!isDeleted && (
        <div className='py-1 flex items-center justify-around'>
          {/* Reply */}
          <div
            title='Reply'
            onClick={handleClickReplyButton}
            className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:text-twitter hover:bg-twitter-light ph_sm:mr-2'
          >
            <TbMessageCircle2 className='ph_sm:text-xl' />
          </div>

          {/* Retweet or Quote */}
          <div onClick={toggleQuoteRetweetPopup} className='relative'>
            <div
              title='Retweet'
              className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer text-bold hover:text-emerald-500 hover:bg-emerald-200 ph_sm:mr-2'
            >
              <AiOutlineRetweet
                className={`ph_sm:text-xl ${
                  isRetweeted_displayOnUI && 'text-emerald-500 text-bold'
                }`}
              />
            </div>

            {showQuoteRetweetPopup && (
              <div className='absolute z-40 top-10 w-[150px]'>
                <QuoteRetweetPopup
                  refTweetId={tweetId}
                  isAlreadyRetweeted={isRetweeted_displayOnUI}
                  retweetedPostId={
                    retweetedPostId_onlyFor_retweetRefTweetItem?.loggedInUser_retweetedPostId
                  }
                />
              </div>
            )}
          </div>

          {/* Like */}
          {isLikeTweetLoading ? (
            <ClipLoader
              color='#F91880' // same as 'like' color
              size={25}
            />
          ) : (
            <div
              title={isLiked_displayOnUI ? 'Unlike' : 'Like'}
              onClick={handleLikeTweet}
              className='flex items-center hover:text-like'
            >
              <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-like-light ph_sm:mr-2'>
                <span className='ph_sm:text-xl'>
                  {isLiked_displayOnUI ? (
                    <AiFillHeart className='text-like' />
                  ) : (
                    <AiOutlineHeart />
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Bookmark */}
          {isBookmarkTweetLoading ? (
            <ClipLoader
              color='#1D9BF0' // same as twitter-default color
              size={25}
            />
          ) : (
            <div
              title={
                isBookmarked_displayOnUI
                  ? 'Remove Tweet from Bookmarks'
                  : 'Bookmark'
              }
              onClick={handleBookmarkTweet}
              className='flex items-center hover:text-twitter'
            >
              <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-twitter-light ph_sm:mr-2'>
                <span className='ph_sm:text-xl'>
                  {isBookmarked_displayOnUI ? (
                    <BsBookmarkFill className='text-twitter text-lg' />
                  ) : (
                    <BsBookmark className='text-lg' />
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Share */}
          <div
            title='Share'
            onClick={handleClickShareButton}
            className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:text-twitter hover:bg-twitter-light ph_sm:mr-2'
          >
            <MdIosShare className='ph_sm:text-xl' />
          </div>
        </div>
      )}

      {showSharePopup && (
        <div className='absolute z-20 bottom-14 right-0 text-black'>
          <ShareTweetPopupContents
            tweet={{ _id: tweetId, username }}
            isBookmarked_displayOnUI={isBookmarked_displayOnUI}
            handleBookmarkTweet={handleClickBookmarkFromSharePopup}
            handleClosePopup={handleCloseSharePopup}
          />
        </div>
      )}
    </div>
  );
};

export default TweetPageActions;
