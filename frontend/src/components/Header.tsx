import { Link } from 'react-router-dom';
import { HiOutlineSparkles } from 'react-icons/hi';

import ProfilePicture from './ProfilePicture';

import constants from '../constants';

const Header = () => {
  return (
    <div
      className='flex items-center justify-between sticky top-0 z-30 bg-white opacity-90 
      h-12 px-2 ph_sm:px-4'
    >
      <Link to='/' className='flex items-center'>
        <div className='block ph:hidden mr-3'>
          <ProfilePicture uri={constants.placeholder_profilePicture} />
        </div>
        <span className='font-bold text-lg ph:text-xl -mt-1'>Home</span>
      </Link>

      <div
        className='w-8 h-8 ph_sm:w-10 ph_sm:h-10 rounded-full hover:bg-gray-200 hover:cursor-pointer 
        flex items-center justify-center'
      >
        <HiOutlineSparkles className='text-xl' />
      </div>
    </div>
  );
};

export default Header;
