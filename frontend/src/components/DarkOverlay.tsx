import { FC, memo } from 'react';

import { useAppDispatch } from '../hooks/redux-hooks';
import {
  toggleComposeTweet,
  toggleAuthModal,
  toggleCreateReplyPopup,
  closeQuoteTweetPopup,
  closeLikedByPopup,
  closeRetweetedByPopup,
  closeEditProfilePopup,
  togglePhoneSideNavigation,
} from '../features/ui/ui.slice';
import { clearCreateReplyPopupData } from '../features/reply/reply.slice';

interface DarkOverlayProps {
  isComposeTweetShown: boolean;
  isAuthModalShown: boolean;
  isCreateReplyPopupShown: boolean;
  isQuoteTweetPopupShown: boolean;
  isLikedByPopupShown: boolean;
  isRetweetedByPopupShown: boolean;
  isEditProfileShown: boolean;
  is_PhoneSideNavigation_Shown: boolean;
}

const DarkOverlay: FC<DarkOverlayProps> = ({
  isComposeTweetShown,
  isAuthModalShown,
  isCreateReplyPopupShown,
  isQuoteTweetPopupShown,
  isLikedByPopupShown,
  isRetweetedByPopupShown,
  isEditProfileShown,
  is_PhoneSideNavigation_Shown,
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
    } else if (isQuoteTweetPopupShown) {
      dispatch(closeQuoteTweetPopup());
    } else if (isLikedByPopupShown) {
      dispatch(closeLikedByPopup());
    } else if (isRetweetedByPopupShown) {
      dispatch(closeRetweetedByPopup());
    } else if (isEditProfileShown) {
      dispatch(closeEditProfilePopup());
    } else if (is_PhoneSideNavigation_Shown) {
      dispatch(togglePhoneSideNavigation());
    }
  };

  return (
    <div
      onClick={handleCloseModal}
      className='fixed top-0 left-0 z-40 w-full h-full bg-[#1c1c1cd9]'
    ></div>
  );
};

export default memo(DarkOverlay);
