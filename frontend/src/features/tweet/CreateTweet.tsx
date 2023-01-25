import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';

import {
  AiOutlinePicture,
  AiOutlineFileGif,
  AiOutlineSchedule,
} from 'react-icons/ai';
import { BiPoll } from 'react-icons/bi';
import { GrEmoji } from 'react-icons/gr';
import { CgPin } from 'react-icons/cg';
import { IoCloseSharp } from 'react-icons/io5';

import { useAppDispatch } from '../../hooks/redux-hooks';
import { handleSubmitDisabled } from '../ui/ui.slice';
import { useAddNewTweetMutation } from './tweet.api-slice';

import ProfilePicture from '../../components/ProfilePicture';
import TweetSubmitButton from './TweetSubmitButton';

import constants from '../../constants';
import convertBlobToBase64 from '../../utils/convertBlobToBase64.util';

interface CreateTweetProps {
  from: 'Feed' | 'ComposeTweet';
}

const CreateTweet: FC<CreateTweetProps> = ({ from }) => {
  const dispatch = useAppDispatch();
  const hiddenPictureInput = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [imageToPost, setImageToPost] = useState('');

  const [addNewTweet, { isLoading }] = useAddNewTweetMutation();

  useEffect(() => {
    dispatch(handleSubmitDisabled(text === '') || isLoading);
  }, [dispatch, text, isLoading]);

  const handleClickPictureButton = () => {
    hiddenPictureInput.current?.click();
  };

  const addImageToPost = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files ? files[0] : null;

    const compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    if (file) {
      try {
        const compressedFile = await imageCompression(file, compressionOptions);
        const base64 = await convertBlobToBase64(compressedFile);
        setImageToPost(base64 as string);
      } catch (error) {
        console.log('Error uploading image:', error);
        alert('Error uploading image. Please try again later.');
      }
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm('Remove image?')) {
      setImageToPost('');
    }
  };

  const handleSubmitTweet = async () => {
    try {
      const res = await addNewTweet({
        caption: text,
        media: [imageToPost],
      }).unwrap();

      if (res?.isError) {
        alert(res?.message);
        return;
      }
      setText('');
      setImageToPost('');
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

  let container_dynamicStyles = '';
  let textarea_dynamicStyles = '';
  let icon_dynamicStyles = '';

  if (from === 'Feed') {
    container_dynamicStyles =
      'hidden ph:flex py-3 px-4 border-b-[1px] border-gray-200';
    textarea_dynamicStyles = 'focus:border-b-[1px] focus:border-gray-200';
    icon_dynamicStyles = 'hidden sm:block';
  } else if (from === 'ComposeTweet') {
    container_dynamicStyles = 'flex';
    textarea_dynamicStyles = 'border-b-[1px] border-gray-200';
    icon_dynamicStyles = 'block';
  }

  return (
    <div
      className={`${container_dynamicStyles} items-start justify-between h-full`}
    >
      {/* left */}
      <ProfilePicture uri={constants.placeholder_profilePicture} />

      {/* right */}
      <div className='flex flex-col w-full h-full ml-3'>
        <textarea
          placeholder="What's happening?"
          rows={2}
          value={text}
          onChange={e => setText(e.target.value)}
          className={`w-full flex-1 placeholder-gray-600 placeholder:text-xl py-2 outline-none ${textarea_dynamicStyles}`}
        ></textarea>

        {imageToPost && (
          <div className='relative pt-3 pb-2'>
            <div
              title='Remove'
              onClick={handleRemoveImage}
              className='absolute z-30 rounded-full bg-black w-8 h-8 flex items-center justify-center ml-1 mt-1 hover:cursor-pointer'
            >
              <IoCloseSharp className='text-white text-lg' />
            </div>
            <img
              src={imageToPost}
              alt='Post'
              className='w-full h-full rounded-xl'
            />
          </div>
        )}

        <div className='flex items-center justify-between mt-4 ph:mt-2'>
          <div className='flex items-center ph_xs:space-x-1 text-twitter text-xl'>
            <div
              onClick={handleClickPictureButton}
              className='p-1 mr-[2px] ph_xs:p-2 ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light'
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
            <div
              className={`${icon_dynamicStyles} p-1 mr-[2px] ph_xs:p-2 ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light`}
            >
              <BiPoll />
            </div>
            <div className='p-1 mr-[2px] ph_xs:p-2 ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light'>
              <GrEmoji />
            </div>
            <div
              className={`${icon_dynamicStyles} p-1 mr-[2px] ph_xs:p-2 ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light`}
            >
              <AiOutlineSchedule />
            </div>
            <div className='p-1 mr-[2px] ph_xs:p-2 ph_xs:mr-0 rounded-full hover:cursor-pointer hover:bg-twitter-light'>
              <CgPin />
            </div>
          </div>

          <div className='hidden ph:block'>
            <TweetSubmitButton
              isDisabled={text === '' || isLoading}
              isLoading={isLoading}
              handleSubmitTweet={handleSubmitTweet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTweet;
