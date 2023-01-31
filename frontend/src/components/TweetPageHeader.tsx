import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const TweetPageHeader = () => {
  const navigate = useNavigate();

  const handleClickGoBack = () => {
    navigate('/');
  };

  return (
    <div
      className='flex items-center space-x-6 sticky top-0 z-30 bg-white opacity-95 
      h-12 px-2 ph_sm:px-4'
    >
      <div
        onClick={handleClickGoBack}
        className='w-9 h-9 p-1 -ml-2 flex items-center justify-center rounded-full 
      hover:bg-gray-200 hover:cursor-pointer'
      >
        <IoArrowBack className='text-2xl text-gray-700' />
      </div>
      <h2 className='font-bold text-lg ph:text-xl -mt-[2px]'>Tweet</h2>
    </div>
  );
};

export default TweetPageHeader;
