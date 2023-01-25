import { FC } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

interface TweetSubmitButtonProps {
  isDisabled: boolean;
  isLoading: boolean;
  handleSubmitTweet: () => void;
}

const TweetSubmitButton: FC<TweetSubmitButtonProps> = ({
  isDisabled,
  isLoading,
  handleSubmitTweet,
}) => {
  return (
    <button
      onClick={handleSubmitTweet}
      disabled={isDisabled}
      className='font-medium text-sm ph_sm:text-base text-white bg-twitter hover:bg-twitter-dark rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-twitter'
    >
      {isLoading ? <PulseLoader color='#fff' /> : 'Tweet'}
    </button>
  );
};

export default TweetSubmitButton;