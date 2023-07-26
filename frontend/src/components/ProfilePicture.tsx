import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../hooks/redux-hooks';
import { closeLikedByPopup } from '../features/ui/ui.slice';

import constants from '../constants';

interface ProfilePictureProps {
  uri: string | undefined;
  username: string | undefined;
  disableGoToProfile?: boolean;
  desktopSize?: number; // e.g. desktopSize = 12 -> 'w-12 h-12' ; mobileSize -> 'w-10 h-10'
}

const ProfilePicture: FC<ProfilePictureProps> = ({
  uri,
  username,
  disableGoToProfile,
  desktopSize,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGotToProfile = () => {
    if (!username || !disableGoToProfile) {
      dispatch(closeLikedByPopup());
      navigate('/' + username);
    }
  };

  let sizeStyles = '';

  if (!!desktopSize) {
    sizeStyles = `w-${desktopSize - 2} h-${desktopSize - 2} 
    ph_sm:w-${desktopSize} ph_sm:h-${desktopSize}`;
  } else {
    sizeStyles = 'w-10 h-10 ph_sm:w-12 ph_sm:h-12';
  }

  return (
    <div onClick={handleGotToProfile}>
      <div className={`${sizeStyles} hover:cursor-pointer`}>
        <img
          src={uri && uri !== '' ? uri : constants.placeholder_profilePicture}
          alt='User'
          className='w-full h-full object-cover rounded-full'
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
