import { UserID } from '../user/user.types';

export interface TweetState {
  newTweetData: AddNewTweetArg;
}

export interface Tweet {
  _id: string;
  parent: string | null;
  degree: number;
  userId: string | null; // nullable only in case of retweet or quote
  fullName: string;
  twitterHandle: string;
  profilePicture: string;
  caption: string;
  text: string;
  media: string[];
  creationDate: string;
  likes: UserID[];
  retweetOf: string | null; // retweet-ref tweet id
  retweetedBy: RetweetedBy;
  retweets: UserID[];
  bookmarks: UserID[];
  numberOfReplies: number;
  isDeleted: boolean;
}

export type RetweetedBy = {
  userId: string;
  username: string;
  fullName: string;
} | null;

export type AddNewTweetArg = {
  parentTweetId: string | null;
  tweetDegree: number;
  caption: string;
  media: [string];
};

export type DeleteTweetArg = {
  tweetId: string;
  parentTweetId: string | null;
};

export type TweetIdArg = { tweetId: string };

export type RetweetArgs = {
  refTweetId: string;
  retweetedPostId: string | undefined;
};

export type GetRetweetedPostId_Response = {
  loggedInUser_retweetedPostId: string | undefined;
};
export type GetRetweetedPostId_Args = {
  refTweetId: string;
  loggedInUsername: string | undefined;
};

export type LikeResponse = { userId: UserID }[];

export type SingleMessageResponse = { message: string };

export interface GetRepliesArg {
  parentTweetId: string | undefined;
}
