import { useRef, useState, useEffect, ChangeEvent, memo } from 'react';
import imageCompression from 'browser-image-compression';

import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';
import { BsDot } from 'react-icons/bs';

import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { useAddNewTweetMutation } from '../tweet/tweet.api-slice';

import { toggleCreateReplyPopup } from '../ui/ui.slice';
import {
  selectCreateReplyPopupData,
  clearCreateReplyPopupData,
} from '../reply/reply.slice';

import AppPopup from '../../components/AppPopup';
import ProfilePicture from '../../components/ProfilePicture';
import TweetSubmitButton from '../tweet/TweetSubmitButton';
import CreateTweetAdOns from '../../components/CreateTweetAdOns';

import constants from '../../constants';
import convertBlobToBase64 from '../../utils/convertBlobToBase64.util';

const CreateReplyPopup = () => {
  const dispatch = useAppDispatch();
  const {
    currentUser,
    parentTweetId,
    parentTweetDegree,
    replyingTo,
    caption,
    isMediaPresent,
    creationDate,
  } = useAppSelector(selectCreateReplyPopupData);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenPictureInput = useRef<HTMLInputElement>(null);

  const [text, setText] = useState('');
  const [imageToPost, setImageToPost] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [addNewTweet, { isLoading }] = useAddNewTweetMutation();

  useEffect(() => {
    if (isLoading) {
      setIsSubmitDisabled(true);
    } else {
      if (text === '' && imageToPost === '') {
        setIsSubmitDisabled(true);
      } else {
        setIsSubmitDisabled(false);
      }
    }
  }, [isLoading, text, imageToPost]);

  const handleClickReplyingTo = () => {};

  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleClickPictureButton = () => {
    hiddenPictureInput.current?.click();
  };

  const addImageToPost = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files ? files[0] : null;

    if (file) {
      try {
        const compressedFile = await imageCompression(
          file,
          constants.imageCompression_options
        );
        const base64 = await convertBlobToBase64(compressedFile);
        setImageToPost(base64 as string);
      } catch (error) {
        console.log('Error uploading image:', error);
        alert('Error uploading image. Please try again later.');
      }
    }
  };

  const handleRemoveImage = () => {
    if (!isLoading) {
      if (window.confirm('Remove image?')) {
        setImageToPost('');
      }
    }
  };

  const handleSubmitReply = async () => {
    if (isLoading) return;

    try {
      const res = await addNewTweet({
        parentTweetId,
        tweetDegree: parentTweetDegree + 1,
        caption: text,
        media: [imageToPost],
      }).unwrap();

      if (res?.isError) {
        alert(res?.message);
        return;
      }
      setText('');
      setImageToPost('');
      dispatch(toggleCreateReplyPopup(false));
      dispatch(clearCreateReplyPopupData());
    } catch (err: any) {
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
    <AppPopup>
      <header className='px-2 ph_xs:px-4 flex items-center justify-between absolute top-0 w-full h-10'>
        <div
          onClick={() => dispatch(toggleCreateReplyPopup(false))}
          className='w-8 h-8 p-1 -ml-1 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
        >
          <IoCloseSharp className='hidden ph:block text-2xl text-gray-700' />
          <IoArrowBack className='ph:hidden text-2xl text-gray-700' />
        </div>
        <div className='ph:hidden'>
          <TweetSubmitButton
            type='Reply'
            isDisabled={isSubmitDisabled}
            isLoading={isLoading}
            handleSubmit={handleSubmitReply}
          />
        </div>
      </header>

      <main className='flex-1 mt-12 h-full overflow-y-scroll px-2 ph_xs:px-4'>
        <div className='flex flex-col'>
          {/* Post info */}
          <div
            className={`w-full flex items-start ${constants.profilePicture_info_gap_style}`}
          >
            <div className='w-[12%] dp-custom-styles-with-thread-line'>
              <ProfilePicture
                uri={replyingTo.profilePicture}
                username={currentUser?.twitterHandle}
              />
            </div>
            <div className='w-[88%] flex flex-col'>
              <div className='flex flex-col ph:flex-row ph:items-center ph:space-x-2 pb-1'>
                <h3 className='font-bold'>{replyingTo.fullName}</h3>
                <div className='flex items-center space-x-1'>
                  <span className='text-gray-500'>@{replyingTo.username}</span>
                  <BsDot />
                  <span className='text-gray-500'>{creationDate}</span>
                </div>
              </div>
              <div>
                <p className='pb-[2px]'>{caption}</p>
                {isMediaPresent && (
                  <b>
                    <i>(Media)</i>
                  </b>
                )}
              </div>
            </div>
          </div>

          {/* Replying to */}
          <div
            className={`w-full flex items-center ${constants.profilePicture_info_gap_style} mb-3`}
          >
            <div className='w-[12%]'>
              {/* Thread line */}
              <div className='border-l-[2px] border-[#d5d5d5] h-[20px] ml-5 ph_sm:ml-6 ph:hidden'></div>
            </div>
            <div
              onClick={handleClickReplyingTo}
              className='w-[88%] text-gray-500 text-sm hover:cursor-pointer'
            >
              Replying to{' '}
              <span className='text-twitter'>@{replyingTo.username}</span>
            </div>
          </div>

          {/* Tweet Create */}
          <div
            className={`w-full flex items-start ${constants.profilePicture_info_gap_style}`}
          >
            <div className='w-[12%]'>
              <ProfilePicture
                uri={''} // TODO: instead of payload, get profile pic from somewhere else
                username={currentUser?.twitterHandle}
              />
            </div>
            <div className='w-[88%]'>
              <div className='flex flex-col'>
                <textarea
                  ref={textAreaRef}
                  placeholder='Tweet your reply'
                  rows={4}
                  value={text}
                  onChange={handleChangeText}
                  className='mt-2 w-full resize-none ph_xs:text-lg ph:text-xl focus:outline-none placeholder:text-gray-600'
                ></textarea>
              </div>

              {/* Image Preview */}
              {/* TODO: create a separate component for this for code-reusability */}
              {imageToPost && (
                <div className='relative pt-3 pb-2'>
                  {!isLoading && (
                    <div
                      title='Remove'
                      onClick={handleRemoveImage}
                      className='absolute z-30 rounded-full bg-black w-8 h-8 flex items-center justify-center ml-1 mt-1 hover:cursor-pointer'
                    >
                      <IoCloseSharp className='text-white text-lg' />
                    </div>
                  )}
                  <img
                    src={imageToPost}
                    alt='Post'
                    className='w-full h-full rounded-xl'
                  />
                </div>
              )}
            </div>
          </div>

          {/* Reply Add-ons */}
          <div
            className={`w-full flex items-start ${constants.profilePicture_info_gap_style}`}
          >
            <div className='w-[12%]'></div>
            <div className='w-[88%]'>
              <CreateTweetAdOns
                type='Reply'
                icon_dynamicStyles=''
                hiddenPictureInput={hiddenPictureInput}
                handleClickPictureButton={handleClickPictureButton}
                addImageToPost={addImageToPost}
                isButtonDisabled={isSubmitDisabled}
                isLoading={isLoading}
                handleSubmit={handleSubmitReply}
              />
            </div>
          </div>
        </div>
      </main>
    </AppPopup>
  );
};

export default memo(CreateReplyPopup);
