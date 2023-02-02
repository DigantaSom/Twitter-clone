import { useState } from 'react';
import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { useAddNewTweetMutation } from './tweet.api-slice';

import { selectIsSubmitDisabled, toggleComposeTweet } from '../ui/ui.slice';
import { clearNewTweetData, selectNewTweetData } from './tweet.slice';

import CreateTweet from './CreateTweet';
import TweetSubmitButton from './TweetSubmitButton';

const ComposeTweet = () => {
  const isSubmitDisabled = useAppSelector(selectIsSubmitDisabled);
  const newTweetData = useAppSelector(selectNewTweetData);
  const dispatch = useAppDispatch();
  const [isMediaSet, setIsMediaSet] = useState(false);

  const [addNewTweet, { isLoading }] = useAddNewTweetMutation();

  const handleSubmitTweet = async () => {
    try {
      const res = await addNewTweet(newTweetData).unwrap();

      if (res?.isError) {
        alert(res?.message);
        return;
      }
      dispatch(clearNewTweetData());
      dispatch(toggleComposeTweet());
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
    <div className='w-screen ph:w-[90vw] sm:w-[600px] h-screen ph:h-auto bg-white p-4 ph:rounded-2xl'>
      <div className={`${!isMediaSet && 'h-[40vh]'} flex flex-col`}>
        {/* header */}
        <div className='flex items-center justify-between mb-4'>
          <div
            onClick={() => dispatch(toggleComposeTweet())}
            className='w-8 h-8 p-1 -ml-1 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
          >
            <IoCloseSharp className='hidden ph:block text-2xl text-gray-700' />
            <IoArrowBack className='ph:hidden text-2xl text-gray-700' />
          </div>
          <div className='ph:hidden'>
            <TweetSubmitButton
              type='Tweet'
              isDisabled={isSubmitDisabled}
              isLoading={isLoading}
              handleSubmit={handleSubmitTweet}
            />
          </div>
        </div>

        {/* body */}
        <div className='flex-1'>
          <CreateTweet from='ComposeTweet' setIsMediaSet={setIsMediaSet} />
        </div>
      </div>
    </div>
  );
};

export default ComposeTweet;
