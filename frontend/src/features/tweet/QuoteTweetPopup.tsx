import { useState, useRef } from 'react';
import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';

import { useAppDispatch } from '../../hooks/redux-hooks';

import { closeQuoteTweetPopup } from '../ui/ui.slice';

import TweetSubmitButton from './TweetSubmitButton';
import CreateTweet, { AddNew_or_Quote_Tweet_Handle } from './CreateTweet';

const QuoteTweetPopup = () => {
  const dispatch = useAppDispatch();
  const [isMediaSet, setIsMediaSet] = useState(false);
  const createTweet_childRef = useRef<AddNew_or_Quote_Tweet_Handle>(null); // ref to the child component <CreateTweet />, used for clicking only 'handleQuoteTweet()' function inside the child which is defined in 'AddNew_or_Quote_Tweet_Handle' interface

  const handleClick_mobileSubmitButton = () => {
    createTweet_childRef.current?.handleQuoteTweet();
  };

  return (
    <div className='absolute z-50 top-0 left-0 ph:top-8 ph:left-[50%] ph:-translate-x-[50%] ph:bottom-12'>
      <div className='w-screen ph:w-[90vw] sm:w-[600px] h-screen ph:h-full bg-white p-4 ph:rounded-2xl overflow-y-scroll'>
        <div className={`${!isMediaSet && 'h-[40vh]'} flex flex-col`}>
          {/* header */}
          <div className='flex items-center justify-between mb-4'>
            <div
              onClick={() => dispatch(closeQuoteTweetPopup())}
              className='w-8 h-8 p-1 -ml-1 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
            >
              <IoCloseSharp className='hidden ph:block text-2xl text-gray-700' />
              <IoArrowBack className='ph:hidden text-2xl text-gray-700' />
            </div>
            <div className='ph:hidden'>
              <TweetSubmitButton
                type='Tweet'
                isDisabled={false}
                isLoading={false}
                handleSubmit={handleClick_mobileSubmitButton}
              />
            </div>
          </div>

          {/* body */}
          <div className='flex-1'>
            <CreateTweet
              from='QuoteTweetPopup'
              setIsMediaSet={setIsMediaSet}
              ref={createTweet_childRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteTweetPopup;
