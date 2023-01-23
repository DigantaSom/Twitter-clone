import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import constants from '../constants';

interface ProfilePictureProps {
  uri: string;
  disableGoToProfile?: boolean;
}

const ProfilePicture: FC<ProfilePictureProps> = ({
  uri,
  disableGoToProfile,
}) => {
  const navigate = useNavigate();

  const handleGotToProfile = () => {
    if (!disableGoToProfile) {
      navigate('/profile');
    }
  };

  return (
    <div onClick={handleGotToProfile}>
      <div className='relative w-10 h-10 ph_sm:w-12 ph_sm:h-12 hover:cursor-pointer'>
        <img
          src={uri !== '' ? uri : constants.placeholder_profilePicture}
          alt='User'
          className='w-full h-full rounded-full'
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
