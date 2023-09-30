import { useRef, useState, useEffect, FC } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { AiOutlineRetweet } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';

import { useAppDispatch } from '../hooks/redux-hooks';
import {
  useGetTweetByIdQuery,
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useBookmarkTweetMutation,
  useGetRepliesQuery,
} from '../features/tweet/tweet.api-slice';
import { useGetUserBasicInfoByIdQuery } from '../features/user/user.api-slice';
import useAuth from '../hooks/useAuth';
import { useGetPostDate, useGetPostTime } from '../hooks/date-hooks';

import {
  toggleCreateReplyPopup,
  openLikedByPopup,
  openRetweetedByPopup,
} from '../features/ui/ui.slice';
import { removeToast, setToast } from '../features/toast/toast.slice';
import { setCreateReplyPopupData } from '../features/reply/reply.slice';

import CustomLoadingSpinner from '../components/CustomLoadingSpinner';
import Header from '../components/Header';
import PostOptions from '../features/tweet/PostOptions';
import TweetPageStats from '../features/tweet/TweetPageStats';
import TweetPageActions from '../features/tweet/TweetPageActions';
import TweetAuthorInfo from '../components/TweetAuthorInfo';
import CreateReply from '../features/reply/CreateReply';
import DeletedTweetPlaceholder from '../components/DeletedTweetPlaceholder';
import TweetList from '../features/tweet/TweetList';
import QuoteRefTweetContainer from '../features/tweet/QuoteRefTweetContainer';

import constants from '../constants';

interface TweetPageProps {
  from: 'App' | 'TweetPhotoPage';
  isHeaderNeeded: boolean;
}

const TweetPage: FC<TweetPageProps> = ({ from, isHeaderNeeded }) => {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const topMostDivRef = useRef<HTMLDivElement>(null);

  const [isRetweeted_displayOnUI, setIsRetweeted_displayOnUI] = useState(false);
  const [isLiked_displayOnUI, setIsLiked_displayOnUI] = useState(false);
  const [isBookmarked_displayOnUI, setIsBookmarked_displayOnUI] =
    useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const {
    data: tweet,
    isLoading,
    isError,
    error,
  } = useGetTweetByIdQuery({ id: tweetId! });

  const { data: authorInfo } = useGetUserBasicInfoByIdQuery(
    {
      userId: tweet?.userId || '',
      loggedInUserId: auth.user?.id,
    },
    { skip: !tweet }
  );

  const [deleteTweet, { isLoading: isDeleteTweetLoading }] =
    useDeleteTweetMutation();

  const [likeTweet, { isLoading: isLikeTweetLoading }] = useLikeTweetMutation();

  const [bookmarkTweet, { isLoading: isBookmarkTweetLoading }] =
    useBookmarkTweetMutation();

  const {
    data: replies,
    isLoading: isRepliesLoading,
    isSuccess: isRepliesSuccess,
    isError: isRepliesError,
    error: repliesError,
  } = useGetRepliesQuery(
    { parentTweetId: tweet?._id },
    { pollingInterval: 15000 }
  );

  const createdAt_time = useGetPostTime(tweet?.creationDate).toUpperCase();
  const createdAt_date = useGetPostDate(tweet?.creationDate);

  // scroll to top on component mount
  useEffect(() => {
    topMostDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
    caption,
    media,
    isDeleted,
    retweets,
    quotes,
    likes,
    bookmarks,
    quoteRefTweetId,
    userId,
  } = tweet;

  const navigateToPostFullScreen = () => {
    if (isDeleted) return;
    // TODO: change the photoIndex from '1' to dynamic
    navigate(`/${authorInfo?.username}/status/${_id}/photo/1`);
  };

  const handleToggleOptions = () => {
    if (!auth.user || isDeleted) return;
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
          profilePicture:
            authorInfo?.profilePicture || constants.placeholder_profilePicture,
          fullName: authorInfo?.name || '',
          username: authorInfo?.username || '',
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

  const handleOpenRetweetedByPopup = () => {
    dispatch(openRetweetedByPopup({ tweetId: _id }));
  };

  const handleOpenLikedByPopup = () => {
    dispatch(openLikedByPopup({ tweetId: _id }));
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
      <div className='relative pb-60'>
        {/* Tweet-options popup */}
        {showOptionsPopup && auth.user && (
          <PostOptions
            from='TweetPage'
            loggedInUser={auth.user}
            author={{
              id: tweet.userId || '',
              username: authorInfo?.username || '',
            }}
            isFollowedByLoggedInUser={
              authorInfo?.isFollowedByLoggedInUser || false
            }
            handleDeletePost={handleDeleteTweet}
            hidePostOptions={() => setShowOptionsPopup(prev => !prev)}
          />
        )}

        <div ref={topMostDivRef}></div>

        {isHeaderNeeded && <Header parentComponent='TweetPage' />}

        <main className='px-2 ph_sm:px-4 mt-3'>
          {isDeleted ? (
            <DeletedTweetPlaceholder />
          ) : (
            <>
              {/* If the currently logged-in user has retweeted this tweet */}
              {isRetweeted_displayOnUI && (
                <Link
                  to={'/' + auth.user?.twitterHandle}
                  className='-mt-3 mb-3 flex items-center space-x-2 hover:underline'
                >
                  <AiOutlineRetweet />
                  <div className='text-sm font-semibold'>You Retweeted</div>
                </Link>
              )}

              {/* Tweet Author Info */}
              <TweetAuthorInfo
                loggedInUserId={auth.user?.id}
                userId={userId!}
                username={authorInfo?.username || ''}
                profilePicture={
                  authorInfo?.profilePicture ||
                  constants.placeholder_profilePicture
                }
                fullName={authorInfo?.name || ''}
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

              {quoteRefTweetId && (
                <QuoteRefTweetContainer quoteRefTweetId={quoteRefTweetId} />
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

          <TweetPageStats
            tweetId={_id}
            authorUsername={authorInfo?.username || ''}
            numberOfRetweets={retweets.length}
            numberOfQuotes={quotes.length}
            numberOfLikes={likes.length}
            numberOfBookmarks={bookmarks.length}
            handleOpenRetweetedByPopup={handleOpenRetweetedByPopup}
            handleOpenLikedByPopup={handleOpenLikedByPopup}
          />

          {auth.user && (
            <>
              <TweetPageActions
                tweet={{ _id, username: authorInfo?.username || '', isDeleted }}
                isRetweeted_displayOnUI={isRetweeted_displayOnUI}
                isLikeTweetLoading={isLikeTweetLoading}
                isLiked_displayOnUI={isLiked_displayOnUI}
                isBookmarkTweetLoading={isBookmarkTweetLoading}
                isBookmarked_displayOnUI={isBookmarked_displayOnUI}
                showSharePopup={showSharePopup}
                handleClickReplyButton={handleClickReplyButton}
                handleLikeTweet={handleLikeTweet}
                handleBookmarkTweet={handleBookmarkTweet}
                handleClickShareButton={handleClickShareButton}
                handleClickBookmarkFromSharePopup={
                  handleClickBookmarkFromSharePopup
                }
                handleCloseSharePopup={handleCloseSharePopup}
              />

              <hr />

              <CreateReply
                parentTweetId={_id}
                parentTweetDegree={degree}
                tweetAuthorUsername={authorInfo?.username || ''}
              />
            </>
          )}
        </main>

        {auth.user && <hr />}

        {/* Reply list of this particular tweet */}
        <TweetList
          showParentTweet={false}
          tweets={replies}
          isLoading={isRepliesLoading}
          isSuccess={isRepliesSuccess}
          isError={isRepliesError}
          error={repliesError}
        />
      </div>
    );
  }

  return <>{content}</>;
};

export default TweetPage;
