import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetSearchedTweetsQuery } from '../features/tweet/tweet.api-slice';

import { SearchPageTab } from '../types';

import TweetList from '../features/tweet/TweetList';
import SearchedUsersList from '../features/user/SearchedUsersList';
import SearchedMediaTweets from '../features/tweet/SearchedMediaTweets';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get('q');
  const searchObject = searchParams.get('f'); // null means 'Tweets'; 'f=user' or 'f=media'
  // console.log(searchText, searchObject);

  const [selectedTab, setSelectedTab] = useState<SearchPageTab>('Tweets');

  const handleClickTweetsTab = useCallback(() => {
    if (searchObject) {
      searchParams.delete('f');
      setSearchParams(searchParams);
    }
  }, [searchObject, searchParams, setSearchParams]);

  useEffect(() => {
    if (searchObject === 'user') {
      setSelectedTab('People');
    } else if (searchObject === 'media') {
      setSelectedTab('Media');
    } else {
      handleClickTweetsTab(); // if a user manually changes the 'f' param to something different, other than either 'user' or 'media'
      setSelectedTab('Tweets');
    }
  }, [searchObject, handleClickTweetsTab]);

  const {
    data: tweets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSearchedTweetsQuery(
    { q: encodeURIComponent(searchText || '') },
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      skip: !searchText || searchObject != null,
    }
  );

  const handleClickPeopleTab = () => {
    searchParams.set('f', 'user');
    setSearchParams(searchParams);
  };

  const handleClickMediaTab = () => {
    searchParams.set('f', 'media');
    setSearchParams(searchParams);
  };

  const selectedTabExtraStyles = 'pb-3 border-b-4 border-b-twitter';

  let listContent = (
    <TweetList
      tweets={tweets}
      isLoading={isLoading}
      isSuccess={isSuccess}
      isError={isError}
      error={error}
      showParentTweet={false}
    />
  );
  if (selectedTab === 'People') {
    listContent = <SearchedUsersList searchText={searchText} />;
  } else if (selectedTab === 'Media') {
    listContent = <SearchedMediaTweets searchText={searchText} />;
  }

  return (
    <div className='relative'>
      {/* Tabs: top-14 because the above Searchbar in 'ExploreAndSearchContainer.tsx' is h-14 */}
      <div className='grid grid-cols-3 border-b-[1px] border-b-gray-200 sticky top-14 z-40 bg-white'>
        <div
          onClick={handleClickTweetsTab}
          className='text-gray-600 font-semibold flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer'
        >
          <div
            className={`w-fit py-4 ${
              selectedTab === 'Tweets' && selectedTabExtraStyles
            }`}
          >
            Tweets
          </div>
        </div>

        <div
          onClick={handleClickPeopleTab}
          className='text-gray-600 font-semibold flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer'
        >
          <div
            className={`w-fit py-4 ${
              selectedTab === 'People' && selectedTabExtraStyles
            }`}
          >
            People
          </div>
        </div>

        <div
          onClick={handleClickMediaTab}
          className='text-gray-600 font-semibold flex items-center justify-center hover:bg-gray-200 hover:cursor-pointer'
        >
          <div
            className={`w-fit py-4 ${
              selectedTab === 'Media' && selectedTabExtraStyles
            }`}
          >
            Media
          </div>
        </div>
      </div>

      {listContent}
    </div>
  );
};

export default SearchPage;
