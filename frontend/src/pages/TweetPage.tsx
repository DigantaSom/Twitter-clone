import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

import { BsDot } from 'react-icons/bs';
import { AiOutlineRetweet, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdIosShare } from 'react-icons/md';
import { TbMessageCircle2 } from 'react-icons/tb';

import { useAppDispatch } from '../hooks/redux-hooks';
import useAuth from '../hooks/useAuth';
import {
  useGetTweetsQuery,
  useDeleteTweetMutation,
  useLikeTweetMutation,
} from '../features/tweet/tweet.api-slice';
import { useGetPostDate, useGetPostTime } from '../hooks/date-hooks';

import { toggleCreateReplyPopup } from '../features/ui/ui.slice';
import { setCreateReplyPopupData } from '../features/reply/reply.slice';

import TweetPageHeader from '../components/TweetPageHeader';
import PostOptions from '../features/tweet/PostOptions';
import PostInfo from '../components/PostInfo';
import CreateReply from '../features/reply/CreateReply';
import ReplyList from '../features/reply/ReplyList';

const TweetPage = () => {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const topMostDivRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);

  const auth = useAuth();

  const { tweet } = useGetTweetsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      tweet: data?.entities[tweetId!],
    }),
  });

  const [deleteTweet, { isLoading: isDeleteTweetLoading }] =
    useDeleteTweetMutation();

  const [likeTweet, { isLoading: isLikeTweetLoading }] = useLikeTweetMutation();

  const createdAt_time = useGetPostTime(tweet?.creationDate).toUpperCase();
  const createdAt_date = useGetPostDate(tweet?.creationDate);

  // scroll to top on component mount
  useEffect(() => {
    topMostDivRef.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    // if the post is liked by the current logged in user
    if (auth && tweet?.likes.some(like => like.userId === auth.user?.id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [auth, tweet?.likes]);

  if (!tweet) return null;

  const {
    _id,
    profilePicture,
    fullName,
    twitterHandle,
    caption,
    media,
    retweets,
    likes,
    replies,
  } = tweet;

  const navigateToPostFullScreen = () => {
    // TODO: change the photoIndex from '1' to dynamic
    navigate(`/${twitterHandle}/status/${_id}/photo/1`);
  };

  const handleToggleOptions = () => {
    setShowOptionsPopup(prevState => !prevState);
  };

  const handleClickReplyButton = () => {
    if (auth.user) {
      dispatch(
        setCreateReplyPopupData({
          currentUser: auth.user,
          tweetId: _id,
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
    }
  };

  const handleDeleteTweet = async () => {
    if (isDeleteTweetLoading) return;

    try {
      const res = await deleteTweet({ tweetId: _id }).unwrap();

      if (res?.isError) {
        alert(res?.message);
        return;
      }
      setShowOptionsPopup(false);
      navigate('/');
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
    if (isLikeTweetLoading) return;

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

  return (
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

      <TweetPageHeader />

      <main className='px-2 ph_sm:px-4 pt-3'>
        {/* Tweet Info */}
        <PostInfo
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
          <div className='flex items-center hover:border-b-[1px] hover:border-gray-600 hover:-mt-1 hover:cursor-pointer'>
            <span className='font-bold'>{likes.length}</span>
            <span className='pl-1'>
              {likes.length === 1 ? 'Like' : 'Likes'}
            </span>
          </div>
        </div>

        <hr />

        {/* Tweet Actions */}
        <div className='py-1 flex items-center justify-around'>
          <div
            onClick={handleClickReplyButton}
            className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:text-twitter hover:bg-twitter-light ph_sm:mr-2'
          >
            <TbMessageCircle2 className='ph_sm:text-xl' />
          </div>

          <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:text-twitter hover:bg-twitter-light ph_sm:mr-2'>
            <AiOutlineRetweet className='ph_sm:text-xl' />
          </div>

          {isLikeTweetLoading ? (
            <ClipLoader
              color='#F91880' // same as 'like' color
              size={25}
            />
          ) : (
            <div
              onClick={handleLikeTweet}
              className='flex items-center hover:text-like'
            >
              <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:bg-like-light ph_sm:mr-2'>
                <span className='ph_sm:text-xl'>
                  {isLiked ? (
                    <AiFillHeart className='text-like' />
                  ) : (
                    <AiOutlineHeart />
                  )}
                </span>
              </div>
            </div>
          )}

          <div className='w-6 h-6 ph_sm:w-8 ph_sm:h-8 ph:w-10 ph:h-10 rounded-full flex items-center justify-center hover:cursor-pointer hover:text-twitter hover:bg-twitter-light ph_sm:mr-2'>
            <MdIosShare className='ph_sm:text-xl' />
          </div>
        </div>

        <hr />

        <CreateReply
          tweetId={_id}
          profilePicture={profilePicture}
          tweetAuthorUsername={twitterHandle}
        />
      </main>

      <hr />

      <ReplyList replies={replies} tweetAuthorUsername={twitterHandle} />
    </div>
  );
};

export default TweetPage;
