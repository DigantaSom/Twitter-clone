import { useGetBookmarksQuery } from '../features/user/user.api-slice';

import Header from '../components/Header';
import TweetList from '../features/tweet/TweetList';

const BookmarksPage = () => {
  const {
    data: bookmarkedTweets,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBookmarksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div>
      <Header parentComponent='BookmarksPage' />
      <TweetList
        showParentTweet={false}
        tweets={bookmarkedTweets}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
      />
    </div>
  );
};

export default BookmarksPage;
