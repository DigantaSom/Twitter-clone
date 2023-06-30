import { Routes, Route } from 'react-router-dom';

import { useAppSelector } from './hooks/redux-hooks';
import {
  selectAuthModal,
  selectIsComposeTweetShown,
  selectIsCreateReplyPopupShown,
} from './features/ui/ui.slice';
import { selectIsAuthenticated } from './features/auth/auth.slice';
import { selectToastMessage } from './features/toast/toast.slice';

import PersistLogin from './features/auth/PersistLogin';

import HomePage from './pages/HomePage';
import TweetPage from './pages/TweetPage';
import TweetPhotoPage from './pages/TweetPhotoPage';

import Feed from './components/Feed';
import AuthModal from './features/auth/AuthModal';
import DarkOverlay from './components/DarkOverlay';
import TweetComposeButton from './components/TweetComposeButton';
import ComposeTweet from './features/tweet/ComposeTweet';
import BottomNavigation from './components/BottomNavigation';
import BottomAuth from './components/BottomAuth';
import CreateReplyPopup from './features/reply/CreateReplyPopup';
import ToastMessage from './features/toast/ToastMessage';

const App = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isComposeTweetShown = useAppSelector(selectIsComposeTweetShown);
  const authModal = useAppSelector(selectAuthModal);
  const isCreateReplyPopupShown = useAppSelector(selectIsCreateReplyPopupShown);
  const toastMessage = useAppSelector(selectToastMessage);

  return (
    <div className='relative'>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route path='/' element={<HomePage />}>
            <Route index element={<Feed />} />
            <Route
              path=':username/status/:tweetId'
              element={<TweetPage from='App' isHeaderNeeded={true} />}
            />
          </Route>
          <Route
            path=':username/status/:tweetId/photo/:photoIndex'
            element={<TweetPhotoPage />}
          />
        </Route>
      </Routes>

      {authModal.isShown && (
        <div className='absolute z-50 top-0 bottom-0 ph:top-10 ph:bottom-10 left-0 ph:left-[50%] ph:-translate-x-[50%]'>
          <AuthModal modalType={authModal.type} />
        </div>
      )}

      {(isComposeTweetShown ||
        authModal.isShown ||
        isCreateReplyPopupShown) && (
        <DarkOverlay
          isComposeTweetShown={isComposeTweetShown}
          isAuthModalShown={authModal.isShown}
          isCreateReplyPopupShown={isCreateReplyPopupShown}
        />
      )}

      {isAuthenticated && (
        <div
          className={`ph:hidden absolute ${
            toastMessage ? 'bottom-24' : 'bottom-20'
          } right-2 ph_sm:right-4 z-30`}
        >
          <TweetComposeButton from='App' />
        </div>
      )}

      {isComposeTweetShown && (
        <div className='absolute z-50 top-0 left-0 ph:top-8 ph:left-[50%] ph:-translate-x-[50%]'>
          <ComposeTweet />
        </div>
      )}

      {isCreateReplyPopupShown && <CreateReplyPopup />}

      {isAuthenticated && <BottomNavigation />}

      {!isAuthenticated && <BottomAuth />}

      {toastMessage && <ToastMessage />}
    </div>
  );
};

export default App;
