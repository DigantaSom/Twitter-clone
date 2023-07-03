import { ChangeEvent, FC, memo, useEffect, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

import { AiOutlinePicture, AiOutlineFileGif } from 'react-icons/ai';
import { GrEmoji } from 'react-icons/gr';
import { CgPin } from 'react-icons/cg';
import { IoCloseSharp } from 'react-icons/io5';

import useAuth from '../../hooks/useAuth';
import { useAddNewTweetMutation } from '../tweet/tweet.api-slice';

import ProfilePicture from '../../components/ProfilePicture';
import TweetSubmitButton from '../tweet/TweetSubmitButton';

import constants from '../../constants';
import convertBlobToBase64 from '../../utils/convertBlobToBase64.util';

interface CreateReplyProps {
  parentTweetId: string;
  parentTweetDegree: number;
  profilePicture: string;
  tweetAuthorUsername: string;
}

const CreateReply: FC<CreateReplyProps> = ({
  parentTweetId,
  parentTweetDegree,
  profilePicture,
  tweetAuthorUsername,
}) => {
  const auth = useAuth();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenPictureInput = useRef<HTMLInputElement>(null);

  const [text, setText] = useState('');
  const [showHelperOptions, setShowHelperOptions] = useState(false);
  const [imageToPost, setImageToPost] = useState('');
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

  const [addNewTweet, { isLoading }] = useAddNewTweetMutation();

  const textAreaAdjust = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '1px';
      textAreaRef.current.style.height =
        25 + textAreaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (isLoading) {
      setIsSubmitButtonDisabled(true);
    } else {
      if (text === '' && imageToPost === '') {
        setIsSubmitButtonDisabled(true);
      } else {
        setIsSubmitButtonDisabled(false);
      }
    }
  }, [isLoading, text, imageToPost]);

  const handleCancelReply = () => {
    setShowHelperOptions(false);
    setText('');
    setImageToPost('');
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // revert textarea's height to normal
    }
  };

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

  const handleClickReplyingTo = () => {};

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
      handleCancelReply(); // not cancelling, but does the same job here
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
    <div className='py-3 ph:py-4'>
      <div
        className={`flex items-start ${constants.profilePicture_info_gap_style}`}
      >
        <ProfilePicture
          uri={profilePicture}
          username={auth.user?.twitterHandle}
        />

        <div className='flex flex-col space-y-2 w-full'>
          {showHelperOptions && (
            <div className='flex items-center justify-between'>
              <div
                onClick={handleClickReplyingTo}
                className='text-gray-500 text-sm hover:cursor-pointer w-fit'
              >
                Replying to{' '}
                <span className='text-twitter'>@{tweetAuthorUsername}</span>
              </div>
              <div
                onClick={handleCancelReply}
                className='ml-1 w-6 h-6 flex items-center justify-center rounded-full p-1 -mr-1 hover:bg-gray-200 hover:cursor-pointer'
              >
                <IoCloseSharp />
              </div>
            </div>
          )}

          <div
            onClick={() => setShowHelperOptions(true)}
            className='flex-1 py-1'
          >
            <textarea
              ref={textAreaRef}
              placeholder='Tweet your reply'
              value={text}
              onChange={handleChangeText}
              onKeyUp={textAreaAdjust}
              className='w-full resize-none ph_xs:text-lg ph:text-xl focus:outline-none placeholder:text-gray-600'
            ></textarea>
          </div>

          {/* Image Preview */}
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

          {/* Reply add-ons */}
          {/* TODO: replace this block of code with the 'CreateTweetAdOns' component */}
          {showHelperOptions && (
            <div className='flex items-center justify-between'>
              <div className='flex items-center ph_xs:space-x-1 text-twitter text-xl'>
                <div
                  onClick={handleClickPictureButton}
                  className='p-1 ph_xs:p-2 -ml-1 ph_xs:-ml-2 mr-[2px] ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light'
                >
                  <AiOutlinePicture />
                  <input
                    type='file'
                    ref={hiddenPictureInput}
                    hidden
                    accept='.jpeg, .png, .jpg'
                    onChange={addImageToPost}
                  />
                </div>

                <div className='p-2 rounded-full hover:cursor-pointer hover:bg-twitter-light'>
                  <AiOutlineFileGif />
                </div>

                <div className='p-1 mr-[2px] ph_xs:p-2 ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light'>
                  <GrEmoji />
                </div>

                <div className='p-1 mr-[2px] ph_xs:p-2 ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light'>
                  <CgPin />
                </div>
              </div>

              <TweetSubmitButton
                type='Reply'
                isDisabled={isSubmitButtonDisabled}
                isLoading={isLoading}
                handleSubmit={handleSubmitReply}
              />
            </div>
          )}
        </div>

        {!showHelperOptions && (
          <TweetSubmitButton
            type='Reply'
            isDisabled={isSubmitButtonDisabled}
            isLoading={isLoading}
            handleSubmit={handleSubmitReply}
          />
        )}
      </div>
    </div>
  );
};

export default memo(CreateReply);
