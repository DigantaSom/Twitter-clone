import { TokenPayloadUser } from '../../types';

export interface ReplyState {
  createReplyPopupData: CreateReplyPopupData;
}

export interface CreateReplyPopupData {
  currentUser: TokenPayloadUser | null;
  replyingTo: {
    profilePicture: string;
    fullName: string;
    username: string;
  };
  caption: string;
  isMediaPresent: boolean;
  creationDate: string;
}
