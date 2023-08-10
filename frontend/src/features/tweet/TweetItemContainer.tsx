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

  const { data: retweetRefTweet } = useGetTweetByIdQuery(
    { id: tweet.retweetOf || '' },
    { skip: !tweet.retweetOf }
  );

  let content = <></>;

  if (tweet.retweetOf && tweet.retweetedBy && retweetRefTweet) {
    content = (
      <TweetItem
        tweet={retweetRefTweet}
        retweetedPost={tweet}
        isParentTweetItem={false}
        showParentTweet={false}
      />
    );
  } else {
    content = (
      <>
        {!!parentTweet && !parentTweet.isDeleted && (
          <TweetItem
            tweet={parentTweet}
            isParentTweetItem={true}
            showParentTweet={false}
            retweetedPost={null}
          />
        )}
        <TweetItem
          tweet={tweet}
          isParentTweetItem={false}
          showParentTweet={showParentTweet && !parentTweet?.isDeleted}
          retweetedPost={null}
        />
      </>
    );
  }

  return content;
};

export default TweetItemContainer;
