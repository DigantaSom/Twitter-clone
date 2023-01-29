import jwtDecode from 'jwt-decode';

import { TokenPayload } from '../types';
import { useAppSelector } from './redux-hooks';
import { selectCurrentToken } from '../features/auth/auth.slice';

const useAuth = (): TokenPayload => {
  const token = useAppSelector(selectCurrentToken);

  if (token) {
    const decoded: TokenPayload = jwtDecode(token);
    return { user: decoded.user };
  }
  return { user: null };
};

export default useAuth;
