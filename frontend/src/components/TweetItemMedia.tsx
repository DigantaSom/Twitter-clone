import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface TweetItemMediaProps {
  tweetId: string;
  twitterHandle: string;
  media: string[];
}

const TweetItemMedia: FC<TweetItemMediaProps> = ({
  tweetId,
  twitterHandle,
  media,
}) => {
  const navigate = useNavigate();

  const navigateToPostFullScreen = () => {
    // TODO: change the photoIndex from '1' to dynamic
    navigate(`/${twitterHandle}/status/${tweetId}/photo/1`);
  };

  return (
    <div onClick={navigateToPostFullScreen} className='pt-3 pb-2'>
      <img src={media[0]} alt='Post' className='w-full h-full rounded-xl' />
    </div>
  );
};

export default TweetItemMedia;
