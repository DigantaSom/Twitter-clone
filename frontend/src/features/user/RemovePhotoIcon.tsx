import { FC, memo } from 'react';
import { MdOutlineClose } from 'react-icons/md';

interface RemovePhotoIconProps {
  onClick: () => void;
}

const RemovePhotoIcon: FC<RemovePhotoIconProps> = ({ onClick }) => {
  return (
    <div
      title='Remove photo'
      onClick={onClick}
      className='w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center hover:cursor-pointer opacity-80 hover:opacity-60'
    >
      <MdOutlineClose className='text-white text-lg -mt-[1px] -ml-[1px]' />
    </div>
  );
};

export default memo(RemovePhotoIcon);
