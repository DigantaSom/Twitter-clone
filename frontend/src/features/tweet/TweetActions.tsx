import { FC, memo, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import { TbMessageCircle2 } from 'react-icons/tb';
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdIosShare } from 'react-icons/md';

import { TokenPayloadUser } from '../../types';
import { Tweet } from './tweet.types';

import { useAppDispatch } from '../../hooks/redux-hooks';
import {
  useLikeTweetMutation,
  useBookmarkTweetMutation,
} from './tweet.api-slice';
import { setToast, removeToast } from '../toast/toast.slice';

import { setCreateReplyPopupData } from '../reply/reply.slice';
import { toggleCreateReplyPopup } from '../ui/ui.slice';

import ShareTweetPopupContents from './ShareTweetPopupContents';
import QuoteRetweetPopup from './QuoteRetweetPopup';

import constants from '../../constants';

interface TweetActionsProps {
  currentUser: TokenPayloadUser;
  author: {
    username: string;
    name: string;
    profilePicture: string;
  };
  tweet: Tweet;
  isMediaPresent: boolean;
  tweetCreationDate: string;
  retweetedPostId: string | undefined;
}

const TweetActions: FC<TweetActionsProps> = ({
  currentUser,
  author: { username, name, profilePicture },
  tweet,
  isMediaPresent,
  tweetCreationDate,
  retweetedPostId,
}) => {
  const { _id: tweetId, degree, likes, retweets, bookmarks } = tweet;

  const dispatch = useAppDispatch();

  const [isLiked_displayOnUI, setIsLiked_displayOnUI] = useState(false);
  const [isRetweeted_displayOnUI, setIsRetweeted_displayOnUI] = useState(false);
  const [isBookmarked_displayOnUI, setIsBookmarked_displayOnUI] =
    useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showQuoteRetweetPopup, setShowQuoteRetweetPopup] = useState(false);

  const [likeTweet, { isLoading: isLikeLoading }] = useLikeTweetMutation();
  const [bookmarkTweet, { isLoading: isBookmarkLoading }] =
    useBookmarkTweetMutation();

  useEffect(() => {
    // if the tweet is liked by the currently logged in user
    if (likes.some(like => like.userId === currentUser.id)) {
      setIsLiked_displayOnUI(true);
    } else {
      setIsLiked_displayOnUI(false);
    }
  }, [likes, currentUser.id]);

  useEffect(() => {
    if (retweets.some(retweet => retweet.userId === currentUser.id)) {
      setIsRetweeted_displayOnUI(true);
    } else {
      setIsRetweeted_displayOnUI(false);
    }
  }, [currentUser.id, retweets]);

  useEffect(() => {
    // if the tweet is bookmarked by the current logged-in user
    if (bookmarks.some(bookmark => bookmark.userId === currentUser.id)) {
      setIsBookmarked_displayOnUI(true);
    } else {
      setIsBookmarked_displayOnUI(false);
    }
  }, [bookmarks, currentUser.id]);

  const handleClickReplyButton = () => {
    dispatch(
      setCreateReplyPopupData({
        currentUser,
        parentTweetId: tweetId,
        parentTweetDegree: degree,
        replyingTo: {
          profilePicture,
          fullName: name,
          username,
        },
        caption: tweet.caption,
        isMediaPresent,
        creationDate: tweetCreationDate,
      })
    );
    dispatch(toggleCreateReplyPopup(true));
  };

  const handleLikeTweet = async () => {
    if (!isLikeLoading) {
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

  const handleBookmarkTweet = async () => {
    if (!isBookmarkLoading) {
      try {
        const res = await bookmarkTweet({ tweetId }).unwrap();

        if ((res as any)?.isError) {
          alert((res as any)?.message);
          return;
        } else {
          if (res.message.toLowerCase() === 'tweet added to your bookmarks') {
            dispatch(setToast({ type: 'bookmark-add', message: res.message }));
          } else {
            dispatch(
              setToast({ type: 'bookmark-remove', message: res.message })
            );
          }
          setTimeout(() => {
            dispatch(removeToast());
          }, constants.toastDuration);
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

  const handleClickShareButton = () => {
    setShowSharePopup(prevState => !prevState);
  };
  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
  };

  const handleClickBookmarkFromSharePopup = () => {
    handleBookmarkTweet();
    handleCloseSharePopup();
  };

  const toggleQuoteRetweetPopup = () => {
    setShowQuoteRetweetPopup(prevState => !prevState);
  };

  return (
    <div className='-ml-3 grid grid-cols-4 items-center relative'>
      {/* Reply */}
      <div
        title='Reply'
        onClick={handleClickReplyButton}
        className='flex items-center text-gray-500 hover:text-twitter group'
      >
        <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-twitter-light ph_sm:mr-2'>
          <TbMessageCircle2 className='ph_sm:text-xl' />
        </div>
        <span className='text-xs ph_sm:text-sm'>{tweet.numberOfReplies}</span>
      </div>

      {/* Retweet */}
      <div onClick={toggleQuoteRetweetPopup} className='relative'>
        <div className='flex items-center text-gray-500 hover:text-twitter group'>
          <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-twitter-light ph_sm:mr-2'>
            <AiOutlineRetweet
              className={`ph_sm:text-xl ${
                isRetweeted_displayOnUI && 'text-emerald-500'
              }`}
            />
          </div>
          <span
            className={`text-xs ph_sm:text-sm ${
              isRetweeted_displayOnUI && 'text-emerald-500'
            }`}
          >
            {retweets.length}
          </span>
        </div>

        {showQuoteRetweetPopup && (
          <div className='absolute z-40 top-10 w-[125%]'>
            <QuoteRetweetPopup
              refTweetId={tweetId}
              isAlreadyRetweeted={isRetweeted_displayOnUI}
              retweetedPostId={retweetedPostId}
            />
          </div>
        )}
      </div>

      {/* Like */}
      {isLikeLoading ? (
        <ClipLoader
          color='#F91880' // same as 'like' color
          size={25}
        />
      ) : (
        <div
          title={isLiked_displayOnUI ? 'Unlike' : 'Like'}
          onClick={handleLikeTweet}
          className='flex items-center text-gray-500 hover:text-like group'
        >
          <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-like-light ph_sm:mr-2'>
            <span className='ph_sm:text-xl'>
              {isLiked_displayOnUI ? (
                <AiFillHeart className='text-like' />
              ) : (
                <AiOutlineHeart />
              )}
            </span>
          </div>
          <span
            className={`text-xs ph_sm:text-sm ${
              isLiked_displayOnUI && 'text-like'
            }`}
          >
            {likes.length}
          </span>
        </div>
      )}

      {/* Share */}
      <div
        title='Share'
        onClick={handleClickShareButton}
        className='text-gray-500'
      >
        <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full pb-[2px] ph:pb-1 hover:bg-twitter-light hover:text-twitter flex items-center justify-end ph:justify-center flex-1'>
          <MdIosShare className='ph_sm:text-xl' />
        </div>
      </div>

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

export default memo(TweetActions);
