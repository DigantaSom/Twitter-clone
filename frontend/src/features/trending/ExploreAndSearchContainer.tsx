import { Outlet } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';

const ExploreAndSearchContainer = () => {
  return (
    <div className='flex flex-col'>
      <div className='px-4 pt-1 pb-2 sticky top-0 z-10 bg-white'>
        <SearchBar />
      </div>

      <Outlet />
    </div>
  );
};

export default ExploreAndSearchContainer;
