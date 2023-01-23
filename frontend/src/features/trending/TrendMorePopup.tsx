import { FC } from 'react';
import { HiOutlineEmojiSad } from 'react-icons/hi';

interface TrendMorePopupProps {
  itemId: string;
}

const TrendMorePopup: FC<TrendMorePopupProps> = ({ itemId }) => {
  return (
    <div className='absolute right-10 top-8 z-10 bg-white shadow-xl rounded-lg font-bold overflow-hidden'>
      <div
        className='flex items-center p-3 hover:bg-gray-50'
        onClick={() => {}}
      >
        <HiOutlineEmojiSad />
        <span className='ml-2 text-sm'>Not interested in this</span>
      </div>

      <div
        className='flex items-center p-3 hover:bg-gray-50'
        onClick={() => {}}
      >
        <HiOutlineEmojiSad />
        <span className='ml-2 text-sm'>This trend is harmful or spammy</span>
      </div>
    </div>
  );
};

export default TrendMorePopup;
