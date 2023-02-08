import { Tweet } from '../tweet/tweet.types';
import { TokenPayloadUser } from '../../types';

export interface ReplyState {
  createReplyPopupData: CreateReplyPopupData;
}

export interface CreateReplyPopupData {
  currentUser: TokenPayloadUser | null;
  tweetId: string;
  replyingTo: {
    profilePicture: string;
    fullName: string;
    username: string;
  };
  caption: string;
  isMediaPresent: boolean;
  creationDate: string;
}

export interface Reply extends Tweet {
  inner_replies: Reply[];
}

export type AddNewReplyArg = {
  tweetId: string;
  text: string;
  media: string[];
};
