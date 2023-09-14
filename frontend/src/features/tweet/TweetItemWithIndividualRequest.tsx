import { FC } from 'react';

import { useGetTweetByIdQuery } from './tweet.api-slice';

import TweetItem from './TweetItem';

interface TweetItemWithIndividualRequest_props {
  tweetId: string;
}

const TweetItemWithIndividualRequest: FC<
  TweetItemWithIndividualRequest_props
> = ({ tweetId }) => {
  const { data: tweet } = useGetTweetByIdQuery(
    { id: tweetId },
    { refetchOnMountOrArgChange: true, skip: !tweetId }
  );

  let content = <></>;

  if (tweet) {
    content = (
      <TweetItem
        tweet={tweet}
        isParentTweetItem={false}
        retweetedPost={null}
        showParentTweet={false}
      />
    );
  }

  return content;
};

export default TweetItemWithIndividualRequest;
