import { FC, RefObject, ChangeEvent } from 'react';

import {
  AiOutlineFileGif,
  AiOutlinePicture,
  AiOutlineSchedule,
} from 'react-icons/ai';
import { BiPoll } from 'react-icons/bi';
import { CgPin } from 'react-icons/cg';
import { GrEmoji } from 'react-icons/gr';

import TweetSubmitButton from '../features/tweet/TweetSubmitButton';

interface CreateTweetAdOnsProps {
  type: 'Tweet' | 'Reply';
  icon_dynamicStyles: string;
  hiddenPictureInput: RefObject<HTMLInputElement>;
  handleClickPictureButton: () => void;
  addImageToPost: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  isButtonDisabled: boolean;
  isLoading: boolean;
  handleSubmit: () => void;
}

const CreateTweetAdOns: FC<CreateTweetAdOnsProps> = ({
  type,
  icon_dynamicStyles,
  hiddenPictureInput,
  handleClickPictureButton,
  addImageToPost,
  isButtonDisabled,
  isLoading,
  handleSubmit,
}) => {
  return (
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
          type={type}
          isDisabled={isButtonDisabled}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CreateTweetAdOns;
