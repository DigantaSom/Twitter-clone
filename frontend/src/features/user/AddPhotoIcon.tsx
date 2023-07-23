// The positioning of this component is done at its parent div.

import { ChangeEvent, Dispatch, FC, memo, SetStateAction, useRef } from 'react';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import imageCompression from 'browser-image-compression';

import constants from '../../constants';
import convertBlobToBase64 from '../../utils/convertBlobToBase64.util';

interface AddPhotoIconProps {
  setPhoto: Dispatch<SetStateAction<string>>;
}

const AddPhotoIcon: FC<AddPhotoIconProps> = ({ setPhoto }) => {
  const hiddenPictureInput = useRef<HTMLInputElement>(null);

  const addPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files ? files[0] : null;

    if (file) {
      try {
        const compressedFile = await imageCompression(
          file,
          constants.imageCompression_options
        );
        const base64 = await convertBlobToBase64(compressedFile);
        setPhoto(base64 as string);
      } catch (error) {
        console.log('Error uploading image:', error);
        alert('Error uploading image. Please try again later.');
      }
    }
  };

  return (
    <div
      title='Add photo'
      onClick={() => hiddenPictureInput.current?.click()}
      className='w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center hover:cursor-pointer opacity-80 hover:opacity-60'
    >
      <MdOutlineAddAPhoto className='text-white text-lg -mt-[1px] -ml-[1px]' />
      <input
        type='file'
        ref={hiddenPictureInput}
        hidden
        accept='.jpeg, .png, .jpg'
        onChange={addPhoto}
      />
    </div>
  );
};

export default memo(AddPhotoIcon);
