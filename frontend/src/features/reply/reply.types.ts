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
