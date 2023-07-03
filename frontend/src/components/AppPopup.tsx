import { FC } from 'react';

interface AppPopupProps {
  children: JSX.Element | JSX.Element[];
}

const AppPopup: FC<AppPopupProps> = ({ children }) => {
  return (
    <div className='fixed z-50 top-0 ph:top-20 bottom-0 ph:bottom-20 left-0 ph:left-[50%] ph:-translate-x-[50%] bg-white py-2 ph_xs:py-4 ph:rounded-2xl w-screen ph:w-[90vw] sm:w-[600px]'>
      <div className='h-full overflow-y-scroll relative flex flex-col'>
        {/* TODO: put the header here as well, for code reusability */}
        {children}
      </div>
    </div>
  );
};

export default AppPopup;
