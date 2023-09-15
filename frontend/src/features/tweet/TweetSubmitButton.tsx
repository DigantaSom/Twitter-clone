import { FC } from 'react';
import { PulseLoader } from 'react-spinners';

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
      className='min-w-[80px] font-medium text-sm ph_sm:text-base text-white bg-twitter hover:bg-twitter-dark rounded-full px-2 ph:px-4 py-1 ph:py-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-twitter'
    >
      {isLoading ? <PulseLoader color='#fff' size={8} /> : type}
    </button>
  );
};

export default TweetSubmitButton;
