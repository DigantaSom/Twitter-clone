import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { IoCloseSharp } from 'react-icons/io5';

import { PhotoType } from '../types';

import useAuth from '../hooks/useAuth';
import { useGetProfileQuery } from '../features/user/user.api-slice';

import constants from '../constants';

const ProfilePhotosPage = () => {
  const { username } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const { data, isLoading, isError } = useGetProfileQuery({
    username,
    loggedInUserId: auth.user?.id,
  });

  let content;

  if (isLoading) {
    content = <PulseLoader color='white' />;
  } else if (isError) {
    content = (
      <div className='text-white text-2xl'>Error loading profile photo.</div>
    );
  } else if (data) {
    const { profilePicture, headerPhoto } = data;

    const handleGoBack = () => {
      if (username) {
        navigate('/' + username);
      }
    };

    let photoType: PhotoType = 'Profile';

    if (
      pathname === `/${username}/photo` ||
      pathname === `/${username}/photo/`
    ) {
      photoType = 'Profile';
    } else if (
      pathname === `/${username}/header_photo` ||
      pathname === `/${username}/header_photo/`
    ) {
      photoType = 'Header';
    }

    let photoContainerDimensionStyles = '';

    if (photoType === 'Profile') {
      photoContainerDimensionStyles =
        'w-[80vw] h-[80vw] ph_sm:w-[400px] ph_sm:h-[400px]';
    } else if (photoType === 'Header') {
      photoContainerDimensionStyles = 'w-screen h-auto max-h-[500px]';
    }

    content = (
      // BottomNavigation component is z-30
      <div className='relative z-40'>
        <div onClick={handleGoBack} className='bg-black w-screen h-screen'>
          <div
            title='Close'
            className='absolute top-4 left-4 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:cursor-pointer'
          >
            <IoCloseSharp className='text-2xl text-gray-200' />
          </div>
        </div>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${photoContainerDimensionStyles}`}
        >
          {photoType === 'Header' && !headerPhoto ? (
            <div className='w-full h-[50vh] bg-black'></div>
          ) : (
            <img
              src={
                photoType === 'Header'
                  ? headerPhoto
                  : profilePicture || constants.placeholder_profilePicture
              }
              alt={photoType}
              className={`w-full object-cover ${
                photoType === 'Profile' ? 'h-full rounded-full' : 'h-[50vh]'
              }`}
            />
          )}
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default ProfilePhotosPage;
