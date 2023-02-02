import { FC } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

interface TweetSubmitButtonProps {
  type: 'Tweet' | 'Reply';
  isDisabled: boolean;
  isLoading: boolean;
  handleSubmit: () => void;
}

const TweetSubmitButton: FC<TweetSubmitButtonProps> = ({
  type,
  isDisabled,
  isLoading,
  handleSubmit,
}) => {
  return (
    <button
      onClick={handleSubmit}
      disabled={isDisabled}
      className='font-medium text-sm ph_sm:text-base text-white bg-twitter hover:bg-twitter-dark rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-twitter'
    >
      {isLoading ? <PulseLoader color='#fff' /> : type}
    </button>
  );
};

export default TweetSubmitButton;
