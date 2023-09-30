import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsDot } from 'react-icons/bs';

import useAuth from '../../hooks/useAuth';
import { useAppSelector } from '../../hooks/redux-hooks';
import { useGetTweetByIdQuery } from './tweet.api-slice';
import { useGetUserBasicInfoByIdQuery } from '../user/user.api-slice';
import { useGetPostDate } from '../../hooks/date-hooks';

import { selectIsQuoteTweetPopupShown } from '../ui/ui.slice';

import ProfilePicture from '../../components/ProfilePicture';
import TweetItemMedia from '../../components/TweetItemMedia';
import DeletedTweetPlaceholder from '../../components/DeletedTweetPlaceholder';

interface QuoteRefTweetContainerProps {
  quoteRefTweetId: string | null;
}

const QuoteRefTweetContainer: FC<QuoteRefTweetContainerProps> = ({
  quoteRefTweetId,
}) => {
  const navigate = useNavigate();
  const auth = useAuth();

  const isQuoteTweetPopupShown = useAppSelector(selectIsQuoteTweetPopupShown);

  const { data: quoteRefTweet } = useGetTweetByIdQuery(
    { id: quoteRefTweetId || '' },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      skip: !quoteRefTweetId,
    }
  );
  const { data: authorInfo } = useGetUserBasicInfoByIdQuery(
    {
      userId: quoteRefTweet?.userId || undefined,
      loggedInUserId: auth.user?.id,
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const createdAt = useGetPostDate(quoteRefTweet?.creationDate);

  const handleGoToTweet = () => {
    if (!isQuoteTweetPopupShown) {
      navigate(`/${authorInfo?.username}/status/${quoteRefTweet?._id}`);
    }
  };

  const isMediaPresent =
    quoteRefTweet?.media &&
    quoteRefTweet?.media.length > 0 &&
    quoteRefTweet?.media[0] !== '';

  if (quoteRefTweet?.isDeleted) {
    return (
      <div className='-ml-4'>
        <DeletedTweetPlaceholder />
      </div>
    );
  }

  return (
    <div
      onClick={handleGoToTweet}
      className={`mt-2 p-3 border-[1px] border-gray-300 rounded-2xl ${
        !isQuoteTweetPopupShown && 'hover:bg-gray-200 hover:cursor-pointer'
      }`}
    >
      <div className='flex items-start space-x-2'>
        <ProfilePicture
          uri={authorInfo?.profilePicture}
          username={authorInfo?.username}
          disableGoToProfile={true}
          desktopSize={8}
        />

        <div className='flex flex-col ph:flex-row ph:items-center ph:space-x-2'>
          <div className='flex flex-col ph_xs:flex-row ph_xs:space-x-2'>
            <div className='font-bold text-[15px] truncate'>
              {authorInfo?.name}
            </div>
            <div className='text-gray-500 text-[15px] truncate'>
              @{authorInfo?.username}
            </div>
          </div>
          <BsDot className='hidden sm:block' />
          <div className='text-gray-500 text-[15px] truncate'>{createdAt}</div>
        </div>
      </div>

      <p>{quoteRefTweet?.caption}</p>

      {isMediaPresent && (
        <TweetItemMedia
          tweetId={quoteRefTweet._id}
          media={quoteRefTweet.media}
          twitterHandle={authorInfo?.username || ''}
          isOnClickDisabled={true}
        />
      )}
    </div>
  );
};

export default memo(QuoteRefTweetContainer);
