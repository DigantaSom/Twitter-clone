import jwtDecode from 'jwt-decode';

import { TokenPayload } from '../types';
import { useAppSelector } from './redux-hooks';
import { selectCurrentToken } from '../features/auth/auth.slice';

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken);

  if (token) {
    const decoded: TokenPayload = jwtDecode(token);
    return { isAuth: true, ...decoded.user };
  }
  return { isAuth: false };
};

export default useAuth;
