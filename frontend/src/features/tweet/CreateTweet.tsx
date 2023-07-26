import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import imageCompression from 'browser-image-compression';

import { IoCloseSharp } from 'react-icons/io5';

import useAuth from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { useGetMyProfilePhotoQuery } from '../user/user.api-slice';
import { useAddNewTweetMutation } from './tweet.api-slice';

import {
  selectIsComposeTweetShown,
  toggleComposeTweet,
  handleSubmitDisabled,
} from '../ui/ui.slice';
import { setNewTweetData, clearNewTweetData } from './tweet.slice';

import ProfilePicture from '../../components/ProfilePicture';
import CreateTweetAdOns from '../../components/CreateTweetAdOns';

import constants from '../../constants';
import convertBlobToBase64 from '../../utils/convertBlobToBase64.util';

interface CreateTweetProps {
  from: 'Feed' | 'ComposeTweet';
  setIsMediaSet?: Dispatch<SetStateAction<boolean>>;
}

const CreateTweet: FC<CreateTweetProps> = ({ from, setIsMediaSet }) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();

  const isComposeTweetShown = useAppSelector(selectIsComposeTweetShown);

  const { data: loggedInUserInfo } = useGetMyProfilePhotoQuery();
  const [addNewTweet, { isLoading }] = useAddNewTweetMutation();

  const hiddenPictureInput = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [imageToPost, setImageToPost] = useState('');

  useEffect(() => {
    if (isComposeTweetShown && text) {
      dispatch(
        setNewTweetData({
          parentTweetId: null,
          tweetDegree: 0,
          caption: text,
          media: [imageToPost],
        })
      );
    }
  }, [isComposeTweetShown, text, imageToPost, dispatch]);

  useEffect(() => {
    dispatch(handleSubmitDisabled(text === '') || isLoading);
  }, [dispatch, text, isLoading]);

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
        if (from === 'ComposeTweet' && setIsMediaSet) {
          setIsMediaSet(true);
        }
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
        if (from === 'ComposeTweet' && setIsMediaSet) {
          setIsMediaSet(false);
        }
      }
    }
  };

  const handleSubmitTweet = async () => {
    if (isLoading) {
      return;
    }
    try {
      const res = await addNewTweet({
        parentTweetId: null,
        tweetDegree: 0,
        caption: text,
        media: [imageToPost],
      }).unwrap();

      if (res?.isError) {
        alert(res?.message);
        return;
      }
      setText('');
      setImageToPost('');
      dispatch(clearNewTweetData());
      if (isComposeTweetShown) {
        dispatch(toggleComposeTweet());
      }
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
      <ProfilePicture
        uri={loggedInUserInfo?.profilePhoto}
        username={auth.user?.twitterHandle}
      />

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

        <CreateTweetAdOns
          type='Tweet'
          icon_dynamicStyles={icon_dynamicStyles}
          hiddenPictureInput={hiddenPictureInput}
          handleClickPictureButton={handleClickPictureButton}
          addImageToPost={addImageToPost}
          isButtonDisabled={text === '' || isLoading}
          isLoading={isLoading}
          handleSubmit={handleSubmitTweet}
        />
      </div>
    </div>
  );
};

export default CreateTweet;
