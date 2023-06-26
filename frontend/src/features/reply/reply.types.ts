import { Tweet } from '../tweet/tweet.types';
import { TokenPayloadUser } from '../../types';

export interface ReplyState {
  createReplyPopupData: CreateReplyPopupData;
}

export interface CreateReplyPopupData {
  currentUser: TokenPayloadUser | null;
  parentTweetId: string;
  parentTweetDegree: number;
  replyingTo: {
    profilePicture: string;
    fullName: string;
    username: string;
  };
  caption: string;
  isMediaPresent: boolean;
  creationDate: string;
}

export interface GetRepliesArg {
  parentTweetId: string;
}

// export interface Reply extends Tweet {
//   id: string;
//   text: string;
//   inner_replies: Reply[];
// }

// export type AddNewReplyArg = {
//   tweetId: string;
//   text: string;
//   media: string[];
// };
