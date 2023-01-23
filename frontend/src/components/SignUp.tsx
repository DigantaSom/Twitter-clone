import { Link } from 'react-router-dom';

import { FcGoogle } from 'react-icons/fc';
import { FiMoreHorizontal } from 'react-icons/fi';

import { useAppDispatch } from '../hooks/redux-hooks';
import { toggleAuthModal } from '../features/ui/ui.slice';

const SignUp = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <div className='border-[1px] border-gray-100 rounded-2xl p-4'>
        <div className='w-full xl:w-[85%]'>
          <h2 className='font-bold text-xl mb-3'>New to Twitter?</h2>
          <p className='text-[13px] text-gray-500'>
            Sign up now to get your own personalized timeline!
          </p>

          {/* Sign Up buttons */}
          <div className='my-4 flex flex-col space-y-3'>
            <div
              onClick={() => {}}
              className='hover:bg-gray-200 border-[1px] border-gray-300 flex items-center justify-center p-2 space-x-2 hover:cursor-pointer rounded-full'
            >
              <FcGoogle className='text-2xl' />
              <p className='font-semibold'>Sign up with Google</p>
            </div>
            <div
              onClick={() => dispatch(toggleAuthModal('signup'))}
              className='hover:bg-gray-200 border-[1px] border-gray-300 p-2 space-x-2 hover:cursor-pointer rounded-full'
            >
              <p className='font-semibold text-center'>
                Sign up with phone or email
              </p>
            </div>
          </div>

          <p className='text-[13px] text-gray-500'>
            By signing up, you agree to the{' '}
            <Link to='#' className='text-twitter'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to='#' className='text-twitter'>
              Privacy Policy
            </Link>
            , including{' '}
            <Link to='#' className='text-twitter'>
              Cookie Use.
            </Link>
          </p>
        </div>
      </div>

      <div className='w-[85%] text-[13px] text-gray-600 my-4 ml-4'>
        <div className='flex items-center flex-wrap'>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Terms of Service
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Privacy Policy
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Cookie Policy
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Accessibility
          </Link>
          <Link to='/' className='pr-2 hover:underline pb-1'>
            Ads info
          </Link>
          <Link to='/' className='flex items-center hover:underline pb-1'>
            <span>More</span>
            <FiMoreHorizontal className='pl-1 pt-[3px]' />
          </Link>
        </div>
        <span>
          &copy; {new Date().getFullYear()} Twitter Clone, Diganta Som.
        </span>
      </div>
    </>
  );
};

export default SignUp;
