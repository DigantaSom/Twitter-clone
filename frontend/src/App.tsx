import { Routes, Route } from 'react-router-dom';

import { useAppSelector } from './hooks/redux-hooks';
import {
  selectAuthModal,
  selectIsComposeTweetShown,
} from './features/ui/ui.slice';
import { selectIsAuthenticated } from './features/auth/auth.slice';

import HomePage from './pages/HomePage';
import Feed from './components/Feed';
import Explore from './components/Explore';
import AuthModal from './features/auth/AuthModal';
import DarkOverlay from './components/DarkOverlay';

const App = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isComposeTweetShown = useAppSelector(selectIsComposeTweetShown);
  const authModal = useAppSelector(selectAuthModal);

  return (
    <div className='relative'>
      <Routes>
        <Route path='/' element={<HomePage />}>
          <Route index element={isAuthenticated ? <Feed /> : <Explore />} />
        </Route>
      </Routes>

      {authModal.isShown && (
        <div className='absolute z-50 top-0 bottom-0 ph:top-10 ph:bottom-10 left-0 ph:left-[50%] ph:-translate-x-[50%]'>
          <AuthModal modalType={authModal.type} />
        </div>
      )}

      {(isComposeTweetShown || authModal.isShown) && <DarkOverlay />}
    </div>
  );
};

export default App;
