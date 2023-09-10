import { FC } from 'react';

import { useGetTweetByIdQuery } from './tweet.api-slice';

import TweetItem from './TweetItem';

interface TweetItem_withIndividualRequest_props {
  tweetId: string;
}

const TweetItem_withIndividualRequest: FC<
  TweetItem_withIndividualRequest_props
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

export default TweetItem_withIndividualRequest;
