import { FC } from 'react';
import { CircleLoader } from 'react-spinners';

import constants from '../constants';

interface CustomLoadingSpinnerProps {
  marginTopClass: 'mt-0' | 'mt-[10vh]' | 'mt-[25vh]' | 'mt-[50vh]';
  color?: 'white'; // default is twitter-default blue
}

const CustomLoadingSpinner: FC<CustomLoadingSpinnerProps> = ({
  marginTopClass,
  color,
}) => {
  return (
    <div className={`flex items-center justify-center ${marginTopClass}`}>
      <CircleLoader
        color={color ?? constants.colors.twitter_default}
        size={40}
      />
    </div>
  );
};

export default CustomLoadingSpinner;
