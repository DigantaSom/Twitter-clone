import { FC } from 'react';

interface CustomButtonProps {
  title: string;
  onClick: () => void;
  bgColorClass: 'bg-black' | 'bg-white';
  textColorClass: 'text-white' | 'text-gray-700' | 'text-red-500';
  textSizeClass: 'text-xs ph:text-sm' | 'text-sm ph:text-base';
}

const CustomButton: FC<CustomButtonProps> = ({
  title,
  onClick,
  bgColorClass,
  textColorClass,
  textSizeClass,
}) => {
  let extraStyles = '';

  if (bgColorClass === 'bg-black') {
    extraStyles = 'hover:opacity-80';
  } else if (bgColorClass === 'bg-white') {
    if (textColorClass === 'text-red-500') {
      extraStyles = 'border-[1px] border-red-300 hover:bg-red-100';
    } else if (textColorClass === 'text-gray-700') {
      extraStyles = 'border-[1px] border-gray-400 hover:bg-gray-200';
    }
  }

  return (
    <button
      onClick={onClick}
      className={`${bgColorClass} ${textColorClass} ${textSizeClass} font-bold rounded-full 
      px-[10px] ph:px-4 h-9 select-none hover:cursor-pointer ${extraStyles}`}
    >
      {title}
    </button>
  );
};

export default CustomButton;
