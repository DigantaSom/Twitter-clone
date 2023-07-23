import { FC } from 'react';

import { useAppDispatch } from '../hooks/redux-hooks';
import {
  toggleComposeTweet,
  toggleAuthModal,
  toggleCreateReplyPopup,
  closeLikedByPopup,
  closeEditProfilePopup,
} from '../features/ui/ui.slice';
import { clearCreateReplyPopupData } from '../features/reply/reply.slice';

interface DarkOverlayProps {
  isComposeTweetShown: boolean;
  isAuthModalShown: boolean;
  isCreateReplyPopupShown: boolean;
  isLikedByPopupShown: boolean;
  isEditProfileShown: boolean;
}

const DarkOverlay: FC<DarkOverlayProps> = ({
  isComposeTweetShown,
  isAuthModalShown,
  isCreateReplyPopupShown,
  isLikedByPopupShown,
  isEditProfileShown,
}) => {
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    if (isComposeTweetShown) {
      dispatch(toggleComposeTweet());
    } else if (isAuthModalShown) {
      dispatch(toggleAuthModal(''));
    } else if (isCreateReplyPopupShown) {
      dispatch(clearCreateReplyPopupData());
      dispatch(toggleCreateReplyPopup(false));
    } else if (isLikedByPopupShown) {
      dispatch(closeLikedByPopup());
    } else if (isEditProfileShown) {
      dispatch(closeEditProfilePopup());
    }
  };

  return (
    <div
      onClick={handleCloseModal}
      className='fixed top-0 left-0 z-40 w-full h-full bg-[#1c1c1cd9]'
    ></div>
  );
};

export default DarkOverlay;
