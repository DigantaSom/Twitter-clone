import {
  ChangeEvent,
  Dispatch,
  forwardRef,
  ForwardRefRenderFunction,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import imageCompression from 'browser-image-compression';

import { IoCloseSharp } from 'react-icons/io5';

import useAuth from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { useGetMyBasicInfoQuery } from '../user/user.api-slice';
import {
  useAddNewTweetMutation,
  useQuoteTweetMutation,
} from './tweet.api-slice';

import {
  selectIsComposeTweetShown,
  toggleComposeTweet,
  selectQuoteTweetPopupRefTweetId,
  closeQuoteTweetPopup,
} from '../ui/ui.slice';

import ProfilePicture from '../../components/ProfilePicture';
import QuoteRefTweetContainer from './QuoteRefTweetContainer';
import CreateTweetAdOns from '../../components/CreateTweetAdOns';

import constants from '../../constants';
import convertBlobToBase64 from '../../utils/convertBlobToBase64.util';

export interface AddNew_or_Quote_Tweet_Handle {
  handleAddNewTweet: () => void;
  handleQuoteTweet: () => void;
}

interface CreateTweetProps {
  from: 'Feed' | 'ComposeTweet' | 'QuoteTweetPopup';
  setIsMediaSet?: Dispatch<SetStateAction<boolean>>;
}

const CreateTweet: ForwardRefRenderFunction<
  AddNew_or_Quote_Tweet_Handle,
  CreateTweetProps
> = (props, forwardRef) => {
  const { from, setIsMediaSet } = props;
  const auth = useAuth();
  const dispatch = useAppDispatch();

  const isComposeTweetShown = useAppSelector(selectIsComposeTweetShown);
  const quoteTweetPopupRefTweetId = useAppSelector(
    selectQuoteTweetPopupRefTweetId
  );

  const { data: loggedInUserInfo } = useGetMyBasicInfoQuery();

  const [addNewTweet, { isLoading: isAddNewTweetLoading }] =
    useAddNewTweetMutation();

  const [quoteTweet, { isLoading: isQuoteTweetLoading }] =
    useQuoteTweetMutation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hiddenPictureInput = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [imageToPost, setImageToPost] = useState('');

  useEffect(() => {
    if (from !== 'Feed') {
      textareaRef.current?.focus();
    }
  }, [from]);

  // to trigger this function on a button click from parent (mobile view)
  useImperativeHandle(forwardRef, () => ({
    handleAddNewTweet,
    handleQuoteTweet,
  }));

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
    if (!isAddNewTweetLoading) {
      if (window.confirm('Remove image?')) {
        setImageToPost('');
        if (from === 'ComposeTweet' && setIsMediaSet) {
          setIsMediaSet(false);
        }
      }
    }
  };

  const handleAddNewTweet = async () => {
    if (isAddNewTweetLoading) {
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

  const handleQuoteTweet = async () => {
    if (isQuoteTweetLoading) {
      return;
    }

    try {
      const res = await quoteTweet({
        quoteRefTweetId: quoteTweetPopupRefTweetId,
        caption: text,
        media: [imageToPost],
      }).unwrap();

      if (res?.isError) {
        alert(res?.message);
        return;
      }
      setText('');
      setImageToPost('');
      dispatch(closeQuoteTweetPopup());
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
  } else {
    container_dynamicStyles = 'flex';
    icon_dynamicStyles = 'block';

    if (from === 'ComposeTweet') {
      textarea_dynamicStyles = 'border-b-[1px] border-gray-200';
    } else if (from === 'QuoteTweetPopup') {
      textarea_dynamicStyles = 'border-none';
    }
  }

  return (
    <div
      className={`${container_dynamicStyles} items-start justify-between h-full`}
    >
      {/* left */}
      <ProfilePicture
        uri={loggedInUserInfo?.profilePicture}
        username={auth.user?.twitterHandle}
      />

      {/* right */}
      <div className='flex flex-col w-full h-full ml-3'>
        <textarea
          ref={textareaRef}
          placeholder={
            from === 'QuoteTweetPopup' ? 'Add a comment!' : "What's happening?"
          }
          rows={2}
          value={text}
          onChange={e => setText(e.target.value)}
          className={`w-full flex-1 placeholder-gray-600 placeholder:text-xl py-2 outline-none ${textarea_dynamicStyles}`}
        ></textarea>

        {imageToPost && (
          <div className='relative pt-3 pb-2'>
            {!isAddNewTweetLoading && (
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

        {from === 'QuoteTweetPopup' && (
          <QuoteRefTweetContainer quoteRefTweetId={quoteTweetPopupRefTweetId} />
        )}

        <CreateTweetAdOns
          type='Tweet'
          icon_dynamicStyles={icon_dynamicStyles}
          hiddenPictureInput={hiddenPictureInput}
          handleClickPictureButton={handleClickPictureButton}
          addImageToPost={addImageToPost}
          isButtonDisabled={text === '' || isAddNewTweetLoading}
          isLoading={isAddNewTweetLoading}
          handleSubmit={
            from === 'QuoteTweetPopup' ? handleQuoteTweet : handleAddNewTweet
          }
        />

        <br />
      </div>
    </div>
  );
};

export default forwardRef(CreateTweet);
