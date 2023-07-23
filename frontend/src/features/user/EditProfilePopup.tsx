import { useState } from 'react';
import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';

import useAuth from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { useEditProfileMutation, useGetProfileQuery } from './user.api-slice';
import {
  closeEditProfilePopup,
  selectEditProfilePopupUsername,
} from '../ui/ui.slice';

import AppPopup from '../../components/AppPopup';
import CustomButton from '../../components/CustomButton';
import AddPhotoIcon from './AddPhotoIcon';
import RemovePhotoIcon from './RemovePhotoIcon';
import FormInput from '../ui/FormInput';

import constants from '../../constants';

const EditProfilePopup = () => {
  const dispatch = useAppDispatch();
  const editProfilePopupUsername = useAppSelector(
    selectEditProfilePopupUsername
  );
  const auth = useAuth();

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(
    {
      username: editProfilePopupUsername,
      loggedInUserId: auth.user?.id,
    }
  );

  const [editProfile, { isLoading: isEditProfileLoading }] =
    useEditProfileMutation();

  const [name, setName] = useState(profileData?.name || '');
  const [bio, setBio] = useState(profileData?.bio || '');
  const [location, setLocation] = useState(profileData?.location || '');
  const [website, setWebsite] = useState(profileData?.website || '');
  const [profilePhoto, setProfilePhoto] = useState(
    profileData?.profilePicture || constants.placeholder_profilePicture
  );
  const [headerPhoto, setHeaderPhoto] = useState(
    profileData?.headerPhoto || ''
  );

  const handleSubmit = async () => {
    if (isProfileLoading || isEditProfileLoading) return;

    try {
      const res = await editProfile({
        userId: auth.user?.id || '', // just to invalidate the cache after success
        name,
        bio,
        location,
        website,
        profilePhoto,
        headerPhoto,
      }).unwrap();

      if ((res as any)?.isError) {
        alert((res as any)?.message);
        return;
      } else {
        alert(res.message);
        handleClosePopup();
      }
    } catch (err: any) {
      let errMsg = '';

      if (!err.status) {
        errMsg = 'No Server Response';
      } else {
        errMsg = err.data?.message;
      }
      alert(errMsg);
    }
  };

  const handleClosePopup = () => {
    setProfilePhoto('');
    setHeaderPhoto('');
    dispatch(closeEditProfilePopup()); // this should be the last step
  };

  return (
    <AppPopup>
      <header className='px-2 ph_xs:px-4 flex items-center justify-between absolute top-0 w-full h-10'>
        <div className='flex items-center space-x-3'>
          <div
            onClick={handleClosePopup}
            className='w-8 h-8 p-1 -ml-1 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
          >
            <IoCloseSharp className='hidden ph:block text-2xl text-gray-700' />
            <IoArrowBack className='ph:hidden text-2xl text-gray-700' />
          </div>
          <h2 className='font-bold text-xl'>Edit Profile</h2>
        </div>
        <CustomButton
          title='Save'
          onClick={handleSubmit}
          bgColorClass='bg-black'
          textColorClass='text-white'
          textSizeClass='text-xs ph:text-sm'
        />
      </header>

      <main className='flex-1 mt-12 h-full overflow-y-scroll'>
        <div className='relative'>
          {/* Header Photo */}
          <div className='w-full h-[180px] relative'>
            {headerPhoto !== '' ? (
              <div className='bg-black h-full'>
                <img
                  src={headerPhoto}
                  alt='Header'
                  className='w-full h-full object-cover opacity-60'
                />
              </div>
            ) : (
              <div className='w-full h-full bg-gray-400 opacity-50'></div>
            )}

            <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center space-x-4'>
              <AddPhotoIcon setPhoto={setHeaderPhoto} />
              {headerPhoto !== '' && (
                <RemovePhotoIcon onClick={() => setHeaderPhoto('')} />
              )}
            </div>
          </div>

          {/* Profile Photo */}
          <div className='absolute -bottom-14 left-2 ph_sm:left-4'>
            <div className='w-28 h-28 bg-white rounded-full flex items-center justify-center relative'>
              <div className='flex items-center justify-center bg-black rounded-full w-[92%] h-[92%]'>
                <img
                  src={profilePhoto}
                  alt='Profile'
                  className='w-full h-full object-cover rounded-full opacity-70'
                />
              </div>
              <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                <AddPhotoIcon setPhoto={setProfilePhoto} />
              </div>
            </div>
          </div>
        </div>

        {/* Other Profile Info (editable fields) */}
        <div className='mt-16 mx-2 ph_sm:mx-4 mb-5'>
          <FormInput
            label='Name'
            type='text'
            initialValue={name}
            maxLength={50}
            handleChange={text => setName(text)}
          />
          <FormInput
            label='Bio'
            type='textarea'
            initialValue={bio}
            maxLength={160}
            handleChange={text => setBio(text)}
          />
          <FormInput
            label='Location'
            type='text'
            initialValue={location}
            maxLength={30}
            handleChange={text => setLocation(text)}
          />
          <FormInput
            label='Website'
            type='url'
            initialValue={website}
            maxLength={100}
            handleChange={text => setWebsite(text)}
          />
        </div>
      </main>
    </AppPopup>
  );
};

export default EditProfilePopup;
