import { ChangeEvent, FC, memo, useState } from 'react';

interface FormInputProps {
  label: string;
  type: 'text' | 'textarea' | 'url';
  initialValue: string | undefined;
  maxLength: number;
  handleChange: (text: string) => void;
}

const FormInput: FC<FormInputProps> = ({
  label,
  type,
  initialValue,
  maxLength,
  handleChange,
}) => {
  const [text, setText] = useState(initialValue || '');

  const onChangeText = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setText(value);
      handleChange(value);
    }
  };

  return (
    <div className='relative my-6 border-2 border-gray-200 rounded-md focus-within:border-twitter overflow-hidden'>
      {/* Input */}
      {type !== 'textarea' ? (
        <input
          type={type}
          value={text}
          onChange={onChangeText}
          maxLength={maxLength}
          className='w-full p-2 mt-6 bg-white outline-none peer'
        />
      ) : (
        <textarea
          value={text}
          onChange={onChangeText}
          maxLength={maxLength}
          className='w-full p-2 mt-7 bg-white outline-none resize-none peer'
        />
      )}

      {/* Label */}
      <div
        className={`absolute top-5 left-2 peer-focus:top-2 peer-focus:text-sm 
        ${text.length > 0 && 'top-2 text-sm'} 
        text-gray-500 ease-in-out duration-200`}
      >
        {label}
      </div>

      {/* Letter counter */}
      <div
        className={`${
          text.length > 0 ? 'block' : 'hidden peer-focus:block'
        } absolute top-2 right-2 text-sm text-gray-500`}
      >
        {text.length} / {maxLength}
      </div>
    </div>
  );
};

export default memo(FormInput);
