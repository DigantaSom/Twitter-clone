import { Link } from 'react-router-dom';

import { useAppSelector } from '../../hooks/redux-hooks';
import { selectToastMessage, selectToastType } from './toast.slice';

const ToastMessage = () => {
  const toastType = useAppSelector(selectToastType);
  const toastMessage = useAppSelector(selectToastMessage);

  return (
    <div className='flex justify-center'>
      <div
        className={`fixed z-100 bottom-12 w-full ph:w-fit bg-twitter text-white text-[15px] ph:rounded-lg flex items-center ${
          toastType === 'bookmark-add' ? 'justify-between' : 'justify-center'
        } px-4 h-11 shadow-lg`}
      >
        <span>{toastMessage}</span>

        {toastType === 'bookmark-add' && (
          <Link to='/bookmarks' className='ml-5 font-semibold hover:underline'>
            View
          </Link>
        )}
      </div>
    </div>
  );
};

export default ToastMessage;
