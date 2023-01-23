import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import {
  selectIsComposeTweetShown,
  selectAuthModal,
  toggleComposeTweet,
  toggleAuthModal,
} from '../features/ui/ui.slice';

const DarkOverlay = () => {
  const isComposeTweetShown = useAppSelector(selectIsComposeTweetShown);
  const authModal = useAppSelector(selectAuthModal);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    if (isComposeTweetShown) {
      dispatch(toggleComposeTweet());
    } else if (authModal.isShown) {
      dispatch(toggleAuthModal(''));
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
