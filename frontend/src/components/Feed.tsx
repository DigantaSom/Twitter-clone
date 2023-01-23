import Header from './Header';
import CreateTweet from '../features/tweet/CreateTweet';
import TweetList from '../features/tweet/TweetList';

const Feed = () => {
  return (
    <>
      <Header />
      <CreateTweet />
      <TweetList />
    </>
  );
};

export default Feed;
