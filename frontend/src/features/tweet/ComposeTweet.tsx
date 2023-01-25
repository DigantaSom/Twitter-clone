import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';

import CreateTweet from './CreateTweet';
import TweetSubmitButton from './TweetSubmitButton';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { selectIsSubmitDisabled, toggleComposeTweet } from '../ui/ui.slice';

const ComposeTweet = () => {
  const isSubmitDisabled = useAppSelector(selectIsSubmitDisabled);
  const dispatch = useAppDispatch();

  return (
    <div className='w-screen h-screen ph:w-[90vw] sm:w-[600px] ph:h-[314px] bg-white p-4 ph:rounded-2xl'>
      <div className='h-[40vh] ph:h-full flex flex-col'>
        {/* header */}
        <div className='flex items-center justify-between mb-4'>
          <div className='w-8 h-8 p-1 -ml-1 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'>
            <IoCloseSharp
              className='hidden ph:block text-2xl text-gray-700'
              onClick={() => dispatch(toggleComposeTweet())}
            />
            <IoArrowBack
              className='ph:hidden text-2xl text-gray-700'
              onClick={() => dispatch(toggleComposeTweet())}
            />
          </div>
          <div className='ph:hidden'>
            <TweetSubmitButton
              isDisabled={isSubmitDisabled}
              isLoading={false} // TODO: dynamic
              handleSubmitTweet={() => {}}
            />
          </div>
        </div>

        {/* body */}
        <div className='flex-1'>
          <CreateTweet from='ComposeTweet' />
        </div>
      </div>
    </div>
  );
};

export default ComposeTweet;
