import { Outlet } from 'react-router-dom';

import Navigation from '../components/Navigation';
import Trending from '../components/Trending';
import SignUp from '../components/SignUp';

const HomePage = () => {
  const isAuthenticated = false; // TODO: dynamic

  return (
    <div className='max-w-[664px] md2:max-w-[90vw] xl:max-w-7xl m-auto flex h-screen'>
      <div className='hidden ph:block w-16 xl:w-[20%] border-r-[1px] border-gray-200'>
        <Navigation />
      </div>
      <div className='flex-1 xl:w-[75%] flex'>
        <div className='w-full md:min-w-[600px] overflow-y-scroll'>
          <div className='ph:border-r-[1px] ph:border-gray-200'>
            <Outlet />
          </div>
        </div>
        <div className='hidden md2:block w-full pl-6 lg:pl-3 pb-14 overflow-y-scroll'>
          {isAuthenticated ? <Trending /> : <SignUp />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
