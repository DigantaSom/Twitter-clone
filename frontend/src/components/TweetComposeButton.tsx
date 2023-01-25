import { FC } from 'react';
import { FiFeather } from 'react-icons/fi';

import { useAppDispatch } from '../hooks/redux-hooks';
import { toggleComposeTweet } from '../features/ui/ui.slice';

interface TweetComposeButtonProps {
  from: 'App' | 'Navigation';
}

const TweetComposeButton: FC<TweetComposeButtonProps> = ({ from }) => {
  const dispatch = useAppDispatch();

  let button_dyanmicStyles = '';

  if (from === 'Navigation') {
    button_dyanmicStyles = 'w-10 h-10';
  } else if (from === 'App') {
    button_dyanmicStyles = 'w-12 h-12';
  }

  return (
    <button
      onClick={() => dispatch(toggleComposeTweet())}
      className={`text-white bg-twitter hover:bg-twitter-dark p-2 xl:p-3 
            ${button_dyanmicStyles} xl:w-full rounded-full text-base xl:text-lg font-semibold flex items-center justify-center`}
    >
      <span className='rounded-full xl:hidden'>
        <FiFeather />
      </span>
      {from === 'Navigation' && <span className='hidden xl:block'>Tweet</span>}
    </button>
  );
};

export default TweetComposeButton;
