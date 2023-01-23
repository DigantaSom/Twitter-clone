import { useAppDispatch } from '../hooks/redux-hooks';
import { toggleAuthModal } from '../features/ui/ui.slice';

const BottomAuth = () => {
  const dispatch = useAppDispatch();

  return (
    <div className='absolute bottom-0 z-30 px-4 py-3 w-full bg-white border-t-2 border-gray-100 ph:bg-twitter ph:border-0'>
      <div className='w-[90vw] lg:max-w-[70vw] mx-auto flex items-center justify-between'>
        <div className='hidden md:block'>
          <h2 className='font-bold text-white text-2xl'>
            Don't miss what's happening
          </h2>
          <p className='text-white text-lg'>
            People on Twitter are the first to know.
          </p>
        </div>

        <div className='flex items-center space-x-3 w-full md:w-auto'>
          <button
            onClick={() => dispatch(toggleAuthModal('login'))}
            className='bg-white ph:bg-transparent text-twitter ph:text-white text-sm 
            font-semibold py-[6px] px-5 rounded-full w-full md:w-auto border-[1px] border-gray-200 border-opacity-100 ph:border-white ph:border-opacity-40'
          >
            Log in
          </button>
          <button
            onClick={() => dispatch(toggleAuthModal('signup'))}
            className='bg-twitter ph:bg-white text-white ph:text-black text-sm font-semibold 
            py-[6px] px-5 rounded-full w-full md:w-auto'
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomAuth;
