import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';
import { BsTwitter } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { AuthModalType } from '../ui/ui.types';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { useLoginMutation } from './auth.api-slice';
import { setCredentials } from './auth.slice';
import { toggleAuthModal } from '../ui/ui.slice';

import CustomLoadingSpinner from '../../components/CustomLoadingSpinner';
import SignUpForm from './SignUpForm';
import InputErrorMessage from '../../components/InputErrorMessage';

interface AuthModalProps {
  modalType: AuthModalType;
}

const AuthModal: FC<AuthModalProps> = ({ modalType }) => {
  const dispatch = useAppDispatch();

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (modalType === 'login') {
      usernameInputRef.current?.focus();
    } else if (modalType === 'login-form') {
      passwordInputRef.current?.focus();
    }
  }, [modalType]);

  if (isLoading) {
    return <CustomLoadingSpinner marginTopClass='mt-[25vh]' color='white' />;
  }

  const handleClickBackArrow = () => {
    setIsPasswordVisible(false);
    dispatch(toggleAuthModal('login'));
  };

  const handleClickNext = () => {
    if (username !== '') {
      dispatch(toggleAuthModal('login-form'));
    }
  };

  const handleClickLogin = async () => {
    if (username !== '' && password !== '') {
      try {
        const { accessToken } = await login({
          handle: username,
          password,
        }).unwrap();
        setUsername('');
        setPassword('');
        dispatch(setCredentials({ accessToken }));
        dispatch(toggleAuthModal(''));
      } catch (err: any) {
        console.log(err);
        let errMsg = '';

        if (!err.status) {
          errMsg = 'No Server Response';
        } else {
          errMsg = err.data?.message;
        }
        alert(errMsg);
      }
    }
  };

  const onKeyUpUsernameInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClickNext();
    }
  };
  const onKeyUpPasswordInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClickLogin();
    }
  };

  return (
    <div
      className='w-screen h-screen ph:w-[90vw] ph:h-full sm:w-[600px] bg-white p-4 pb-8 
      ph:rounded-2xl'
    >
      {modalType === 'signup-form' && <SignUpForm />}

      {(modalType === 'signup' ||
        modalType === 'login' ||
        modalType === 'login-form') && (
        <div>
          {/* Header */}
          <div className='flex items-center'>
            {/* 0.75rem is deducted from here as the superparent div of this comopenent has 'p-3' class */}
            <div className='w-[calc(50%-0.75rem)]'>
              <div className='w-8 h-8 p-1 -ml-1 flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                {modalType === 'login-form' ? (
                  <IoArrowBack
                    className='text-2xl text-gray-700'
                    onClick={handleClickBackArrow}
                  />
                ) : (
                  <IoCloseSharp
                    className='text-2xl text-gray-700'
                    onClick={() => dispatch(toggleAuthModal(''))}
                  />
                )}
              </div>
            </div>
            <div className='w-[50%]'>
              <BsTwitter className='text-3xl text-twitter' />
            </div>
          </div>

          {/* Body */}
          <div className='mt-8 mx-auto w-[90%] ph:w-[75%]'>
            <h1 className='text-3xl font-bold'>
              {modalType === 'signup' && 'Join Twitter today'}
              {modalType === 'login' && 'Sign in to Twitter'}
              {modalType === 'login-form' && 'Enter your password'}
            </h1>

            {/* SignUp or Login(handle) modal only */}
            {(modalType === 'signup' || modalType === 'login') && (
              <div className='mt-8'>
                <div
                  onClick={() => {}}
                  className='hover:bg-gray-200 border-[1px] border-gray-300 flex items-center justify-center p-2 space-x-2 hover:cursor-pointer rounded-full'
                >
                  <FcGoogle className='text-2xl' />
                  <p className='font-semibold'>
                    {modalType === 'signup' && 'Sign up with Google'}
                    {modalType === 'login' && 'Sign in with Google'}
                  </p>
                </div>

                <div className='my-4 flex items-center space-x-2'>
                  <hr className='w-full' />
                  <span className='text-[15px]'>or</span>
                  <hr className='w-full' />
                </div>

                {modalType === 'signup' && (
                  <>
                    <button
                      onClick={() => dispatch(toggleAuthModal('signup-form'))}
                      className='mb-6 bg-black text-white font-semibold w-full p-2 rounded-full hover:opacity-80'
                    >
                      Sign up with phone or email
                    </button>

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
                  </>
                )}

                {modalType === 'login' && (
                  <>
                    <input
                      ref={usernameInputRef}
                      type='text'
                      placeholder='Username or Twitter Handle'
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className='border-[1px] border-gray-200 w-full p-4 rounded-md 
                    focus:outline-twitter'
                      onKeyUp={onKeyUpUsernameInput}
                    />
                    {username === '' && (
                      <InputErrorMessage message='Username must not be empty' />
                    )}
                    <button
                      onClick={handleClickNext}
                      disabled={username === ''}
                      className={`my-6 bg-black text-white font-semibold w-full p-2 rounded-full hover:opacity-80 ${
                        username === '' &&
                        'opacity-50 hover:opacity-50 hover:cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                    <button
                      onClick={() => {}}
                      className='hover:bg-gray-200 border-[1px] border-x-gray-300 w-full p-2 
                      rounded-full'
                    >
                      Forgot password?
                    </button>
                  </>
                )}

                {modalType === 'signup' && (
                  <p className='mt-10 text-gray-500 text-[15px]'>
                    Have an account already?{' '}
                    <span
                      onClick={() => dispatch(toggleAuthModal('login'))}
                      className='text-twitter hover:underline hover:cursor-pointer'
                    >
                      Log in
                    </span>
                  </p>
                )}
                {modalType === 'login' && (
                  <p className='mt-10 text-gray-500 text-[15px]'>
                    Don't have an account?{' '}
                    <span
                      onClick={() => dispatch(toggleAuthModal('signup'))}
                      className='text-twitter hover:underline hover:cursor-pointer'
                    >
                      Sign up
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Login modal(password) */}
            {modalType === 'login-form' && (
              <div className='mt-8'>
                <div>
                  <div
                    onClick={handleClickBackArrow}
                    className='bg-gray-100 border-[1px] border-gray-200 w-full p-4 mb-2 rounded-md focus:outline-none hover:cursor-text'
                  >
                    {username}
                  </div>
                  <div className='mt-2 mb-1 px-4 flex items-center justify-between w-full rounded-md overflow-hidden border-2 border-twitter'>
                    <input
                      ref={passwordInputRef}
                      type={isPasswordVisible ? 'text' : 'password'}
                      placeholder='Password'
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className='py-4 w-[90%] border-none outline-none'
                      required
                      onKeyUp={onKeyUpPasswordInput}
                    />
                    <div
                      onClick={() =>
                        setIsPasswordVisible(prevState => !prevState)
                      }
                      className='text-xl rounded-full p-[2px] hover:bg-gray-200 hover:cursor-pointer'
                    >
                      {isPasswordVisible ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </div>
                  </div>
                  {password.length < 5 && (
                    <InputErrorMessage message='Password should be at least 5 characters long' />
                  )}
                </div>

                <div className='mt-8'>
                  <button
                    onClick={handleClickLogin}
                    className={`bg-black text-white font-semibold w-full p-2 rounded-full hover:opacity-80 mb-3 ${
                      password === '' &&
                      'opacity-60 hover:opacity-60 hover:cursor-not-allowed'
                    }`}
                  >
                    Login
                  </button>
                  <p className='text-gray-500 text-[15px]'>
                    Don't have an account?{' '}
                    <span
                      onClick={() => dispatch(toggleAuthModal('signup'))}
                      className='text-twitter hover:underline hover:cursor-pointer'
                    >
                      Sign up
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
