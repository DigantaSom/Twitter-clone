import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { IoArrowBack } from 'react-icons/io5';

import SearchBar from '../ui/SearchBar';

const ExploreAndSearchContainer = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const src = searchParams.get('src');

  const handleClickGoBack = () => {
    if (src === 'explore') {
      navigate('/explore', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='sticky top-0 z-10 bg-white flex items-center justify-between h-14 px-3'>
        {pathname === '/search' && (
          <div
            onClick={handleClickGoBack}
            className='w-10 h-9 -ml-1 mr-2 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'
          >
            <IoArrowBack className='text-2xl text-gray-700' />
          </div>
        )}

        <SearchBar src='explore' />
      </div>

      <Outlet />
    </div>
  );
};

export default ExploreAndSearchContainer;
