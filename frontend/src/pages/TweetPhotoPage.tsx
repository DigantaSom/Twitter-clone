import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ClipLoader } from 'react-spinners';

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
  useGetRetweetedPostIdQuery,
} from '../features/tweet/tweet.api-slice';
import { useGetUserBasicInfoByIdQuery } from '../features/user/user.api-slice';

import { setCreateReplyPopupData } from '../features/reply/reply.slice';
import { toggleCreateReplyPopup } from '../features/ui/ui.slice';
import { removeToast, setToast } from '../features/toast/toast.slice';

import CustomLoadingSpinner from '../components/CustomLoadingSpinner';
import TweetPage from './TweetPage';
import QuoteRetweetPopup from '../features/tweet/QuoteRetweetPopup';
import ShareTweetPopupContents from '../features/tweet/ShareTweetPopupContents';

import constants from '../constants';

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
  const [isRetweeted_displayOnUI, setIsRetweeted_displayOnUI] = useState(false);
  const [showQuoteRetweetPopup, setShowQuoteRetweetPopup] = useState(false);

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

  const { data: authorInfo } = useGetUserBasicInfoByIdQuery(
    {
      userId: tweet?.userId || '',
      loggedInUserId: auth.user?.id,
    },
    { skip: !tweet }
  );

  const { data: retweetedPostId_onlyFor_retweetRefTweetItem } =
    useGetRetweetedPostIdQuery(
      {
        refTweetId: tweet?._id || '',
        loggedInUsername: auth.user?.twitterHandle,
      },
      { refetchOnMountOrArgChange: true }
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
    if (auth && tweet?.likes.some(like => like.userId === auth.user?.id)) {
      setIsLiked_displayOnUI(true);
    } else {
      setIsLiked_displayOnUI(false);
    }
  }, [auth, tweet?.likes]);

  useEffect(() => {
    // if the tweet is bookmarked by the current logged-in user
    if (
      auth &&
      tweet?.bookmarks.some(bookmark => bookmark.userId === auth.user?.id)
    ) {
      setIsBookmarked_displayOnUI(true);
    } else {
      setIsBookmarked_displayOnUI(false);
    }
  }, [auth, tweet?.bookmarks]);

  useEffect(() => {
    // if the post is retweeted by the current logged in user
    if (
      auth &&
      tweet?.retweets.some(retweet => retweet.userId === auth.user?.id)
    ) {
      setIsRetweeted_displayOnUI(true);
    } else {
      setIsRetweeted_displayOnUI(false);
    }
  }, [auth, tweet?.retweets]);

  if (!tweet) return null;

  const { _id, degree, media, creationDate } = tweet;

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
          profilePicture:
            authorInfo?.profilePicture || constants.placeholder_profilePicture,
          fullName: authorInfo?.name || '',
          username: authorInfo?.username || '',
        },
        caption: tweet.caption,
        isMediaPresent: true,
        creationDate,
      })
    );
    dispatch(toggleCreateReplyPopup(true));
    setNumberOfReplies_displayOnUI(prevState => prevState + 1);
  };

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
    setShowSharePopup(false);
  };

  const toggleQuoteRetweetPopup = () => {
    setShowQuoteRetweetPopup(prevState => !prevState);
  };

  let content;

  if (isLoading) {
    content = <CustomLoadingSpinner marginTopClass='mt-[25vh]' />;
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
          {auth.user && (
            <div className='h-14 text-white flex items-center justify-center'>
              <div className='w-[90%] ph:w-[80%] md:w-[65%] xl:w-1/2 h-full flex items-center justify-between relative'>
                {/* Reply */}
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

                {/* Retweet or Quote */}
                <div className='relative' onClick={toggleQuoteRetweetPopup}>
                  <div
                    title='Retweet'
                    className='flex items-center text-white hover:cursor-pointer group'
                  >
                    <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center group-hover:bg-gray-800 mr-1 ph_sm:mr-2'>
                      <AiOutlineRetweet
                        className={`ph_sm:text-xl ${
                          isRetweeted_displayOnUI &&
                          'text-emerald-500 text-bold'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs ph_sm:text-sm ${
                        isRetweeted_displayOnUI && 'text-emerald-500 text-bold'
                      }`}
                    >
                      {tweet.retweets.length}
                    </span>
                  </div>

                  {showQuoteRetweetPopup && (
                    <div className='absolute z-40 bottom-10 w-[150px]'>
                      <QuoteRetweetPopup
                        refTweetId={_id}
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
                  <ClipLoader color={constants.colors.like_default} size={25} />
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

                {/* Share */}
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
                      tweet={{ _id, username: authorInfo?.username || '' }}
                      isBookmarked_displayOnUI={isBookmarked_displayOnUI}
                      handleBookmarkTweet={handleBookmarkTweet}
                      handleClosePopup={handleCloseSharePopup}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
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
