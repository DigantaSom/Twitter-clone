import { Link } from 'react-router-dom';

import { BiHomeCircle } from 'react-icons/bi';
import { GrSearch } from 'react-icons/gr';
import { HiOutlineBell } from 'react-icons/hi';
import { TbMessages } from 'react-icons/tb';

const BottomNavigation = () => {
  return (
    <div className='ph:hidden absolute bottom-0 z-30 bg-white border-t-2 border-gray-200 w-full'>
      <div className='h-12 flex items-center justify-around'>
        <Link to='/' className='rounded-full hover:bg-gray-200'>
          <BiHomeCircle className='text-3xl' />
        </Link>
        <Link to='#' className='rounded-full hover:bg-gray-200'>
          <GrSearch className='text-3xl' />
        </Link>
        <Link to='#' className='rounded-full hover:bg-gray-200'>
          <HiOutlineBell className='text-3xl' />
        </Link>
        <Link to='#' className='rounded-full hover:bg-gray-200'>
          <TbMessages className='text-3xl' />
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;
