import { FC } from 'react';

import { HiOutlineEmojiSad, HiOutlineDocumentAdd } from 'react-icons/hi';
import { FiUserX } from 'react-icons/fi';
import { MdOutlineBlock } from 'react-icons/md';
import { ImEmbed2 } from 'react-icons/im';
import { BiVolumeMute } from 'react-icons/bi';
import { RiFlag2Line } from 'react-icons/ri';

interface PostOptionsProps {
  postId: string;
  authorUsername: string;
}

const PostOptions: FC<PostOptionsProps> = ({ postId, authorUsername }) => {
  return (
    <div className='absolute right-0 ph_xs:right-2 ph_sm:right-4 top-9 ph_sm:top-16 ph:top-14 z-10 bg-white shadow-xl rounded-lg font-bold overflow-hidden'>
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
        <ImEmbed2 className='text-lg' />
        <span className='ml-2 text-sm'>Embed Tweet</span>
      </div>

      <div
        className='flex items-center p-3 hover:bg-gray-50'
        onClick={() => {}}
      >
        <RiFlag2Line className='text-lg' />
        <span className='ml-2 text-sm'>Report Tweet</span>
      </div>
    </div>
  );
};

export default PostOptions;
