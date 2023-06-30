import Header from './Header';
import CreateTweet from '../features/tweet/CreateTweet';
import TweetList from '../features/tweet/TweetList';

const Feed = () => {
  return (
    // this margin-bottom is to compensate for the height of <BottomNavigation /> i.e. h-12
    <div className='mb-12'>
      <Header />
      <CreateTweet from='Feed' />
      <TweetList />
    </div>
  );
};

export default Feed;
