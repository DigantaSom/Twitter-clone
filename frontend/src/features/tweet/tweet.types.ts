import { UserID } from '../user/user.types';

export interface TweetState {
  newTweetData: AddNewTweetArg;
}

export interface Tweet {
  _id: string;
  parent: string | null;
  degree: number;
  userId: string;
  fullName: string;
  twitterHandle: string;
  profilePicture: string;
  caption: string;
  text: string;
  media: string[];
  creationDate: string;
  likes: UserID[];
  retweets: UserID[];
  bookmarks: UserID[];
  numberOfReplies: number;
  isDeleted: boolean;
}

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

export type LikeResponse = { userId: UserID }[];

export type BookmarkResponse = { message: string };

export interface GetRepliesArg {
  parentTweetId: string | undefined;
}
