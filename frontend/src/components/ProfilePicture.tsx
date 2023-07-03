import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../hooks/redux-hooks';
import { closeLikedByPopup } from '../features/ui/ui.slice';

import constants from '../constants';

interface ProfilePictureProps {
  uri: string | undefined;
  username: string | undefined;
  disableGoToProfile?: boolean;
}

const ProfilePicture: FC<ProfilePictureProps> = ({
  uri,
  username,
  disableGoToProfile,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGotToProfile = () => {
    if (!username || !disableGoToProfile) {
      dispatch(closeLikedByPopup());
      navigate('/' + username);
    }
  };

  return (
    <div onClick={handleGotToProfile}>
      <div className='relative w-10 h-10 ph_sm:w-12 ph_sm:h-12 hover:cursor-pointer'>
        <img
          src={uri && uri !== '' ? uri : constants.placeholder_profilePicture}
          alt='User'
          className='w-full h-full rounded-full'
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
