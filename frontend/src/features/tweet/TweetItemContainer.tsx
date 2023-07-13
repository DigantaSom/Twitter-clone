import { FC } from 'react';

import { Tweet } from './tweet.types';
import { useGetTweetByIdQuery } from './tweet.api-slice';

import TweetItem from './TweetItem';

interface TweetItemContainerProps {
  tweet: Tweet;
  showParentTweet: boolean;
}

const TweetItemContainer: FC<TweetItemContainerProps> = ({
  tweet,
  showParentTweet,
}) => {
  const { data: parentTweet } = useGetTweetByIdQuery(
    { id: tweet.parent || '' },
    { skip: tweet.degree === 0 || !showParentTweet }
  );

  return (
    <>
      {!!parentTweet && !parentTweet.isDeleted && (
        <TweetItem
          tweet={parentTweet}
          isParentTweetItem={true}
          showParentTweet={false}
        />
      )}
      <TweetItem
        tweet={tweet}
        isParentTweetItem={false}
        showParentTweet={showParentTweet && !parentTweet?.isDeleted}
      />
    </>
  );
};

export default TweetItemContainer;
