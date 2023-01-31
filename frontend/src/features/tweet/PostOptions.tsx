import { FC } from 'react';

import { TbTrash, TbMessageCircle2 } from 'react-icons/tb';
import { BsPin } from 'react-icons/bs';
import { BiBarChart, BiVolumeMute } from 'react-icons/bi';
import { HiOutlineEmojiSad, HiOutlineDocumentAdd } from 'react-icons/hi';
import { FiUserX } from 'react-icons/fi';
import { MdOutlineBlock } from 'react-icons/md';
import { ImEmbed2 } from 'react-icons/im';
import { RiFlag2Line } from 'react-icons/ri';

import { TokenPayloadUser } from '../../types';

interface PostOptionsProps {
  from: 'TweetItem' | 'TweetPage';
  currentUser: TokenPayloadUser;
  authorUsername: string;
  handleDeletePost: () => void;
}

const PostOptions: FC<PostOptionsProps> = ({
  from,
  currentUser,
  authorUsername,
  handleDeletePost,
}) => {
  let content;

  // if the current logged in user is the tweet author
  if (currentUser.twitterHandle === authorUsername) {
    content = (
      <>
        <div
          className='flex items-center p-3 text-red-500 hover:bg-gray-50'
          onClick={handleDeletePost}
        >
          <TbTrash className='text-lg' />
          <span className='ml-2 text-sm'>Delete</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <BsPin className='text-lg' />
          <span className='ml-2 text-sm'>Pin to your profile</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <TbMessageCircle2 className='text-lg' />
          <span className='ml-2 text-sm'>Change who can reply</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <ImEmbed2 className='text-lg' />
          <span className='ml-2 text-sm'>Embed Tweet</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <BiBarChart className='text-lg' />
          <span className='ml-2 text-sm'>View Tweet analytics</span>
        </div>
      </>
    );
  } else {
    content = (
      <>
        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <HiOutlineEmojiSad className='text-lg' />
          <span className='ml-2 text-sm'>Not interested in this Tweet</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <FiUserX className='text-lg' />
          <span className='ml-2 text-sm'>Unfollow @{authorUsername}</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <HiOutlineDocumentAdd className='text-lg' />
          <span className='ml-2 text-sm'>
            Add/remove @{authorUsername} from Lists
          </span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <BiVolumeMute className='text-lg' />
          <span className='ml-2 text-sm'>Mute @{authorUsername}</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <MdOutlineBlock className='text-lg' />
          <span className='ml-2 text-sm'>Block @{authorUsername}</span>
        </div>

        <div
          className='flex items-center p-3 hover:bg-gray-50'
          onClick={() => {}}
        >
          <RiFlag2Line className='text-lg' />
          <span className='ml-2 text-sm'>Report Tweet</span>
        </div>
      </>
    );
  }

  let contentTopStyles = '';

  if (from === 'TweetItem') {
    contentTopStyles = 'top-9 ph_sm:top-16 ph:top-14';
  } else if (from === 'TweetPage') {
    contentTopStyles = 'top-24';
  }

  return (
    <div
      className={`absolute right-0 ph_xs:right-2 ph_sm:right-4 ${contentTopStyles} z-10 bg-white shadow-xl rounded-lg font-bold overflow-hidden`}
    >
      {content}
    </div>
  );
};

export default PostOptions;
