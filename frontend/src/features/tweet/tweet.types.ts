import { UserID } from '../user/user.types';

export interface TweetState {
  newTweetData: AddNewTweetArg;
}

export interface Tweet {
  _id: string;
  parentTweetId: string | null;
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
  numberOfReplies: number;
  isDeleted: boolean;
}

export type TweetResponse = {
  ids: [string];
  entities: Record<string, Tweet>;
};

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

export type LikeTweetArg = {
  tweetId: string;
};

export type LikeResponse = { userId: UserID }[];
