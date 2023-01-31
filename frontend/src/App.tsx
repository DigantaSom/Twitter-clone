import { Routes, Route } from 'react-router-dom';

import { useAppSelector } from './hooks/redux-hooks';
import {
  selectAuthModal,
  selectIsComposeTweetShown,
} from './features/ui/ui.slice';
import { selectIsAuthenticated } from './features/auth/auth.slice';

import PersistLogin from './features/auth/PersistLogin';

import HomePage from './pages/HomePage';
import Feed from './components/Feed';
import Explore from './components/Explore';

import TweetPage from './pages/TweetPage';

import AuthModal from './features/auth/AuthModal';
import DarkOverlay from './components/DarkOverlay';
import TweetComposeButton from './components/TweetComposeButton';
import ComposeTweet from './features/tweet/ComposeTweet';
import BottomNavigation from './components/BottomNavigation';
import BottomAuth from './components/BottomAuth';
import TweetPhotoPage from './pages/TweetPhotoPage';

const App = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isComposeTweetShown = useAppSelector(selectIsComposeTweetShown);
  const authModal = useAppSelector(selectAuthModal);

  return (
    <div className='relative'>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route path='/' element={<HomePage />}>
            <Route index element={isAuthenticated ? <Feed /> : <Explore />} />
            <Route path=':username/status/:tweetId' element={<TweetPage />} />
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

      {(isComposeTweetShown || authModal.isShown) && <DarkOverlay />}

      {isAuthenticated && (
        <div className='ph:hidden absolute bottom-20 right-2 ph_sm:right-4 z-30'>
          <TweetComposeButton from='App' />
        </div>
      )}

      {isComposeTweetShown && (
        <div className='absolute z-50 top-0 left-0 ph:top-8 ph:left-[50%] ph:-translate-x-[50%]'>
          <ComposeTweet />
        </div>
      )}

      {isAuthenticated && <BottomNavigation />}

      {!isAuthenticated && <BottomAuth />}
    </div>
  );
};

export default App;
