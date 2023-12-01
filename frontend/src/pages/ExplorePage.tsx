import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import {
  selectTrendingList,
  getTrendingList,
} from '../features/trending/trending.slice';

import TrendingList from '../features/trending/TrendingList';

const ExplorePage = () => {
  const dispatch = useAppDispatch();
  const trendingData = useAppSelector(selectTrendingList);

  useEffect(() => {
    dispatch(getTrendingList({ type: 'trending-list' }));
  }, [dispatch]);

  return (
    <>
      <h2 className='text-xl font-bold px-4 py-3'>Trending</h2>
      <TrendingList trendingData={trendingData} />
    </>
  );
};

export default ExplorePage;
