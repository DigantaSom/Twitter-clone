import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { IoCloseSharp, IoArrowBack } from 'react-icons/io5';
import { GrStatusGood } from 'react-icons/gr';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { useAppDispatch } from '../../hooks/redux-hooks';
import { useSignUpMutation } from '../user/user.api-slice';
import { useGetDays, useGetYears } from '../../hooks/date-hooks';

import { MonthType } from '../../types';
import { setCredentials } from './auth.slice';
import { toggleAuthModal } from '../ui/ui.slice';

import CustomLoadingSpinner from '../../components/CustomLoadingSpinner';
import InputErrorMessage from '../../components/InputErrorMessage';

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const [phoneOrEmail, setPhoneOrEmail] = useState<'phone' | 'email'>('phone');
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [isDayDisabled, setIsDayDisabled] = useState(true);
  const [isPasswordError, setIsPasswordError] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(email?.split('@')[0].trim() || '');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();

  const yearsList = useGetYears();
  const daysList = useGetDays(selectedMonth as MonthType, +selectedYear);

  const [signUp, { isLoading }] = useSignUpMutation();

  const handleIncreaseStep = () => {
    setStep(prevState => prevState + 1);
  };

  const handleDecreaseStep = () => {
    setStep(prevState => prevState - 1);
  };

  const togglePhoneOrEmail = () => {
    if (phoneOrEmail === 'phone') {
      setPhoneOrEmail('email');
      setPhone('');
    } else if (phoneOrEmail === 'email') {
      setPhoneOrEmail('phone');
      setEmail('');
    }
  };

  const handleNextButtonDisabled = useCallback(() => {
    if (step === 1) {
      if (
        fullName === '' ||
        (phoneOrEmail === 'phone' && phone === '') ||
        (phoneOrEmail === 'email' && email === '') ||
        selectedMonth === '' ||
        selectedYear === '' ||
        selectedDay === ''
      ) {
        setIsNextButtonDisabled(true);
      } else {
        setIsNextButtonDisabled(false);
      }
    } else if (step === 4) {
      if (password.length < 5) {
        setIsNextButtonDisabled(true);
      } else {
        setIsNextButtonDisabled(false);
      }
    }
  }, [
    email,
    fullName,
    password,
    phone,
    phoneOrEmail,
    selectedDay,
    selectedMonth,
    selectedYear,
    step,
  ]);

  const handleClickNext = () => {
    if (step < 4) {
      handleIncreaseStep();
    } else if (step === 4) {
      handleSignUp();
    }
  };

  useEffect(() => {
    if (phoneOrEmail === 'email' && email.length) {
      setUsername(email.split('@')[0].trim());
    }
  }, [phoneOrEmail, email]);

  useEffect(() => {
    handleNextButtonDisabled();
  }, [
    handleNextButtonDisabled,
    step,
    fullName,
    phone,
    email,
    selectedMonth,
    selectedYear,
    selectedDay,
    password,
  ]);

  useEffect(() => {
    if (selectedMonth === '' && selectedYear === '') {
      setIsDayDisabled(true);
    } else {
      setIsDayDisabled(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (username.length < 5 || username.length > 15) {
      setIsUsernameInvalid(true);
    } else {
      setIsUsernameInvalid(false);
    }
  }, [username]);

  useEffect(() => {
    if (password.length < 5) {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }
  }, [password]);

  const handleSignUp = async () => {
    const birthday = new Date(
      selectedYear + '-' + selectedMonth + '-' + selectedDay
    ).toDateString();

    try {
      const res = await signUp({
        name: fullName,
        email,
        password,
        username,
        birthday,
      }).unwrap();

      if (res.isError) {
        console.log('Error signing in:', res);
        alert('Error signing in');
        return;
      }
      setFullName('');
      setUsername('');
      setSelectedDay('');
      setSelectedMonth('');
      setSelectedYear('');
      setPassword('');
      dispatch(setCredentials({ accessToken: res.accessToken }));
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
  };

  if (isLoading) return <CustomLoadingSpinner marginTopClass='mt-[25vh]' />;

  return (
    <div className='h-full'>
      {/* Header */}
      <div className='flex items-start h-[5%]'>
        <div className='w-8 h-8 p-1 -ml-1 -mt-[2px] flex items-center justify-center rounded-full hover:bg-gray-200 hover:cursor-pointer'>
          {step === 1 ? (
            <IoCloseSharp
              className='text-2xl text-gray-700'
              onClick={() => dispatch(toggleAuthModal(''))}
            />
          ) : (
            <IoArrowBack
              className='text-2xl text-gray-700'
              onClick={handleDecreaseStep}
            />
          )}
        </div>
        <div className='ml-8'>
          <span className='font-bold text-xl'>Step {step} of 4</span>
        </div>
      </div>

      <div className='pt-6 mx-auto w-[90%] ph:w-[75%] flex flex-col h-[95%]'>
        {/* Body for step 1 */}
        {step === 1 && (
          <>
            <h1 className='text-2xl ph_sm:text-3xl font-bold mb-8'>
              Create your account
            </h1>

            <div className='mb-6'>
              <input
                type='text'
                placeholder='Name'
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className='h-14 w-full px-4 mb-5 border-[1px] border-gray-300 rounded-[4px] 
                focus:outline-twitter'
                required
              />
              {phoneOrEmail === 'phone' ? (
                <input
                  type='number'
                  placeholder='Phone'
                  min='1000000000'
                  max='9999999999'
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className='h-14 w-full px-4 mb-2 border-[1px] border-gray-300 rounded-[4px] 
                  focus:outline-twitter'
                  required
                />
              ) : (
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='border-[1px] border-gray-300 w-full p-4 rounded-[4px] 
                focus:outline-twitter mb-2'
                  required
                />
              )}
              <div className='relative'>
                <p
                  onClick={togglePhoneOrEmail}
                  className='absolute right-0 text-twitter text-[15px] hover:underline hover:cursor-pointer'
                >
                  Use {phoneOrEmail === 'phone' ? 'email' : 'phone'} instead
                </p>
              </div>
            </div>

            <div>
              <span className='font-bold text-gray-800 text-[15px]'>
                Date of birth
              </span>
              <p className='mt-2 text-gray-500 text-[13px]'>
                This will not be shown publicly. Confirm your own age, even if
                this account is for a business, a pet, or something else.
              </p>
              <div className='mt-4 flex flex-col md:flex-row items-center space-y-2 md:space-x-3 md:space-y-0'>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className='w-full md:w-[50%] border-[1px] border-gray-300 p-4 
                  rounded-[4px] focus:outline-twitter'
                >
                  <option value='' disabled>
                    Month
                  </option>
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>

                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className='w-full md:w-[30%] border-[1px] border-gray-300 p-4 
                  rounded-[4px] focus:outline-twitter'
                >
                  <option value='' disabled>
                    Year
                  </option>
                  {yearsList.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}
                  disabled={isDayDisabled}
                  className='w-full md:w-[20%] border-[1px] border-gray-300 p-4 rounded-[4px] 
                  focus:outline-twitter'
                >
                  <option value='' disabled>
                    Day
                  </option>
                  {daysList.map(day => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className='text-left'>
                {isDayDisabled && (
                  <InputErrorMessage message='Month and Year must be selected before selecting Day' />
                )}
              </div>
            </div>
          </>
        )}

        {/* Body for step 2 */}
        {step === 2 && (
          <>
            <h1 className='text-3xl font-bold mb-8'>
              Customize your experience
            </h1>

            <div className='mb-8'>
              <h3 className='text-xl font-semibold'>
                Track where you see Twitter content across the web
              </h3>
              <div className='pt-4 pb-8 flex items-start'>
                <p>
                  Twitter uses this data to personalize your experience. This
                  web browsing history will never be stored with your name,
                  email, or phone number.
                </p>
                <input type='checkbox' defaultChecked className='w-6 h-6' />
              </div>
              <p>
                By signing up, you agree to our{' '}
                <Link to='#' className='text-twitter hover:underline'>
                  Terms
                </Link>
                ,{' '}
                <Link to='#' className='text-twitter hover:underline'>
                  Privacy Policy
                </Link>
                , and{' '}
                <Link to='#' className='text-twitter hover:underline'>
                  Cookie Use
                </Link>
                . Twitter may use your contact information, including your email
                address and phone number for purposes outlined in our Privacy
                Policy.{' '}
                <Link to='#' className='text-twitter hover:underline'>
                  Learn more
                </Link>
              </p>
            </div>
          </>
        )}

        {/* Body for step 3 */}
        {step === 3 && (
          <>
            <h1 className='text-3xl font-bold mb-4 -mt-2'>
              Create your account
            </h1>
            <div>
              <div
                onClick={() => setStep(1)}
                className='h-14 px-2 py-1 mb-4 border-[1px] border-gray-300 rounded-[4px] 
                focus:outline-twitter'
              >
                <div className='h-[35%] text-sm text-gray-500 pl-2'>Name</div>
                <div className='h-[65%] w-full flex items-center justify-between'>
                  <div className='w-[95%] h-full px-2 flex items-end'>
                    {fullName}
                  </div>
                  <div className='w-[5%]'>
                    <GrStatusGood />
                  </div>
                </div>
              </div>
              <div
                onClick={() => setStep(1)}
                className='h-14 px-2 py-1 mb-4 border-[1px] border-gray-300 rounded-[4px] 
                focus:outline-twitter flex flex-col'
              >
                <div className='h-[35%] text-sm text-gray-500 pl-2'>
                  {phoneOrEmail.charAt(0).toUpperCase() + phoneOrEmail.slice(1)}
                </div>
                <div className='h-[65%] w-full flex items-center justify-between'>
                  <div className='w-[95%] h-full px-2 flex items-end'>
                    {phoneOrEmail === 'phone' ? phone : email}
                  </div>
                  <div className='w-[5%]'>
                    <GrStatusGood />
                  </div>
                </div>
              </div>
              <div
                onClick={() => setStep(1)}
                className='h-14 px-2 py-1 mb-4 border-[1px] border-gray-300 rounded-[4px] 
                focus:outline-twitter'
              >
                <div className='h-[30%] text-sm text-gray-500 pl-2'>
                  Date of birth
                </div>
                <div className='h-[70%] w-full flex items-center justify-between'>
                  <div className='w-[95%] h-full px-2 flex items-end'>
                    {selectedMonth} {selectedDay}, {selectedYear}
                  </div>
                  <div className='w-[5%]'>
                    <GrStatusGood />
                  </div>
                </div>
              </div>
              <div
                className={`h-14 px-2 py-1 rounded-[4px] focus:outline-twitter flex flex-col 
                border-[1px] ${
                  isUsernameInvalid ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <div className='h-[35%] text-sm text-gray-500 pl-2'>
                  Username or Twitter Handle
                </div>
                <div className='h-[65%] w-full flex items-center justify-between'>
                  <div className='w-[95%] h-full px-2 flex items-end'>
                    <input
                      type='text'
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className='w-full outline-none'
                    />
                  </div>
                  <div className='w-[5%]'>
                    <GrStatusGood />
                  </div>
                </div>
              </div>
              {isUsernameInvalid && (
                <InputErrorMessage message='Username must be between 5 and 15 characters' />
              )}
            </div>
          </>
        )}

        {/* Body for step 4 */}
        {step === 4 && (
          <>
            <h1 className='text-3xl font-bold mb-3'>You'll need a password</h1>
            <p className='text-gray-600 mb-5'>
              Make sure it's 5 characters or more
            </p>
            <div
              className={`h-14 w-full px-4 rounded-[4px] flex items-center 
              border-[1px] ${
                isPasswordError ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='w-[95%] border-none outline-none'
                required
              />
              <div
                onClick={() => setIsPasswordVisible(prevState => !prevState)}
                className='text-xl rounded-full p-[2px] hover:bg-gray-200 hover:cursor-pointer'
              >
                {isPasswordVisible ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </div>
            </div>
            {isPasswordError && (
              <InputErrorMessage message='Password must be 5 or more characters' />
            )}
          </>
        )}

        <div className='flex-1 my-4'></div>

        {/* Footer for steps 1, 2 and 4 */}
        {(step === 1 || step === 2 || step === 4) && (
          <button
            onClick={handleClickNext}
            disabled={step === 2 ? false : isNextButtonDisabled}
            className={`mt-6 bg-black text-white font-semibold w-full py-3 px-2 rounded-full hover:opacity-80 hover:cursor-pointer ${
              isNextButtonDisabled &&
              'opacity-50 hover:opacity-50 hover:cursor-not-allowed'
            }`}
          >
            Next
          </button>
        )}

        {/* Footer only for step 3*/}
        {step === 3 && (
          <div className='mt-4'>
            <p className='text-xs text-gray-600'>
              By signing up, you agree to the{' '}
              <Link to='#' className='text-twitter hover:underline'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to='#' className='text-twitter hover:underline'>
                Privacy Policy
              </Link>
              , including{' '}
              <Link to='#' className='text-twitter hover:underline'>
                Cookie Use
              </Link>
              . Twitter may use your contact information, including your email
              address and phone number for purposes outlined in our Privacy
              Policy, like keeping your account secure and personalizing our
              services, including ads.{' '}
              <Link to='#' className='text-twitter hover:underline'>
                Learn more
              </Link>
              . Others will be able to find you by email or phone number, when
              provided, unless you choose otherwise{' '}
              <Link to='#' className='text-twitter hover:underline'>
                here
              </Link>
              .
            </p>
            <button
              onClick={handleIncreaseStep}
              disabled={isUsernameInvalid}
              className='mt-6 bg-twitter text-white font-semibold w-full py-3 px-2 rounded-full hover:bg-twitter-dark hover:cursor-pointer disabled:cursor-not-allowed  disabled:opacity-60 disabled:bg-twitter'
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpForm;
