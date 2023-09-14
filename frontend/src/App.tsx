import { Routes, Route } from 'react-router-dom';

import { useAppSelector } from './hooks/redux-hooks';
import {
  selectAuthModal,
  selectIsComposeTweetShown,
  selectIsCreateReplyPopupShown,
  selectIsLikedByPopupShown,
  selectIsRetweetedByPopupShown,
  selectIsQuoteTweetPopupShown,
  selectIsEditProfilePopupShown,
  selectIsPhoneSideNavigationShown,
} from './features/ui/ui.slice';
import { selectIsAuthenticated } from './features/auth/auth.slice';
import { selectToastMessage } from './features/toast/toast.slice';

import PersistLogin from './features/auth/PersistLogin';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TweetPage from './pages/TweetPage';
import TweetPhotoPage from './pages/TweetPhotoPage';
import ProfilePhotosPage from './pages/ProfilePhotosPage';
import BookmarksPage from './pages/BookmarksPage';
import FollowPage from './pages/FollowPage';
import QuotesPage from './pages/QuotesPage';

import Feed from './components/Feed';
import AuthModal from './features/auth/AuthModal';
import BottomAuth from './components/BottomAuth';
import DarkOverlay from './components/DarkOverlay';
import ComposeTweet from './features/tweet/ComposeTweet';
import PhoneBottomNavigation from './components/PhoneBottomNavigation';
import PhoneSideNavigation from './components/PhoneSideNavigation';
import CreateReplyPopup from './features/reply/CreateReplyPopup';
import QuoteTweetPopup from './features/tweet/QuoteTweetPopup';
import LikedByPopup from './features/tweet/LikedByPopup';
import RetweetedByPopup from './features/tweet/RetweetedByPopup';
import EditProfilePopup from './features/user/EditProfilePopup';
import ToastMessage from './features/toast/ToastMessage';
import Explore from './components/Explore';
import ProfileTweetsContainer from './features/user/ProfileTweetsContainer';
import ProfileRepliesContainer from './features/user/ProfileRepliesContainer';
import ProfileMediaContainer from './features/user/ProfileMediaContainer';
import ProfileLikesContainer from './features/user/ProfileLikesContainer';
import MutualFollowerList from './features/user/MutualFollowerList';
import FollowerList from './features/user/FollowerList';
import FollowingList from './features/user/FollowingList';

const App = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isComposeTweetShown = useAppSelector(selectIsComposeTweetShown);
  const authModal = useAppSelector(selectAuthModal);
  const isCreateReplyPopupShown = useAppSelector(selectIsCreateReplyPopupShown);
  const isLikedByPopupShown = useAppSelector(selectIsLikedByPopupShown);
  const isRetweetedByPopupShown = useAppSelector(selectIsRetweetedByPopupShown);
  const isQuoteTweetPopupShown = useAppSelector(selectIsQuoteTweetPopupShown);
  const isEditProfileShown = useAppSelector(selectIsEditProfilePopupShown);
  const toastMessage = useAppSelector(selectToastMessage);
  const is_PhoneSideNavigation_Shown = useAppSelector(
    selectIsPhoneSideNavigationShown
  );

  return (
    <div className='relative'>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route path='/' element={<HomePage />}>
            <Route index element={<Feed />} />

            <Route path=':username'>
              <Route element={<ProfilePage />}>
                <Route index element={<ProfileTweetsContainer />} />
                <Route
                  path='with_replies'
                  element={<ProfileRepliesContainer />}
                />
                <Route path='media' element={<ProfileMediaContainer />} />
                <Route path='likes' element={<ProfileLikesContainer />} />
              </Route>

              <Route element={<FollowPage />}>
                <Route
                  path='followers_you_follow'
                  element={<MutualFollowerList />}
                />
                <Route path='followers' element={<FollowerList />} />
                <Route path='following' element={<FollowingList />} />
              </Route>

              <Route path='status/:tweetId'>
                <Route
                  index
                  element={<TweetPage from='App' isHeaderNeeded={true} />}
                />
                <Route path='quotes' element={<QuotesPage />} />
              </Route>
            </Route>

            <Route path='explore' element={<Explore />} />

            <Route path='bookmarks' element={<BookmarksPage />} />
          </Route>

          <Route
            path='/:username/status/:tweetId/photo/:photoIndex'
            element={<TweetPhotoPage />}
          />

          <Route path='/:username/photo' element={<ProfilePhotosPage />} />
          <Route
            path='/:username/header_photo'
            element={<ProfilePhotosPage />}
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
        isCreateReplyPopupShown ||
        isQuoteTweetPopupShown ||
        isLikedByPopupShown ||
        isRetweetedByPopupShown ||
        isEditProfileShown ||
        is_PhoneSideNavigation_Shown) && (
        <DarkOverlay
          isComposeTweetShown={isComposeTweetShown}
          isAuthModalShown={authModal.isShown}
          isCreateReplyPopupShown={isCreateReplyPopupShown}
          isQuoteTweetPopupShown={isQuoteTweetPopupShown}
          isLikedByPopupShown={isLikedByPopupShown}
          isRetweetedByPopupShown={isRetweetedByPopupShown}
          isEditProfileShown={isEditProfileShown}
          is_PhoneSideNavigation_Shown={is_PhoneSideNavigation_Shown}
        />
      )}

      {isComposeTweetShown && (
        <div className='absolute z-50 top-0 left-0 ph:top-8 ph:left-[50%] ph:-translate-x-[50%]'>
          <ComposeTweet />
        </div>
      )}

      {isCreateReplyPopupShown && <CreateReplyPopup />}

      {isQuoteTweetPopupShown && <QuoteTweetPopup />}

      {isLikedByPopupShown && <LikedByPopup />}

      {isRetweetedByPopupShown && <RetweetedByPopup />}

      {isEditProfileShown && <EditProfilePopup />}

      {/* z-40 and it won't be visible from 'ph' screen size onwards */}
      <PhoneSideNavigation />

      {/* z-30 and it won't be visible from 'ph' screen size onwards */}
      {isAuthenticated && <PhoneBottomNavigation />}

      {!isAuthenticated && <BottomAuth />}

      {toastMessage && <ToastMessage />}
    </div>
  );
};

export default App;
