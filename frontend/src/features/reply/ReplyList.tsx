import { FC } from 'react';

import { Reply } from './reply.types';

import ReplyItem from './ReplyItem';

interface ReplyListProps {
  replies: Reply[];
  tweetAuthorUsername: string;
}

const ReplyList: FC<ReplyListProps> = ({ replies, tweetAuthorUsername }) => {
  console.log(replies);

  let content;

  if (replies.length < 1) {
    content = null;
  } else {
    content = replies.map(reply => (
      <ReplyItem
        key={reply._id}
        reply={reply}
        tweetAuthorUsername={tweetAuthorUsername}
      />
    ));
  }

  return <>{content}</>;
};

export default ReplyList;
