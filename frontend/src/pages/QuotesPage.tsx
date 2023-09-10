import { useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

import { useGetQuotesQuery } from '../features/tweet/tweet.api-slice';

import Header from '../components/Header';
import TweetItem_withIndividualRequest from '../features/tweet/TweetItem_withIndividualRequest';

const QuotesPage = () => {
  const { tweetId } = useParams();

  const {
    data: quotes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetQuotesQuery(
    { tweetId: tweetId || '' },
    {
      pollingInterval: 15000,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      skip: !tweetId,
    }
  );

  let bodyContent;

  if (isLoading) {
    bodyContent = <PulseLoader color='#1D9BF0' />; // same as twitter-default color
  } else if (isError) {
    console.log('Error loading tweets', error);
    bodyContent = (
      <div className='p-2 ph_sm:p-4'>
        {(error as any)?.data?.message || 'Error loading tweets.'}
      </div>
    );
  } else if (isSuccess && quotes?.length) {
    bodyContent = quotes.map(quote => (
      <TweetItem_withIndividualRequest
        key={quote._id}
        tweetId={quote.tweetId}
      />
    ));
  }

  return (
    <div>
      <Header parentComponent='QuotesPage' />
      {bodyContent}
    </div>
  );
};

export default QuotesPage;
