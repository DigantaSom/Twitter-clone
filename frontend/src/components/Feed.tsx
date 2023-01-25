import Header from './Header';
import CreateTweet from '../features/tweet/CreateTweet';
import TweetList from '../features/tweet/TweetList';

const Feed = () => {
  return (
    <>
      <Header />
      <CreateTweet from='Feed' />
      <TweetList />
    </>
  );
};

export default Feed;
