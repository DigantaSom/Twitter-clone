import { useRef, useState, useEffect, FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { PulseLoader, ClipLoader } from 'react-spinners';

import { BsDot, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdIosShare } from 'react-icons/md';
import { TbMessageCircle2 } from 'react-icons/tb';

import { useAppDispatch } from '../hooks/redux-hooks';
import {
  useGetTweetByIdQuery,
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useBookmarkTweetMutation,
} from '../features/tweet/tweet.api-slice';
import { removeToast, setToast } from '../features/toast/toast.slice';

import useAuth from '../hooks/useAuth';
import { useGetPostDate, useGetPostTime } from '../hooks/date-hooks';

import {
  toggleCreateReplyPopup,
  openLikedByPopup,
} from '../features/ui/ui.slice';
import { setCreateReplyPopupData } from '../features/reply/reply.slice';

import TweetPageHeader from '../components/TweetPageHeader';
import PostOptions from '../features/tweet/PostOptions';
import PostInfo from '../components/PostInfo';
import CreateReply from '../features/reply/CreateReply';
import ReplyList from '../features/reply/ReplyList';
import DeletedTweetPlaceholder from '../components/DeletedTweetPlaceholder';
import ShareTweetPopupContents from '../features/tweet/ShareTweetPopupContents';

import K from '../constants';

interface TweetPageProps {
  from: 'App' | 'TweetPhotoPage';
  isHeaderNeeded: boolean;
}

const TweetPage: FC<TweetPageProps> = ({ from, isHeaderNeeded }) => {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const topMostDivRef = useRef<HTMLDivElement>(null);
  const [isLiked_displayOnUI, setIsLiked_displayOnUI] = useState(false);
  const [isBookmarked_displayOnUI, setIsBookmarked_displayOnUI] =
    useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const auth = useAuth();

  const {
    data: tweet,
    isLoading,
    isError,
    error,
  } = useGetTweetByIdQuery({ id: tweetId! });

  const [deleteTweet, { isLoading: isDeleteTweetLoading }] =
    useDeleteTweetMutation();

  const [likeTweet, { isLoading: isLikeTweetLoading }] = useLikeTweetMutation();

  const [bookmarkTweet, { isLoading: isBookmarkTweetLoading }] =
    useBookmarkTweetMutation();

  const createdAt_time = useGetPostTime(tweet?.creationDate).toUpperCase();
  const createdAt_date = useGetPostDate(tweet?.creationDate);

  // scroll to top on component mount
  useEffect(() => {
    topMostDivRef.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    // if the post is liked by the current logged in user
    if (auth && tweet?.likes.some(like => like.userId === auth.user?.id)) {
      setIsLiked_displayOnUI(true);
    } else {
      setIsLiked_displayOnUI(false);
    }
  }, [auth, tweet?.likes]);

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
    profilePicture,
    fullName,
    twitterHandle,
    caption,
    media,
    retweets,
    likes,
    isDeleted,
  } = tweet;

  const navigateToPostFullScreen = () => {
    if (isDeleted) return;
    // TODO: change the photoIndex from '1' to dynamic
    navigate(`/${twitterHandle}/status/${_id}/photo/1`);
  };

  const handleToggleOptions = () => {
    if (isDeleted) return;
    setShowOptionsPopup(prevState => !prevState);
  };

  const handleClickReplyButton = () => {
    if (isDeleted || !auth?.user) return;

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
        caption,
        isMediaPresent: media.length > 0 && media[0] !== '',
        creationDate: createdAt_date,
      })
    );
    dispatch(toggleCreateReplyPopup(true));
  };

  const handleDeleteTweet = async () => {
    if (isDeleted || isDeleteTweetLoading) return;

    try {
      const res = await deleteTweet({
        tweetId: _id,
        parentTweetId: null,
      }).unwrap();

      if (res?.isError) {
        alert(res?.message);
        return;
      }

      setShowOptionsPopup(false);

      if (from === 'TweetPhotoPage') {
        navigate(-1);
      }
    } catch (err: any) {
      console.log(err);
      let errMsg = '';

      if (!err.status) {
        errMsg = 'No Server Response';
      } else {
        errMsg = err.data?.message;
      }
      setShowOptionsPopup(false);
      alert(errMsg);
    }
  };

  const handleLikeTweet = async () => {
    if (isDeleted || isLikeTweetLoading) return;

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
  };

  const handleBookmarkTweet = async () => {
    if (!isLoading || !isBookmarkTweetLoading) {
      try {
        const res = await bookmarkTweet({ tweetId: _id }).unwrap();

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
      <div className='relative pb-60'>
        {/* Tweet-options popup */}
        {showOptionsPopup && auth.user && (
          <PostOptions
            from='TweetPage'
            currentUser={auth.user}
            authorUsername={twitterHandle}
            handleDeletePost={handleDeleteTweet}
          />
        )}

        <div ref={topMostDivRef}></div>

        {isHeaderNeeded && <TweetPageHeader />}

        <main className='px-2 ph_sm:px-4 pt-3'>
          {isDeleted ? (
            <DeletedTweetPlaceholder />
          ) : (
            <>
              {/* Tweet Info */}
              <PostInfo
                username={auth.user?.twitterHandle}
                profilePicture={profilePicture}
                fullName={fullName}
                twitterHandle={twitterHandle}
                showOptionsPopup={showOptionsPopup}
                handleToggleOptions={handleToggleOptions}
              />

              {/* Tweet Caption */}
              <div className='mt-1 ph_sm:mt-2 sm:mt-3 text-xl sm:text-2xl text-gray-700'>
                {caption}
              </div>

              {/* Tweet Media(s) */}
              {media.length > 0 && media[0] !== '' && (
                <div
                  onClick={navigateToPostFullScreen}
                  className='pt-3 pb-1 hover:cursor-pointer'
                >
                  <img
                    src={media[0]}
                    alt='Post'
                    className='w-full h-full rounded-xl'
                  />
                </div>
              )}
            </>
          )}

          {/* Tweet Date and Time */}
          <div className='py-3 flex items-center text-gray-500 text-[15px] sm:text-base'>
            <span>{createdAt_time}</span>
            <BsDot />
            <span>{createdAt_date}</span>
          </div>

          <hr />

          {/* Tweet 'numbers' */}
          <div className='py-3 flex items-center justify-between ph_sm:justify-start space-x-5 text-gray-600 text-[13px] ph_xs:text-[15px]'>
            <div className='flex items-center hover:border-b-[1px] hover:border-gray-600 hover:-mt-1 hover:cursor-pointer'>
              <span className='font-bold'>{retweets.length}</span>
              <span className='pl-1'>
                {retweets.length === 1 ? 'Retweet' : 'Retweets'}
              </span>
            </div>
            <div className='flex items-center hover:border-b-[1px] hover:border-gray-600 hover:-mt-1 hover:cursor-pointer'>
              {/* TODO: dynamic when we implement this feature */}
              <span className='font-bold'>0</span>
              <span className='pl-1'>Quote Tweets</span>
            </div>
            <div
              onClick={() => dispatch(openLikedByPopup({ tweetId: _id }))}
              className='flex items-center hover:border-b-[1px] hover:border-gray-600 hover:-mt-1 hover:cursor-pointer'
            >
              <span className='font-bold'>{likes.length}</span>
              <span className='pl-1'>
                {likes.length === 1 ? 'Like' : 'Likes'}
              </span>
            </div>
          </div>

          <hr />

          {/* Tweet Actions */}
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

                {/* Retweet */}
                <div
                  title='Retweet'
                  className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:text-twitter hover:bg-twitter-light ph_sm:mr-2'
                >
                  <AiOutlineRetweet className='ph_sm:text-xl' />
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
                  tweet={{ _id, twitterHandle }}
                  isBookmarked_displayOnUI={isBookmarked_displayOnUI}
                  handleBookmarkTweet={handleClickBookmarkFromSharePopup}
                  handleClosePopup={handleCloseSharePopup}
                />
              </div>
            )}
          </div>

          <hr />

          <CreateReply
            parentTweetId={_id}
            parentTweetDegree={degree}
            profilePicture={profilePicture}
            tweetAuthorUsername={twitterHandle}
          />
        </main>

        <hr />

        <ReplyList parentTweetId={_id} />
      </div>
    );
  }

  return <>{content}</>;
};

export default TweetPage;
