import { FC } from 'react';

interface InputErrorMessageProps {
  message: string;
}

const InputErrorMessage: FC<InputErrorMessageProps> = ({ message }) => {
  return <span className='mt-3 text-[13px] text-red-500'>{message}</span>;
};

export default InputErrorMessage;
