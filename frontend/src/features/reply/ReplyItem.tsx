import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { BsDot } from 'react-icons/bs';
import { FiMoreHorizontal } from 'react-icons/fi';

import { Reply } from './reply.types';
import useAuth from '../../hooks/useAuth';
import { useGetPostDate } from '../../hooks/date-hooks';

import ProfilePicture from '../../components/ProfilePicture';
import TweetItemMedia from '../../components/TweetItemMedia';
import TweetActions from '../tweet/TweetActions';

import constants from '../../constants';
import PostOptions from '../tweet/PostOptions';

interface ReplyItemProps {
  reply: Reply;
  tweetAuthorUsername: string;
}

const ReplyItem: FC<ReplyItemProps> = ({ reply, tweetAuthorUsername }) => {
  const navigate = useNavigate();
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);

  const auth = useAuth();

  const {
    _id: replyId,
    profilePicture,
    fullName,
    twitterHandle,
    text,
    media,
    creationDate,
  } = reply;

  const isMediaPresent = media.length > 0 && media[0] !== '';

  const createdAt = useGetPostDate(creationDate);

  const navigateToPost = () => {
    navigate(`/${twitterHandle}/status/${replyId}`);
  };

  const handleToggleOptions = () => {
    setShowOptionsPopup(prevState => !prevState);
  };

  // TODO:
  const handleDeleteReply = () => {};

  return (
    <div
      className='relative p-2 ph_sm:p-4 pb-3 hover:bg-gray-100 hover:cursor-pointer 
      border-b-[1px] border-gray-200'
    >
      <div
        className={`flex items-start ${constants.profilePicture_info_gap_style}`}
      >
        <ProfilePicture uri={profilePicture} />

        <div className='flex flex-col flex-1'>
          {/* Reply top */}
          <div className='flex items-center justify-between'>
            {/* Reply Info */}
            <div className='flex flex-col ph:flex-row ph:items-center ph:space-x-2 pb-1'>
              <h3 className='font-bold'>{fullName}</h3>
              <div className='flex items-center space-x-1'>
                <span className='text-gray-500'>@{twitterHandle}</span>
                <BsDot />
                <span className='text-gray-500'>{createdAt}</span>
              </div>
            </div>
            {/* Reply options button */}
            <div
              className={`w-8 h-8 rounded-full  hover:text-twitter hover:bg-twitter-light hover:cursor-pointer flex items-center justify-center 
                ${
                  showOptionsPopup
                    ? 'text-twitter bg-twitter-light'
                    : 'text-gray-500'
                }
              `}
              onClick={handleToggleOptions}
            >
              <FiMoreHorizontal className='text-lg ph:text-xl' />
            </div>
          </div>
          {/* 'Replying to' */}
          <div className='text-gray-500 w-fit'>
            Replying to{' '}
            <Link to={`/${tweetAuthorUsername}`} className='text-twitter'>
              @{tweetAuthorUsername}
            </Link>
          </div>
          {/* Reply Text */}
          <div className='pt-1'>{text}</div>
          {isMediaPresent && (
            <TweetItemMedia
              tweetId={replyId}
              media={media}
              twitterHandle={twitterHandle}
            />
          )}
          {/* Reply Actions */}
          {auth.user && (
            <TweetActions
              postType='Reply'
              currentUser={auth.user}
              tweet={reply}
              isMediaPresent={isMediaPresent}
              tweetCreationDate={createdAt}
            />
          )}
        </div>
      </div>

      {showOptionsPopup && auth.user && (
        <PostOptions
          from='TweetItem'
          currentUser={auth.user}
          authorUsername={twitterHandle}
          handleDeletePost={handleDeleteReply}
        />
      )}
    </div>
  );
};

export default ReplyItem;
