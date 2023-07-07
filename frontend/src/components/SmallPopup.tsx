// The positioning of this container is done on its above div.

import { FC } from 'react';

interface SmallPopupProps {
  children: JSX.Element | JSX.Element[];
}

const SmallPopup: FC<SmallPopupProps> = ({ children }) => {
  return (
    <div className='bg-white shadow-xl rounded-lg font-bold overflow-hidden'>
      {children}
    </div>
  );
};

export default SmallPopup;
