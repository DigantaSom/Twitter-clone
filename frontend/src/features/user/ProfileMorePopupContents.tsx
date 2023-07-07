import { FC } from 'react';

import { AiOutlineLink } from 'react-icons/ai';
import { MdOutlineBlock } from 'react-icons/md';
import { RiFlag2Line } from 'react-icons/ri';

import { useAppDispatch } from '../../hooks/redux-hooks';
import { setToast, removeToast } from '../toast/toast.slice';

import SmallPopup from '../../components/SmallPopup';

import constants from '../../constants';
import copyTextToClipboard from '../../utils/copyTextToClipboard.util';

interface ProfileMorePopupContentsProps {
  username: string;
  handleClosePopup: () => void;
}

const ProfileMorePopupContents: FC<ProfileMorePopupContentsProps> = ({
  username,
  handleClosePopup,
}) => {
  const dispatch = useAppDispatch();

  const handleCopyLinkToProfile = () => {
    copyTextToClipboard(`http://localhost:3000/${username}`);
    handleClosePopup();

    dispatch(
      setToast({ type: 'copy-to-clipboard', message: 'Copied to clipboard' })
    );
    setTimeout(() => {
      dispatch(removeToast());
    }, constants.toastDuration);
  };

  return (
    <SmallPopup>
      <div
        className='flex items-center p-3 hover:bg-gray-50 hover:cursor-pointer'
        onClick={handleCopyLinkToProfile}
      >
        <AiOutlineLink className='text-xl' />
        <span className='ml-2 text-sm'>Copy link to Profile</span>
      </div>
      <div
        className='flex items-center p-3 hover:bg-gray-50 hover:cursor-pointer'
        onClick={() => {}}
      >
        <MdOutlineBlock className='text-xl' />
        <span className='ml-2 text-sm'>Block @{username}</span>
      </div>
      <div
        className='flex items-center p-3 hover:bg-gray-50 hover:cursor-pointer'
        onClick={() => {}}
      >
        <RiFlag2Line className='text-xl' />
        <span className='ml-2 text-sm'>Report @{username}</span>
      </div>
    </SmallPopup>
  );
};

export default ProfileMorePopupContents;
