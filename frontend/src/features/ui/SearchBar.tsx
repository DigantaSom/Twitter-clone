import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { GrSearch } from 'react-icons/gr';
import { IoCloseSharp } from 'react-icons/io5';

const SearchBar = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.length > 3) {
      let t = text;
      const firstLetter = text[0];
      if (firstLetter === '#') {
        t = text.substring(1);
      }
      navigate(`/search?q=${t}`);

      setText('');
    }
  };

  return (
    <div className='w-full flex items-center px-4 bg-gray-100 rounded-full'>
      <GrSearch />
      <input
        type='text'
        placeholder='Search Twitter'
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyUp={onPressEnter}
        className='bg-gray-100 flex-1 py-2 px-3 focus:outline-none placeholder:text-gray-500'
      />
      {text !== '' && (
        <div
          onClick={() => setText('')}
          className='bg-twitter p-[1px] -mr-1 rounded-full hover:cursor-pointer hover:bg-twitter-dark'
        >
          <IoCloseSharp className='text-white' />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
