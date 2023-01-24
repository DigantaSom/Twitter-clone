import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

import { useAppSelector } from '../../hooks/redux-hooks';
import { useRefreshMutation } from './auth.api-slice';
import { selectIsAuthenticated } from './auth.slice';

const PersistLogin = () => {
  const persist = !!localStorage.getItem('persist');
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const effectRan = useRef(false);
  // trueSuccess is used to give enough time to set the credentials (auth.slice.js' setCredenitals action creator)
  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    // the outermost-if is to handle React 18 Strict Mode's double rendering issue in useEffect hook
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      const verifyRefreshToken = async () => {
        console.log('Verifying refresh token');
        try {
          await refresh(undefined);
          setTrueSuccess(true);
          console.log('Refresh token generation success');
        } catch (err) {
          console.log('Error verifying refresh token:', err);
        }
      };
      if (!isAuthenticated && persist) {
        verifyRefreshToken();
      }
    }

    return () => {
      effectRan.current = true;
    };

    // eslint-disable-next-line
  }, []);

  let content;

  if (!persist) {
    // persist: false
    content = <Outlet />;
  } else if (isLoading) {
    // persist: true, isAuthenticated: false
    content = <PulseLoader color='#FFF' />;
  } else if (isError) {
    // persist: true, isAuthenticated: false
    if (error && 'data' in error) {
      // FIXME: when we manually remove the 'jwt' cookie while being logged in, then the app breaks
      localStorage.removeItem('persist');
      content = <p>Please login again</p>;
    }
  } else if (isSuccess && trueSuccess) {
    // persist: true, isAuthenticated: true
    content = <Outlet />;
  } else if (isAuthenticated && isUninitialized) {
    // persist: true, isAuthenticated: true
    content = <Outlet />;
  }

  return content as JSX.Element;
};

export default PersistLogin;
