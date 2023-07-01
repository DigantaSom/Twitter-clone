import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ClipLoader, PulseLoader } from 'react-spinners';

import { IoCloseSharp } from 'react-icons/io5';
import {
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  AiOutlineRetweet,
  AiOutlineHeart,
  AiFillHeart,
} from 'react-icons/ai';
import { TbMessageCircle2 } from 'react-icons/tb';
import { MdIosShare } from 'react-icons/md';

import useAuth from '../hooks/useAuth';
import { useAppDispatch } from '../hooks/redux-hooks';

import {
  useGetTweetByIdQuery,
  useLikeTweetMutation,
  useBookmarkTweetMutation,
} from '../features/tweet/tweet.api-slice';
import { setCreateReplyPopupData } from '../features/reply/reply.slice';
import { toggleCreateReplyPopup } from '../features/ui/ui.slice';
import { removeToast, setToast } from '../features/toast/toast.slice';

import TweetPage from './TweetPage';
import ShareTweetPopupContents from '../features/tweet/ShareTweetPopupContents';

import K from '../constants';

const TweetPhotoPage = () => {
  const { tweetId: tweetIdFromParams } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAuth();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLiked_displayOnUI, setIsLiked_displayOnUI] = useState(false);
  const [numberOfReplies_displayOnUI, setNumberOfReplies_displayOnUI] =
    useState(0);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isBookmarked_displayOnUI, setIsBookmarked_displayOnUI] =
    useState(false);

  const {
    data: tweet,
    isLoading,
    isError,
    error,
  } = useGetTweetByIdQuery(
    { id: tweetIdFromParams! },
    {
      pollingInterval: 10000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const [likeTweet, { isLoading: isLikeTweetLoading }] = useLikeTweetMutation();

  const [bookmarkTweet, { isLoading: isBookmarkTweetLoading }] =
    useBookmarkTweetMutation();

  useEffect(() => {
    if (tweet) {
      setNumberOfReplies_displayOnUI(tweet.numberOfReplies);
    }
  }, [tweet]);

  useEffect(() => {
    // if the tweet is liked by the current logged-in user
    if (tweet?.likes.some(like => like.userId === auth.user?.id)) {
      setIsLiked_displayOnUI(true);
    } else {
      setIsLiked_displayOnUI(false);
    }
  }, [tweet?.likes, auth.user]);

  useEffect(() => {
    // if the tweet is bookmarked by the current logged-in user
    if (tweet?.bookmarks.some(bookmark => bookmark.userId === auth.user?.id)) {
      setIsBookmarked_displayOnUI(true);
    } else {
      setIsBookmarked_displayOnUI(false);
    }
  }, [tweet?.bookmarks, auth.user]);

  if (!tweet) return null;

  const {
    _id,
    degree,
    media,
    profilePicture,
    fullName,
    twitterHandle,
    creationDate,
  } = tweet;

  const handleClickClose = () => {
    navigate(-1);
  };

  const handleToggleFullScreenMedia = () => {
    setIsFullScreen(prevState => !prevState);
  };

  const handleCloseSharePopup = () => {
    setShowSharePopup(false);
  };

  const handleClickReplyButton = () => {
    dispatch(
      setCreateReplyPopupData({
        currentUser: auth.user,
        parentTweetId: _id,
        parentTweetDegree: degree,
        replyingTo: {
          profilePicture,
          fullName,
          username: twitterHandle,
        },
        caption: tweet.caption,
        isMediaPresent: true,
        creationDate,
      })
    );
    dispatch(toggleCreateReplyPopup(true));
    setNumberOfReplies_displayOnUI(prevState => prevState + 1);
  };

  const handleClickRetweetButton = () => {};

  const handleClickLikeButton = async () => {
    if (!isLoading || !isLikeTweetLoading) {
      try {
        const res = await likeTweet({ tweetId: _id }).unwrap();

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

  const handleClickShareButton = () => {
    setShowSharePopup(prevState => !prevState);
  };

  const handleBookmarkTweet = async () => {
    if (!isLoading || !isBookmarkTweetLoading) {
      try {
        const res = await bookmarkTweet({ tweetId: _id }).unwrap();

        if ((res as any)?.isError) {
          alert((res as any)?.message);
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
          }, K.toastDuration);
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
    setShowSharePopup(false);
  };

  let content;

  if (isLoading) {
    content = <PulseLoader color='#1D9BF0' />; // same as twitter-default color
  } else if (isError) {
    console.log('Error loading replies', error);
    content = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || 'Error loading Tweet.'}
      </div>
    );
  } else {
    content = (
      <div className='flex justify-between'>
        <div
          className={`${
            !isFullScreen ? 'w-full lg:w-[60%] xl:w-[70%]' : 'w-full'
          } fixed top-0 left-0 h-full bg-black flex flex-col`}
        >
          <div className='flex-1 text-white relative'>
            <div className='absolute top-0 left-0 w-full h-full'>
              {/* Close button */}
              <div
                onClick={handleClickClose}
                className='absolute top-3 ph_sm:top-6 left-3 ph_sm:left-6 z-10 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:cursor-pointer'
              >
                <IoCloseSharp className='text-lg' />
              </div>

              {/* Toggle fullscreen button */}
              <div
                onClick={handleToggleFullScreenMedia}
                className='absolute top-3 ph_sm:top-6 right-3 ph_sm:right-6 z-10 w-8 h-8 bg-black rounded-full hidden lg:flex items-center justify-center hover:cursor-pointer'
              >
                {!isFullScreen ? (
                  <AiOutlineDoubleRight className='text-lg' />
                ) : (
                  <AiOutlineDoubleLeft className='text-lg' />
                )}
              </div>
              {/* Media */}
              <div className='w-full h-full flex items-center justify-center'>
                <img
                  src={media[0]}
                  alt='Post'
                  className='max-w-full max-h-full'
                />
              </div>
            </div>
          </div>

          {/* Tweet Actions */}
          <div className='h-14 text-white flex items-center justify-center'>
            <div className='w-[90%] ph:w-[80%] md:w-[65%] xl:w-1/2 h-full flex items-center justify-between relative'>
              {/* Reply button */}
              <div
                title='Reply'
                onClick={handleClickReplyButton}
                className='flex items-center text-white hover:cursor-pointer group'
              >
                <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-gray-800 mr-1 ph_sm:mr-2'>
                  <TbMessageCircle2 className='ph_sm:text-xl' />
                </div>
                <span className='text-xs ph_sm:text-sm'>
                  {numberOfReplies_displayOnUI}
                </span>
              </div>
              {/* Retweet button */}
              <div
                title='Retweet'
                onClick={handleClickRetweetButton}
                className='flex items-center text-white hover:cursor-pointer group'
              >
                <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-gray-800 mr-1 ph_sm:mr-2'>
                  <AiOutlineRetweet className='ph_sm:text-xl' />
                </div>
                <span className='text-xs ph_sm:text-sm'>
                  {tweet.retweets.length}
                </span>
              </div>
              {/* Like button */}
              {isLikeTweetLoading ? (
                <ClipLoader
                  color='#F91880' // same as 'like' color
                  size={25}
                />
              ) : (
                <div
                  title={isLiked_displayOnUI ? 'Unlike' : 'Like'}
                  onClick={handleClickLikeButton}
                  className='flex items-center text-white hover:cursor-pointer group'
                >
                  <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-gray-800 mr-1 ph_sm:mr-2'>
                    {isLiked_displayOnUI ? (
                      <AiFillHeart className='text-white ph_sm:text-xl' />
                    ) : (
                      <AiOutlineHeart className='ph_sm:text-xl' />
                    )}
                  </div>
                  <span className='text-xs ph_sm:text-sm'>
                    {tweet.likes.length}
                  </span>
                </div>
              )}
              {/* Share button */}
              <div
                title='Share'
                onClick={handleClickShareButton}
                className='flex items-center text-white hover:cursor-pointer group'
              >
                <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-gray-800 ph_sm:mr-2'>
                  <MdIosShare className='ph_sm:text-xl' />
                </div>
              </div>

              {showSharePopup && (
                <div className='absolute z-20 bottom-14 right-0 text-black'>
                  <ShareTweetPopupContents
                    tweet={{ _id, twitterHandle }}
                    isBookmarked_displayOnUI={isBookmarked_displayOnUI}
                    handleBookmarkTweet={handleBookmarkTweet}
                    handleClosePopup={handleCloseSharePopup}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {!isFullScreen && (
          <div className='hidden lg:block lg:w-[40%] lg:ml-[60%] xl:w-[30%] xl:ml-[70%] overflow-y-scroll'>
            <TweetPage from='TweetPhotoPage' isHeaderNeeded={false} />
          </div>
        )}
      </div>
    );
  }

  return <>{content}</>;
};

export default TweetPhotoPage;
