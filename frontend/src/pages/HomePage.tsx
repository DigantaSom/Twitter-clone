import { Outlet } from 'react-router-dom';

import { useAppSelector } from '../hooks/redux-hooks';
import { selectIsAuthenticated } from '../features/auth/auth.slice';

import Navigation from '../components/Navigation';
import Trending from '../features/trending/Trending';
import SignUp from '../components/SignUp';
import Explore from '../components/Explore';

const HomePage = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <div className='max-w-[664px] lg2:max-w-[90vw] xl:max-w-7xl m-auto flex h-screen'>
      <div className='hidden ph:block w-16 xl:w-[20%]'>
        <Navigation />
      </div>
      <div className='flex-1 xl:w-[75%] flex'>
        <div className='w-full md:min-w-[600px] overflow-y-scroll ph:border-x-[1px] ph:border-gray-200'>
          <div>{isAuthenticated ? <Outlet /> : <Explore />}</div>
        </div>
        <div className='hidden lg2:block w-full pl-6 lg:pl-3 pb-14 overflow-y-scroll'>
          {isAuthenticated ? <Trending /> : <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
