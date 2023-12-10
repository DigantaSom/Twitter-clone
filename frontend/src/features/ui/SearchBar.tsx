import { useState, KeyboardEvent, memo, FC, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { GrSearch } from 'react-icons/gr';
import { IoCloseSharp } from 'react-icons/io5';

interface SearchBarProps {
  src: 'trending' | 'explore';
}

const SearchBar: FC<SearchBarProps> = ({ src }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (pathname === '/search') {
      setText(searchParams.get('q') ?? '');
    } else {
      setText('');
    }
  }, [pathname, searchParams]);

  // handleSearch
  const onPressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.length >= 2) {
      if (src === 'trending') {
        navigate(`/search?src=home&q=${encodeURIComponent(text)}`);
      } else {
        navigate(`/search?src=explore&q=${encodeURIComponent(text)}`);
      }
    }
  };

  return (
    <div className='w-full flex items-center px-4 my-1 bg-gray-100 rounded-full'>
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

export default memo(SearchBar);
