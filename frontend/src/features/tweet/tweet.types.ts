import { UserID } from '../user/user.types';
import { Reply } from '../reply/reply.types';

export interface TweetState {
  newTweetData: AddNewTweetArg;
}

export interface Tweet {
  _id: string;
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
  replies: Reply[];
  inner_replies: Reply[];
}

export type TweetResponse = {
  ids: [string];
  entities: Record<string, Tweet>;
};

export type AddNewTweetArg = {
  caption: string;
  media: [string];
};

export type DeleteTweetArg = {
  tweetId: string;
};

export type LikeTweetArg = {
  tweetId: string;
};

export type LikeResponse = { userId: UserID }[];
