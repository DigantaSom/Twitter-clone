import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { BsDot } from 'react-icons/bs';
import { FiMoreHorizontal } from 'react-icons/fi';

import { useAppDispatch } from '../../hooks/redux-hooks';
import { removeATrendingItem } from './trending.slice';

import { Trending_ListItem } from './trending.types';

import TrendItemMorePopup from './TrendItemMorePopup';

interface TrendingListProps {
  trendingData: Trending_ListItem[];
}

const TrendingList: FC<TrendingListProps> = ({ trendingData }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTrendId, setSelectedTrendId] = useState<number | undefined>();

  const handleSearch = (text: string) => {
    if (pathname === '/search') {
      navigate(`/search?src=explore&q=${encodeURIComponent(text)}`);
    } else {
      navigate(`/search?src=home&q=${encodeURIComponent(text)}`);
    }
  };

  const handleClickTrendingMore = (id: number) => {
    setSelectedTrendId(id);
    setShowPopup(prevState => !prevState);
  };

  const handleRemoveTrendItem = () => {
    if (selectedTrendId) {
      dispatch(removeATrendingItem({ itemId: selectedTrendId }));
      setSelectedTrendId(undefined);
    }
  };

  return (
    <>
      {trendingData.map(item => (
        <div
          key={item.id}
          className='relative p-4 flex items-start hover:bg-gray-200 hover:cursor-pointer'
        >
          <div
            onClick={() => handleSearch(item.title)}
            className='flex flex-col flex-1 space-y-1'
          >
            <div className='flex items-center space-x-1 text-[13px] text-gray-600'>
              {item.context && <span>{item.context}</span>}
              {(item.time || item.isTrending) && <BsDot />}
              {item.time && !item.isTrending && <span>{item.time}</span>}
              {item.isTrending && !item.time && <span>Trending</span>}
            </div>
            <span className='font-bold text-[15px] text-gray-700'>
              {item.title}
            </span>
            {item.numberOfTweets && (
              <span className='text-[13px] text-gray-600'>
                {item.numberOfTweets} Tweets
              </span>
            )}
          </div>

          <div className='max-w-[25%]'>
            {item.image ? (
              <img src={item.image} width={68} height={68} alt='FIFA' />
            ) : (
              <div
                onClick={() => handleClickTrendingMore(item.id)}
                className='w-8 h-8 -mr-2 -mt-1 rounded-full hover:text-twitter hover:bg-twitter-light hover:cursor-pointer flex items-center justify-center'
              >
                <FiMoreHorizontal className='text-lg' />
              </div>
            )}
          </div>
          {showPopup && selectedTrendId === item.id && (
            <TrendItemMorePopup handleRemoveItem={handleRemoveTrendItem} />
          )}
        </div>
      ))}
    </>
  );
};

export default TrendingList;
